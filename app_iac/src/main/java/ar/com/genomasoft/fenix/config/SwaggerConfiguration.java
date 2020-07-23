package ar.com.genomasoft.fenix.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.ResponseEntity;

import ar.com.genomasoft.jproject.core.wrapper.GridWrapper;
import springfox.documentation.builders.ApiInfoBuilder;
import springfox.documentation.builders.PathSelectors;
import springfox.documentation.builders.RequestHandlerSelectors;
import springfox.documentation.service.ApiInfo;
import springfox.documentation.service.Contact;
import springfox.documentation.spi.DocumentationType;
import springfox.documentation.spring.web.plugins.Docket;
import springfox.documentation.swagger2.annotations.EnableSwagger2;

@Configuration
@EnableSwagger2
public class SwaggerConfiguration {

	@Bean
    public Docket api() { 
        return new Docket(DocumentationType.SWAGGER_2)
          .apiInfo(getApiInfo())
          .genericModelSubstitutes(ResponseEntity.class)
          .genericModelSubstitutes(GridWrapper.class)
          .pathMapping("/")
          .select()
          	.apis(RequestHandlerSelectors.basePackage("ar.com.genomasoft.fenix.rest"))
          	.paths(PathSelectors.any())
          	.build();                
    }

    public ApiInfo getApiInfo() {
    	Contact contact = new Contact(	"Alejandro Daniel Curci", 
    									"http://www.genomasoft.com.ar", 
    									"acurci@genomasoft.com.ar");
    	
    	ApiInfoBuilder apiBuilder = new ApiInfoBuilder();
    	return apiBuilder
    			.title("Fénix - Sistema de Gestión de Mutuales y Cooperativas")
   				.description("REST API para el manejo de las entidades de negocio del sistema Fénix.\n")
   				.contact(contact)
    			.version("v1")
    			.build();
    }
}
