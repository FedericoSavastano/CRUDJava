package ar.com.genomasoft.fenix.security;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.AuthenticationTrustResolver;
import org.springframework.security.authentication.AuthenticationTrustResolverImpl;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.util.ThrowableAnalyzer;
import org.springframework.security.web.util.ThrowableCauseExtractor;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import ar.com.genomasoft.jproject.core.utils.MimeTypeUtils.MimeType;

@Component
public class AjaxTimeoutRedirectFilter extends GenericFilterBean {

	private static final Logger logger = LoggerFactory.getLogger(AjaxTimeoutRedirectFilter.class);

	@Value("${system.name}")
	String systemName;

	@Value("${system.version}")
	String systemVersion;
	
	@Value("${server.context-path}")
	private String contextPath;

	private ThrowableAnalyzer throwableAnalyzer = new DefaultThrowableAnalyzer();
	private AuthenticationTrustResolver authenticationTrustResolver = new AuthenticationTrustResolverImpl();

	private int customSessionExpiredErrorCode = 901;

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		try {
			chain.doFilter(request, response);
		} catch (IOException ex) {
			throw ex;
		} catch (Exception ex) {
			Throwable[] causeChain = throwableAnalyzer.determineCauseChain(ex);
			RuntimeException ase = (AuthenticationException) throwableAnalyzer
					.getFirstThrowableOfType(AuthenticationException.class, causeChain);

			if (ase == null) {
				ase = (AccessDeniedException) throwableAnalyzer.getFirstThrowableOfType(AccessDeniedException.class,
						causeChain);
			}

			if (ase != null) {
				if (ase instanceof AuthenticationException) {
					throw ase;
				} else if (ase instanceof AccessDeniedException) {

					if (authenticationTrustResolver
							.isAnonymous(SecurityContextHolder.getContext().getAuthentication())) {
						logger.info("Sesión expirada o el usuario aún no ha ingresado al sistema.");
						//String ajaxHeader = ((HttpServletRequest) request).getHeader("X-Requested-With");
						//if ("XMLHttpRequest".equals(ajaxHeader)) {
					    if(((HttpServletRequest) request).getRequestURI().contains(contextPath + "/api/")) {
							HttpServletResponse resp = (HttpServletResponse) response;
							logger.info("Llamada Ajax detectada, enviando codigo de error {}",
									this.customSessionExpiredErrorCode);
							resp.setStatus(HttpStatus.UNAUTHORIZED.value());
							resp.setContentType(MimeType.MIME_APPLICATION_JSON.getMimeType());
							resp.getWriter().write(ErrorMessage.getMessage(systemName + "(" + systemVersion + ")",
									this.customSessionExpiredErrorCode, "Sesión expirada.", request, ex));
							resp.getWriter().flush();
							resp.getWriter().close();
						} else {
							logger.info("Redirección a la página de Login");
							throw ase;
						}
					} else {
						throw ase;
					}
				} else {
					throw ase;
				}
			} else {
				throw new ServletException(ex);
			}
		}
	}

	private static final class DefaultThrowableAnalyzer extends ThrowableAnalyzer {
		/**
		 * @see org.springframework.security.web.util.ThrowableAnalyzer#initExtractorMap()
		 */
		protected void initExtractorMap() {
			super.initExtractorMap();

			registerExtractor(ServletException.class, new ThrowableCauseExtractor() {
				public Throwable extractCause(Throwable throwable) {
					ThrowableAnalyzer.verifyThrowableHierarchy(throwable, ServletException.class);
					return ((ServletException) throwable).getRootCause();
				}
			});
		}
	}

	public void setCustomSessionExpiredErrorCode(int customSessionExpiredErrorCode) {
		this.customSessionExpiredErrorCode = customSessionExpiredErrorCode;
	}
}