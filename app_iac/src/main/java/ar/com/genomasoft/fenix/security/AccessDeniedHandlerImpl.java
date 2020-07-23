package ar.com.genomasoft.fenix.security;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.http.HttpStatus;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

@Component
public class AccessDeniedHandlerImpl implements AccessDeniedHandler {
	
	@Value("${server.context-path}")
	private String contextPath;

    private static Logger logger = LoggerFactory.getLogger(AccessDeniedHandlerImpl.class);

    public void handle(HttpServletRequest httpServletRequest,
                       HttpServletResponse httpServletResponse,
                       AccessDeniedException e) throws IOException, ServletException {
        Authentication auth
                = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null) {		
            logger.info("User '" + auth.getName() + "' attempted to access the protected URL: "
                    + httpServletRequest.getRequestURI());
        }
        if(httpServletRequest.getRequestURI().contains(contextPath + "/api/")) {
//        String ajaxHeader = ((HttpServletRequest) httpServletRequest).getHeader("X-Requested-With");
//        if ("XMLHttpRequest".equals(ajaxHeader)){
        	// si pregunto por XMLHttpRequest, limito el consumo a llamadas ajax
        	httpServletResponse.setStatus(HttpStatus.SC_FORBIDDEN);       	
        } else {
        	httpServletResponse.sendRedirect(httpServletRequest.getContextPath() + "/403");
        }
    }
}
