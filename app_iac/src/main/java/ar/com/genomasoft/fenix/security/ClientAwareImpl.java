package ar.com.genomasoft.fenix.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import ar.com.genomasoft.fenix.model.Usuario;
import ar.com.genomasoft.fenix.service.UsuarioService;
import ar.com.genomasoft.jproject.core.daos.ClientAware;

@Component
public class ClientAwareImpl implements ClientAware {

	@Autowired
	UsuarioService usuarioSrv;
	
	public Integer getCurrentClient() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario usuario = (Usuario) auth.getPrincipal();
        return usuario.getClientId();
	}
}
