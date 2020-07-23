package ar.com.genomasoft.fenix.rest;

import java.io.IOException;

import javax.persistence.EntityNotFoundException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import ar.com.genomasoft.fenix.security.ErrorMessage;
import ar.com.genomasoft.jproject.core.exception.BusinessException;
import ar.com.genomasoft.jproject.core.utils.MimeTypeUtils.MimeType;
import javassist.NotFoundException;


@ControllerAdvice
public class RestReponseEntityExceptionHandler extends ResponseEntityExceptionHandler {

	@Value("${system.name}")
	String systemName;

	@Value("${system.version}")
	String systemVersion;
	
	
    @ExceptionHandler(value = { Exception.class })
	protected void handleCustomException(Exception ex, HttpServletRequest request, HttpServletResponse response) {
    	String error = ErrorMessage.getMessage(systemName + "(" + systemVersion + ")", 500, "Error inesperado", request, ex);
    	response.setStatus(555);
    	response.setContentType(MimeType.MIME_APPLICATION_JSON.getMimeType());
    	try {
			response.getWriter().write(error);
			response.getWriter().flush();
			response.getWriter().close();  
		} catch (IOException e) {
			logger.error(error, e);
		}
	}
	
	@ExceptionHandler(value = { BusinessException.class })
	protected void handleBusinessException(BusinessException ex, HttpServletRequest request, HttpServletResponse response) {
    	String error = ErrorMessage.getMessage(systemName + "(" + systemVersion + ")", HttpStatus.BAD_REQUEST.value(), ex.getMessage(), request, ex);
    	response.setStatus(HttpStatus.BAD_REQUEST.value());
    	response.setContentType(MimeType.MIME_APPLICATION_JSON.getMimeType());
    	try {
			response.getWriter().write(error);
			response.getWriter().flush();
			response.getWriter().close();  
		} catch (IOException e) {
			logger.error(error, e);
		}
	}

	@ExceptionHandler(value = { EntityNotFoundException.class, NotFoundException.class })
	protected void handleEntityNotFoundException(Exception ex, HttpServletRequest request, HttpServletResponse response) {
    	String error = ErrorMessage.getMessage(systemName + "(" + systemVersion + ")", HttpStatus.NOT_FOUND.value(), "Entidad no encontrada.", request, ex);
    	response.setStatus(HttpStatus.NOT_FOUND.value());
    	response.setContentType(MimeType.MIME_APPLICATION_JSON.getMimeType());
    	try {
			response.getWriter().write(error);
			response.getWriter().flush();
			response.getWriter().close();  
		} catch (IOException e) {
			logger.error(error, e);
		}
	}
	
	@ExceptionHandler(value = { AccessDeniedException.class })
	protected void handleAccessDeniedException(AccessDeniedException ex, HttpServletRequest request, HttpServletResponse response) {
    	String error = ErrorMessage.getMessage(systemName + "(" + systemVersion + ")", HttpStatus.FORBIDDEN.value(), "Acceso Denegado.", request, ex);
    	response.setStatus(HttpStatus.FORBIDDEN.value());
    	response.setContentType(MimeType.MIME_APPLICATION_JSON.getMimeType());
    	try {
			response.getWriter().write(error);
			response.getWriter().flush();
			response.getWriter().close();  
		} catch (IOException e) {
			logger.error(error, e);
		}
	}

	 
}
