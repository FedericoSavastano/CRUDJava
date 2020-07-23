package ar.com.genomasoft.fenix.service;

import org.springframework.security.core.userdetails.UserDetailsService;

import ar.com.genomasoft.fenix.model.Usuario;
import ar.com.genomasoft.jproject.core.services.BaseAuditedEntityService;

public interface UsuarioService extends BaseAuditedEntityService<Usuario>, UserDetailsService {

}
