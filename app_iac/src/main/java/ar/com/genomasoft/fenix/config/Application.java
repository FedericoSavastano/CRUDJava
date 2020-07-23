package ar.com.genomasoft.fenix.config;

import javax.annotation.Resource;
import javax.sql.DataSource;

import org.hibernate.SessionFactory;
import org.hibernate.jpa.HibernateEntityManagerFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.context.support.PropertySourcesPlaceholderConfigurer;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.transaction.annotation.EnableTransactionManagement;

@SpringBootApplication
@Configuration
@EnableAutoConfiguration
@EnableTransactionManagement
@org.springframework.context.annotation.PropertySources({
	@PropertySource("classpath:application.properties"),
	@PropertySource("file:/apps/iac/iac.properties"),
	@PropertySource("classpath:build.properties")
})
@ComponentScan(basePackages={"ar.com.genomasoft.fenix"})
@EntityScan( basePackages = {"ar.com.genomasoft.fenix.model"} )
public class Application {

    private static final Logger LOGGER = LoggerFactory.getLogger(Application.class);
	
	@Resource
	private Environment env;
	
	@Autowired
	DataSource datasource;

	public static void main(String[] args) {
        SpringApplication app = new SpringApplication(Application.class);
        app.run(args);
	}
	
	public Application() {
//        LOGGER.trace("Test level log TRACE");
        LOGGER.debug("Test level log DEBUG");
        LOGGER.info( "Test level log INFO");
        LOGGER.warn( "Test level log WARN");
        LOGGER.error("Test level log ERROR");
    }
	
	@Bean
	public static PropertySourcesPlaceholderConfigurer properties() {
		return new PropertySourcesPlaceholderConfigurer();
	}
	
	@Bean  
	public SessionFactory sessionFactory(HibernateEntityManagerFactory hemf){  
	    return hemf.getSessionFactory();  
	}
	
	@Bean
	public BCryptPasswordEncoder passwordEncoder() {
		BCryptPasswordEncoder bCryptPasswordEncoder = new BCryptPasswordEncoder();
		return bCryptPasswordEncoder;
	}

}
