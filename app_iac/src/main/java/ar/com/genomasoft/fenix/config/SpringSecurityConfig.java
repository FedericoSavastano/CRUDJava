package ar.com.genomasoft.fenix.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.access.ExceptionTranslationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import ar.com.genomasoft.fenix.security.AjaxTimeoutRedirectFilter;

@Configuration
@EnableWebSecurity
public class SpringSecurityConfig extends WebSecurityConfigurerAdapter {

    @Autowired
    private AccessDeniedHandler accessDeniedHandler;

	@Autowired
	@Qualifier("authenticationProvider")
	AuthenticationProvider authenticationProvider;
	
	@Autowired
	AjaxTimeoutRedirectFilter ajaxTimeoutRedirectFilter;
	
    // custom 403 access denied handler
    @Override
    protected void configure(HttpSecurity http) throws Exception {

        http
        .authenticationProvider(authenticationProvider)
        .authorizeRequests()
			.antMatchers("/error/**", "/resources/**", "/webjars/**", "/js/**", "/js/datatables/**", "/css/**").permitAll()
			.antMatchers("/", "/home", "/info", "/api/**", "/js/secured/**" ).authenticated()
			.antMatchers("/genoma/**",   "/js/secured/genoma/**").hasAuthority("GENOMA")
			.antMatchers("/swagger-ui**","/documentation**").hasAnyAuthority("GENOMA", "ADMIN")
			.antMatchers("/admin/**",    "/js/secured/admin/**"   ).hasAuthority("ADMIN")
			.antMatchers("/usuario/**",  "/js/secured/usuario/**" ).hasAnyAuthority("USUARIO", "ADMIN")
			.antMatchers("/afiliado/**", "/js/secured/afiliado/**").hasAuthority("AFILIADO")
			.anyRequest().authenticated()
        .and()
        .formLogin()
			.loginPage("/login")
			.permitAll()
			.failureUrl("/login?error")
			.defaultSuccessUrl("/home")
			.usernameParameter("email")
			.passwordParameter("password")
		.and()
        .logout()
	        .invalidateHttpSession(true)
	        .clearAuthentication(true)
	        .logoutRequestMatcher(new AntPathRequestMatcher("/logout"))
	        .logoutSuccessUrl("/login?logout")
	        .permitAll()
		.and()
		.addFilterAfter(ajaxTimeoutRedirectFilter,  ExceptionTranslationFilter.class)
        .exceptionHandling().accessDeniedHandler(accessDeniedHandler);    	
    }
}