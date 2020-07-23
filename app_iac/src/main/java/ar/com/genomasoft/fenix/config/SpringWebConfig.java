package ar.com.genomasoft.fenix.config;
 
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Import;
import org.springframework.context.annotation.PropertySource;
import org.springframework.http.MediaType;
import org.springframework.http.converter.ByteArrayHttpMessageConverter;
import org.springframework.http.converter.HttpMessageConverter;
import org.springframework.http.converter.ResourceHttpMessageConverter;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.web.multipart.MultipartResolver;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.springframework.web.servlet.config.annotation.EnableWebMvc;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.ViewControllerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
import org.thymeleaf.templateresolver.ClassLoaderTemplateResolver;

import ar.com.genomasoft.jproject.webutils.utils.HibernateAwareObjectMapper;
 
@Configuration
@PropertySource("classpath:application.properties")
@EnableWebMvc
@Import({SwaggerConfiguration.class})
@ComponentScan({"ar.com.genomasoft.fenix.rest", "ar.com.genomasoft.fenix.controller"})
public class SpringWebConfig extends WebMvcConfigurerAdapter {
 
	@Value("${spring.thymeleaf.cache}")
	private Boolean thymeleafCache;
	
	private static final String[] CLASSPATH_RESOURCE_LOCATIONS = {
			"classpath:/resources/",
			"classpath:/static/", 
			"classpath:/public/" 
			};
	
	@Override
	public void addResourceHandlers(ResourceHandlerRegistry registry) {
		registry.addResourceHandler("/resources/**").addResourceLocations("/resources/");
        
		registry.addResourceHandler("swagger-ui.html")
        	.addResourceLocations("classpath:/META-INF/resources/");

		registry.addResourceHandler("/webjars/**").addResourceLocations(
				"classpath:/META-INF/resources/webjars/").resourceChain(false);
		
		registry.addResourceHandler("/**")
			.addResourceLocations(CLASSPATH_RESOURCE_LOCATIONS);
	}
	
	  @Bean
	  public ClassLoaderTemplateResolver emailTemplateResolver(){
	    ClassLoaderTemplateResolver emailTemplateResolver=new ClassLoaderTemplateResolver();
	    emailTemplateResolver.setPrefix("templates");
	    emailTemplateResolver.setTemplateMode("HTML5");
	    emailTemplateResolver.setSuffix(".html");
	    emailTemplateResolver.setTemplateMode("XHTML");
	    emailTemplateResolver.setCharacterEncoding("UTF-8");
	    emailTemplateResolver.setOrder(1);
	    emailTemplateResolver.setCacheable(thymeleafCache);
	    return emailTemplateResolver;
	  }

    @Override
    public void addViewControllers(ViewControllerRegistry registry) {
        registry.addRedirectViewController("/documentation/v2/api-docs", 			"/v2/api-docs");
        registry.addRedirectViewController("/documentation/configuration/ui", 		"/configuration/ui");
        registry.addRedirectViewController("/documentation/configuration/security", "/configuration/security");
        registry.addRedirectViewController("/documentation/swagger-resources", 		"/swagger-resources");
        registry.addRedirectViewController("/documentation", 						"/documentation/swagger-ui.html");
    }
	@Bean
	public MultipartResolver multipartResolver() {
		MultipartResolver resolver = new StandardServletMultipartResolver();
	    return resolver;
	}

    @Override
    public void configureMessageConverters(List<HttpMessageConverter<?>> converters) {
        List<MediaType> supportedMediaTypes = new ArrayList<MediaType>();
        supportedMediaTypes.add(MediaType.APPLICATION_JSON);
        supportedMediaTypes.add(MediaType.TEXT_PLAIN);
        MappingJackson2HttpMessageConverter converter=new MappingJackson2HttpMessageConverter();
        converter.setObjectMapper(new HibernateAwareObjectMapper());
        converter.setPrettyPrint(true);
        converter.setSupportedMediaTypes(supportedMediaTypes);
        converters.add(converter);
        converters.add(new ByteArrayHttpMessageConverter());
        converters.add(new ResourceHttpMessageConverter());
        super.configureMessageConverters(converters);
    }

    /*
	@Override
	public void addInterceptors(InterceptorRegistry registry) {
		LocaleChangeInterceptor interceptor = new LocaleChangeInterceptor();
		interceptor.setParamName("lang");
		registry.addInterceptor(interceptor);
	}
    */
}