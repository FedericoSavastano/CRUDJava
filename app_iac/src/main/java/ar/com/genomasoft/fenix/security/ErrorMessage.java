package ar.com.genomasoft.fenix.security;

import java.net.InetAddress;
import java.util.Calendar;
import java.util.Date;

import javax.servlet.ServletRequest;
import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import com.thoughtworks.xstream.XStream;
import com.thoughtworks.xstream.annotations.XStreamAlias;
import com.thoughtworks.xstream.io.json.JettisonMappedXmlDriver;

import ar.com.genomasoft.jproject.core.exception.BusinessException;


@XStreamAlias("error")
public class ErrorMessage {

	private static final Logger logger = LoggerFactory.getLogger(ErrorMessage.class);

	String error_id;
	String system_id;
	String resource;
	String method;
	Date timestamp = Calendar.getInstance().getTime();
	Boolean business_error = false;

	String user_message;
	int status;

	// TODO Estos dos textos deberían ser agregados en el base exception
	String developer_message;
	String error_code;

	public ErrorMessage(String system_id, int status, String message, HttpServletRequest request, Exception ex) {
		this.system_id = system_id;
		this.error_id = java.util.UUID.randomUUID().toString();
		this.resource = request.getRequestURL().toString();
		this.method = request.getMethod();
		this.user_message = message;
		this.status = status;

		if (BusinessException.class.isInstance(ex)) {
			this.business_error = true;
		}

		String hostName = "";
		try {
			hostName = InetAddress.getLocalHost().getHostName();
		} catch (Exception e) {

		}
		logger.error("\n[ " + this.error_id + " ]" + "[" + hostName + "]\n" + "Tipo: " + ex.getClass().getName() + "\n"
				+ "URL: " + request.getRequestURL() + "\n", ex);
	}
	
	public ErrorMessage(String system_id, int status, String message, ServletRequest request, Exception ex) {
		this.system_id = system_id;
		this.error_id = java.util.UUID.randomUUID().toString();
//		this.resource = request.get;
//		this.method = request.get;
		this.user_message = message;
		this.status = status;

		if (BusinessException.class.isInstance(ex)) {
			this.business_error = true;
		}

		String hostName = "";
		try {
			hostName = InetAddress.getLocalHost().getHostName();
		} catch (Exception e) {

		}
		logger.error("\n[ " + this.error_id + " ]" + "[" + hostName + "]\n" + "Tipo: " + ex.getClass().getName() + "\n", ex);
	}
	
    public static String getMessage(String systemName, int status, String message, HttpServletRequest request, Exception ex){
    	return getMessage(systemName, status, message, request, ex, true);
    }
    
    public static String getMessage(String systemName, int status, String message, HttpServletRequest request, Exception ex,boolean logEvent){
    	XStream xstream = new XStream(new JettisonMappedXmlDriver());
    	xstream.autodetectAnnotations(true);
    	ErrorMessage error = new ErrorMessage(systemName, status, message, request, ex);	
    	String hostName = "";
    	try {
    		hostName = InetAddress.getLocalHost().getHostName();
    	}catch(Exception e) {
    		
    	}
    	if(logEvent) {
    		logger.error("\n[ " + error.error_id + " ]["+hostName+"]\nTipo: " + ex.getClass().getName() + "\nURL: " + request.getRequestURL()+"\n", ex);
    	}
    	return xstream.toXML(error);
    }
    
    public static String getMessage(String systemName, int status, String message, ServletRequest request, Exception ex){
    	XStream xstream = new XStream(new JettisonMappedXmlDriver());
    	xstream.autodetectAnnotations(true);
    	ErrorMessage error = new ErrorMessage(systemName, status, message, request, ex);	
    	String hostName = "";
    	try {
    		hostName = InetAddress.getLocalHost().getHostName();
    	}catch(Exception e) {
    		
    	}
   		logger.error("\n[ " + error.error_id + " ]["+hostName+"]\nTipo: " + ex.getClass().getName() + "\n", ex);
    	return xstream.toXML(error);
    }
}
