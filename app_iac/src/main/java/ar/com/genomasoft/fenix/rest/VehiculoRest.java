package ar.com.genomasoft.fenix.rest;
	
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ar.com.genomasoft.fenix.model.Vehiculo;
import ar.com.genomasoft.fenix.service.VehiculoService;
import ar.com.genomasoft.jproject.webutils.webservices.BaseClientAuditedEntityWebService;
import io.swagger.annotations.Api;

@RestController
@Api("Personas - Servicio web REST")
@RequestMapping(path = "/api/vehiculos")
public class VehiculoRest extends BaseClientAuditedEntityWebService<Vehiculo, VehiculoService> {
	
	
	
}
