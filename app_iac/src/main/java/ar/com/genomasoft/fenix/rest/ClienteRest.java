package ar.com.genomasoft.fenix.rest;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ar.com.genomasoft.fenix.model.Cliente;
import ar.com.genomasoft.fenix.service.ClienteService;
import ar.com.genomasoft.jproject.webutils.webservices.BaseAuditedEntityWebService;
import io.swagger.annotations.Api;

@RestController
@Api("Cliente - Servicio web REST")
@RequestMapping(path = "/api/clientes")
public class ClienteRest extends BaseAuditedEntityWebService<Cliente, ClienteService> {
	
}
