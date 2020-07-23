package ar.com.genomasoft.fenix.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class DefaultController {
	
	/* ***** PAGINAS AUTENTICADAS (Para todos los PERFILES) ***** */
	@GetMapping(value={"/", "/home", "/index", "/usuario"})
	public String getDefaultPage() {
		return "/secured/index";
	}

	/* ***** PAGINAS PUBLICAS ***** */
	@GetMapping("/info")
	public String getInfoPage() {
		return "/info";
	}
	
	@GetMapping("/login")
	public String login() {
		return "/login";
	}
	
	@GetMapping(value="/demo")
	public String registration(){
		return "/demo";
	}
	
	@GetMapping(value="/registro")
	public String registroCliente(){
		// TODO el form de registro debe tener un captcha
		return "/registro";
	}

	
//	/* ***** PAGINAS AUTENTICADAS PARA PERFIL GENOMA ***** */
//	@GetMapping("/genoma/clientes")
//	public String genomaClientes() {
//		return "/secured/genoma/clientes";
//	}
//
//	
//	/* ***** PAGINAS AUTENTICADAS PARA PERFIL ADMIN ***** */
//
//	
//	@GetMapping("/admin/afiliados/tipos")
//	public String adminTipoAfiliados() {
//		return "/secured/admin/tipoafiliados";
//	}
//	
//	@GetMapping("/admin/periodos")
//	public String adminPeriodos() {
//		return "/secured/admin/periodos";
//	}
//		
	/* ***** PAGINAS AUTENTICADAS PARA PERFIL USUARIO ***** */
	@GetMapping("/usuario/personas")
	public String usuarioPersonas() {
		return "/secured/usuario/personas";
	}
	
	 
	@GetMapping("/usuario/abm")
	public String usuarioabm() {
		return "/secured/usuario/abm";
	}
	
	 
	@GetMapping("/usuario/vehiculos")
	public String vehiculosabm() {
		return "/secured/usuario/vehiculos";
	}
	
	@GetMapping("/usuario/vehiculostest")
	public String vehiculostest() {
		return "/secured/usuario/vehiculostest";
	}
	
	@GetMapping("/usuario/insumos")
	public String insumos() {
		return "/secured/usuario/insumos";
	}
	
//
//	@GetMapping("/usuario/personasjq")
//	public String usuarioPersonasjq() {
//		return "/secured/usuario/personasjq";
//	}	
//	
//	@GetMapping("/usuario/presentacion")
//	public String usuariopresentacion() {
//		return "/secured/usuario/presentacion";
//	}
//	
//	
//	@GetMapping("/usuario/presentacionAlta")
//	public String usuariopresentacionAlta() {
//		return "/secured/usuario/presentacionAlta";
//	}
//	
//	
//	@GetMapping("/usuario/afiliados")
//	public String usuarioAfiliados() {
//		return "/secured/usuario/afiliados";
//	}
//	
//	@GetMapping("/usuario/bancos")
//	public String usuarioBancos() {
//		return "/secured/usuario/bancos";
//	}
//	
//	@GetMapping("/usuario/afiliadosAlta")
//	public String usuarioAfiliadosAlta() {
//		return "/secured/usuario/afiliadosAlta";
//	}
//	
//	@GetMapping("/usuario/liquidacion")
//	public String usuarioLiquidacion() {
//		return "/secured/usuario/liquidacion";
//	}
//			
//	@GetMapping("/usuario/liquidacionFicha/{liquidacionId}")
//	public ModelAndView usuarioLiquidacionFicha(@PathVariable Integer liquidacionId) throws InternalErrorException {
//		
//		ModelAndView modelAndView = new ModelAndView();
//		
//		try {
//			
//			
//			
//		} catch (Exception e) {
//			throw new InternalErrorException("Imposible cargar los datos de la liquidación.", e);
//		} 
//		
//		modelAndView.setViewName("/secured/usuario/liquidacionFicha");
//		
//		return modelAndView;
//	}
//	
//	@GetMapping("/usuario/presentacionFicha/{presentacionId}")
//	public ModelAndView usuarioPresentacionFicha(@PathVariable Integer presentacionId) throws InternalErrorException {
//		
//		ModelAndView modelAndView = new ModelAndView();
//		
//		try {
//			
//		} catch (Exception e) {
//			throw new InternalErrorException("Imposible cargar los datos de la presentacion.", e);
//		} 
//		
//		modelAndView.setViewName("/secured/usuario/presentacionFicha");
//		
//		return modelAndView;
//	}
//
//	
//	
//	@GetMapping("/usuario/liquidacionAlta")
//	public String usuarioLiquidacionAlta() {
//		return "/secured/usuario/liquidacionAlta";
//	}
//	
//	@GetMapping("/usuario/servicios")
//	public String genomaServicios() {
//		return "/secured/usuario/servicios";
//	}	
//
//	@GetMapping("/usuario/servicios/suscripciones")
//	public String genomaServiciosSuscripciones() {
//		return "/secured/usuario/serviciosSuscripciones";
//	}
//	
//	@GetMapping("/usuario/proveedores")
//	public String usuarioProveedores() {
//		return "/secured/usuario/proveedores";
//	}
//	
//	/* ***** PAGINAS AUTENTICADAS PARA PERFIL AFILIADO ***** */
//	

	
	/* ***** ERRORES ***** */
	
	@GetMapping("/403")
	public String error403() {
    	return "/error/403";
	}

	@GetMapping("/404")
	public String error404() {
	    return "/error/404";
	}

	@GetMapping("/500")
	public String error500() {
	    return "/error/500";
	}
}
