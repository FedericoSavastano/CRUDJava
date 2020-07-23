package ar.com.genomasoft.fenix.security;

import org.springframework.data.domain.AuditorAware;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import ar.com.genomasoft.fenix.model.Usuario;

@Component
public class AuditorAwareImpl implements AuditorAware<Integer> {

    public Integer getCurrentAuditor() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Usuario username = (Usuario) auth.getPrincipal();
		return username.getId();
	}

}
