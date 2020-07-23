package ar.com.genomasoft.fenix.config;

import javax.annotation.Resource;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;

import ar.com.genomasoft.jproject.core.exception.BaseException;
import ar.com.genomasoft.jproject.core.exception.InternalErrorException;

@Configuration
@EnableScheduling
public class SpringSchedulingConfig {
	
    private static final Logger LOGGER = LoggerFactory.getLogger(Application.class);
	
	@Resource
	private Environment env;
	
	
	@Scheduled(fixedDelay = 5000)
	public void procesarPresentacionesPendienteScheduleTask() {
	
	}
}
