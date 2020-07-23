package ar.com.genomasoft.fenix.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ar.com.genomasoft.fenix.model.Usuario;
import ar.com.genomasoft.fenix.service.UsuarioService;
import ar.com.genomasoft.jproject.webutils.webservices.BaseAuditedEntityWebService;
import io.swagger.annotations.Api;

@RestController
@Api("Usuarios - Servicio web REST")
@RequestMapping(path = "/api/usuarios")
public class UsuarioRest extends BaseAuditedEntityWebService<Usuario, UsuarioService> {

	
	// TODO crear el metodo getMe para uso del perfil afiliado (authority necesaria USUARIO_GET_ME)
	
}
