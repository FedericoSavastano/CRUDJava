package ar.com.genomasoft.fenix.dao;

import java.util.Collection;
import java.util.List;

import org.hibernate.SQLQuery;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import ar.com.genomasoft.fenix.model.Rol;
import ar.com.genomasoft.fenix.model.Usuario;
import ar.com.genomasoft.jproject.core.daos.BaseClientAuditedEntityDaoImpl;
import ar.com.genomasoft.jproject.core.exception.BaseException;
import ar.com.genomasoft.jproject.core.exception.BusinessException;
import ar.com.genomasoft.jproject.core.exception.InternalErrorException;

@Component
public class UsuarioDaoImpl extends BaseClientAuditedEntityDaoImpl<Usuario> implements UsuarioDao {

	private static final int MAX_ATTEMPTS = 3;
	
	@Transactional(rollbackFor=Exception.class)
	public void updateFailAttempts(String email) throws BaseException {
		Usuario usuario = getUsuarioByEmail(email);
		usuario.setAttempts(usuario.getAttempts()+1);
		if (usuario.getAttempts()>= MAX_ATTEMPTS) {
			usuario.setAccountNonLocked(false);
		}
		SQLQuery query = getSessionFactory().getCurrentSession().createSQLQuery("UPDATE usr_usuario SET ATTEMPTS=?, ACCOUNT_NON_LOCKED=?, updated_user=0, updated_time=current_timestamp where email=?");
		query.setLong(0, usuario.getAttempts());
		query.setBoolean(1, usuario.isAccountNonLocked());
		query.setString(2, email);
		query.executeUpdate();
	}

	@Transactional(rollbackFor=Exception.class)
	public void resetFailAttempts(String email) throws BaseException {
		SQLQuery query = getSessionFactory().getCurrentSession().createSQLQuery("UPDATE usr_usuario SET ATTEMPTS=0, updated_user=0, updated_time=current_timestamp where email=?");
		query.setString(0, email);
		query.executeUpdate();
	}

	@Transactional(rollbackFor=Exception.class)
	public Integer getUserAttempts(String email) throws BaseException {
		 return getUsuarioByEmail(email).getAttempts();
	}

	@SuppressWarnings("unchecked")
	@Transactional(rollbackFor=Exception.class)
	public Usuario getUsuarioByEmail(String email) throws BaseException {
		List<Usuario> usuarios = 
				(List<Usuario>) getSessionFactory().getCurrentSession()
				.createSQLQuery("SELECT * FROM usr_usuario WHERE email=?" )
				.addEntity( Usuario.class )
				.setString(0, email)
				.list();
		 if (usuarios == null || usuarios.size()==0) {
			 logger.error("Usuario inexistente: " + email);
			 throw new BusinessException("entity.not.found");
		 }
		 if (usuarios.size()!=1) {
			 logger.error("Usuario con multiples ocurrencias: " + email);
			 throw new InternalErrorException("found.multiple.entities.when.expected.zero.or.one");
		 }
		 return usuarios.get(0);
	}

	@SuppressWarnings("unchecked")
	@Transactional(rollbackFor=Exception.class)
	public Collection<Rol> getRolesByUserId(Integer userId) throws BaseException{
		Collection<Rol> roles = 
				(Collection<Rol>) getSessionFactory().getCurrentSession()
				.createSQLQuery("SELECT r.* FROM USR_ROL r INNER JOIN USR_USUARIO_ROL ur ON r.ID=ur.ROL_ID WHERE ur.USUARIO_ID=?" )
				.addEntity( Rol.class )
				.setInteger(0, userId)
				.list();
		 return roles;		
	}
	
}