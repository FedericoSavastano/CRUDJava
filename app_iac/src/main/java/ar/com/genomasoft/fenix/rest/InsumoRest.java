package ar.com.genomasoft.fenix.rest;
	
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ar.com.genomasoft.fenix.model.Insumo;
import ar.com.genomasoft.fenix.service.InsumoService;
import ar.com.genomasoft.jproject.webutils.webservices.BaseClientAuditedEntityWebService;
import io.swagger.annotations.Api;

@RestController
@Api("Insumos - Servicio web REST")
@RequestMapping(path = "/api/insumos")
public class InsumoRest extends BaseClientAuditedEntityWebService<Insumo, InsumoService> {
	
	
	
}
