package ar.com.genomasoft.fenix.rest;
	
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ar.com.genomasoft.fenix.model.Articulo;
import ar.com.genomasoft.fenix.service.ArticuloService;
import ar.com.genomasoft.jproject.webutils.webservices.BaseClientAuditedEntityWebService;
import io.swagger.annotations.Api;

@RestController
@Api("Personas - Servicio web REST")
@RequestMapping(path = "/api/articulos")
public class ArticuloRest extends BaseClientAuditedEntityWebService<Articulo, ArticuloService> {
	
	
	
}
