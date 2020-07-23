package ar.com.genomasoft.fenix.rest;
	
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import ar.com.genomasoft.fenix.model.Persona;
import ar.com.genomasoft.fenix.reports.PdfGeneratorUtil;
import ar.com.genomasoft.fenix.service.PersonaService;
import ar.com.genomasoft.jproject.webutils.webservices.BaseClientAuditedEntityWebService;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;

@RestController
@Api("Personas - Servicio web REST")
@RequestMapping(path = "/api/personas")
public class PersonaRest extends BaseClientAuditedEntityWebService<Persona, PersonaService> {
	
	@Autowired
	PdfGeneratorUtil pdfGenaratorUtil;
	
	@Autowired
	PersonaService pService;
	
	@GetMapping(path="/listar")
	@ApiOperation(value = "Listas de personas")
	public @ResponseBody Collection<Persona> getListPersonasSinAfiliar() throws Exception {
		return this.pService.findAll();
	}
	
	@GetMapping(path="/pdf", produces = {MediaType.APPLICATION_PDF_VALUE})
	@ApiOperation(value = "Listado de personas.")
	public @ResponseBody byte[] getPdf() throws Exception {
		 Map<Object,Object> data = new HashMap<Object,Object>();
	    data.put("titulo","Personas");
	    data.put("personas", service.findAll());
	    byte[] reporte = pdfGenaratorUtil.createPdf("/pdf/personas",data); 
	    return reporte;
	}	
	
	@GetMapping(path="/ListarNombreA")
	@ApiOperation(value = "Listas de personas")
	public @ResponseBody Collection<Persona> getListListarNombreA() throws Exception {
		return this.service.findAll();
	}
	
}
