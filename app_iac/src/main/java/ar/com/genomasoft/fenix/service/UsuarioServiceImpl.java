package ar.com.genomasoft.fenix.service;

import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.yaml.YAMLFactory;

import ar.com.genomasoft.fenix.dao.UsuarioDao;
import ar.com.genomasoft.fenix.model.Rol;
import ar.com.genomasoft.fenix.model.Usuario;
import ar.com.genomasoft.jproject.core.exception.BaseException;
import ar.com.genomasoft.jproject.core.exception.InternalErrorException;
import ar.com.genomasoft.jproject.core.services.BaseAuditedEntityServiceImpl;

@Service("userDetailsService")
public class UsuarioServiceImpl extends BaseAuditedEntityServiceImpl<Usuario, UsuarioDao>
		implements UsuarioService, UserDetailsService {
	
	@Value("${security.grainedauth.deffile}")
	String grainedAuthDefFile;
	
	@Transactional(rollbackFor=Exception.class)
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		try {
			Usuario user = this.dao.getUsuarioByEmail(username);
			Collection<Rol> roles = this.dao.getRolesByUserId(user.getId());			
			user.setRoles(roles);
			Collection<GrantedAuthority> authorities = buildUserAuthority(roles);
			user.setAuthorities(authorities);
			return user;
		} catch (BaseException e) {
			throw new UsernameNotFoundException("El usuario: " + username + "no está disponible");
		}
	}
	
	// TODO Vaciar la base y correr nuevamente el script
	// Buscamos el logín por usuario o email?
	// Implementar, recordar contraseña y bloqueo/desbloqueo de cuentas
	@Transactional(rollbackFor=Exception.class)
	private Collection<GrantedAuthority> buildUserAuthority(Collection<Rol> userRoles) {

		Collection<GrantedAuthority> authorities 	= new ArrayList<GrantedAuthority>();

		/******************************************************************
		 * Spring Security. 
		 * Se completan los roles y se derivan las authorities
		 ******************************************************************/
		Map<String,List<String>> authDef = new HashMap<String,List<String>>();
		try {
			authDef = loadAuthorities();
		} catch(InternalErrorException e) {
			logger.error(getClass().getName(), e);
		}
		for(Rol userRole : userRoles) {
				authorities.add(new SimpleGrantedAuthority(userRole.getRol()));
				//Derivar los privilegios de cada uno de los grupos.
				String groupName = userRole.getRol();
				for(String key:authDef.keySet()) {
					  if(authDef.get(key).contains(groupName)) {
						  authorities.add(new SimpleGrantedAuthority(key));
					  }
				}
		}
		return authorities;
	}
	
	@SuppressWarnings("unchecked")
	private Map<String,List<String>>loadAuthorities()throws InternalErrorException{
		Map<String,List<String>> authDef = new HashMap<String,List<String>>();
		if(grainedAuthDefFile!=null) {
			ObjectMapper mapper = new ObjectMapper(new YAMLFactory());
			InputStream is = this.getClass().getClassLoader().getResourceAsStream(grainedAuthDefFile);
			if(is==null) 
				throw new InternalErrorException("No se encuentra la configuración de authorities: "+ grainedAuthDefFile);		
			try {
				authDef = mapper.readValue(is, authDef.getClass());
			}catch(Exception ex) {
				throw new InternalErrorException("Error al obtener la configuración de authorities",ex);
			}
		}
		return authDef;
	}
}
