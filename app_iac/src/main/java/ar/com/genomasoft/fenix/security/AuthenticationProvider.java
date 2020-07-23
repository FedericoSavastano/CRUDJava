package ar.com.genomasoft.fenix.security;

import java.util.Date;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;

import ar.com.genomasoft.fenix.dao.UsuarioDao;
import ar.com.genomasoft.fenix.model.Usuario;
import ar.com.genomasoft.jproject.core.exception.BaseException;

@Component("authenticationProvider")
public class AuthenticationProvider extends DaoAuthenticationProvider {
	
    private static Logger logger = LoggerFactory.getLogger(AuthenticationProvider.class);

	@Autowired
	UsuarioDao userDetailsDao;
	
	@Autowired
	private BCryptPasswordEncoder bCryptPasswordEncoder;
		
	
	@Autowired
	@Qualifier("userDetailsService")
	@Override
	public void setUserDetailsService(UserDetailsService userDetailsService) {
		super.setUserDetailsService(userDetailsService);
	}
	
	public Authentication authenticate(Authentication authentication) 
          throws AuthenticationException {

	  try {
			super.setPasswordEncoder(bCryptPasswordEncoder);

		Authentication auth = super.authenticate(authentication);
			
		try {
			//if reach here, means login success, else an exception will be thrown
			//reset the user_attempts
			userDetailsDao.resetFailAttempts(authentication.getName());
		} catch (BaseException e) {
			logger.error(e.getMessage(), e);
		}
			
		return auth;
			
	  } catch (BadCredentialsException e) {	
		try {
			//invalid login, update to user_attempts
			userDetailsDao.updateFailAttempts(authentication.getName());
		} catch (BaseException e1) {
			logger.error(e.getMessage(), e);
		}
		throw e;
			
	  } catch (LockedException e){
		logger.error(e.getMessage(), e);
		//this user is locked!
		String error = "";
		Usuario user;
		try {
			user = userDetailsDao.getUsuarioByEmail(authentication.getName());
		} catch (BaseException e1) {
			logger.error(e.getMessage(), e);
			throw e;
		}
		
       if(user!=null && user.getAttempts()!=null){
			Date lastAttempts = user.getUpdatedTime();
			error = "La cuenta de usuario está bloqueada!"
					+ "<br>Usuario: " + authentication.getName() 
					+ "<br>Última modificación : " + lastAttempts;
		}else{
			error = e.getMessage();
		}
			
	  throw new LockedException(error);
	}

	}
}
