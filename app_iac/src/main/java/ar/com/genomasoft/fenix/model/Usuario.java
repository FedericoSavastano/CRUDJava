package ar.com.genomasoft.fenix.model;

import java.security.Principal;
import java.util.Collection;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.hibernate.validator.constraints.Email;
import org.hibernate.validator.constraints.Length;
import org.hibernate.validator.constraints.NotEmpty;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.CredentialsContainer;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import ar.com.genomasoft.jproject.core.entities.BaseClientAuditedEntity;
import liquibase.util.MD5Util;

@Entity
@Table(name = "USR_USUARIO")
public class Usuario extends BaseClientAuditedEntity implements Principal, Authentication, UserDetails, CredentialsContainer{
	
	/**
	 * 
	 */
	private static final long serialVersionUID = -4399201397331690019L;
	
	private String 	username;
	private String 	nombre;
	private String 	apellido;
	private String 	email;
	private Boolean enabled = true;
	private Integer attempts = 0;
	private Boolean accountNonLocked = true;
	private Boolean accountNonExpired = true;
	private Boolean credentialsNonExpired = true;
	private String 	password;
	private boolean isAuthenticated;
	private String 	gravatar;
	
	private Collection<Rol> roles;
	private Collection<? extends GrantedAuthority> authorities;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID")
	public Integer getId() {
		return id;
	}

	/**
	 * @return the username
	 */
	@Column(name = "USERNAME")
	@Length(min = 5, message = "*Su usuario debe tener al menos 5 caracteres")
	@NotEmpty(message = "*Por favor, ingrese su usuario.")
	public String getUsername() {
		return username;
	}

	/**
	 * @param username the username to set
	 */
	public void setUsername(String username) {
		this.username = username;
	}

	@Column(name = "NOMBRE")
	@NotEmpty(message = "*Por favor, ingrese su nombre")
	public String getNombre() {
		return nombre;
	}

	public void setNombre(String nombre) {
		this.nombre = nombre;
	}

	@Column(name = "APELLIDO")
	@NotEmpty(message = "*Por favor, ingrese su apellido")
	public String getApellido() {
		return apellido;
	}

	public void setApellido(String apellido) {
		this.apellido = apellido;
	}

	@Column(name = "EMAIL")
	@Email(message = "*Por favor, ingrese su  email")
	@NotEmpty(message = "*Por favor, ingrese su email")
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
		 this.gravatar = "https://www.gravatar.com/avatar/" + MD5Util.computeMD5(email);
	}
	
	/**
	 * @return the enabled
	 */
	@Column(name = "ENABLED")
	public boolean isEnabled() {
		return enabled;
	}
	
	/**
	 * @param enabled the enabled to set
	 */
	public void setEnabled(Boolean enabled) {
		this.enabled = enabled;
	}

	/**
	 * @return the attempts
	 */
	@Column(name = "ATTEMPTS")
	public Integer getAttempts() {
		return attempts;
	}
	
	/**
	 * @param attempts the attempts to set
	 */
	public void setAttempts(Integer attempts) {
		this.attempts = attempts;
	}
	
	/**
	 * @return the accountNonLocked
	 */
	@Column(name = "ACCOUNT_NON_LOCKED")
	public boolean isAccountNonLocked() {
		return accountNonLocked;
	}
	
	/**
	 * @param accountNonLocked the accountNonLocked to set
	 */
	public void setAccountNonLocked(Boolean accountNonLocked) {
		this.accountNonLocked = accountNonLocked;
	}

	/**
	 * @return the accountNonExpired
	 */
	@Column(name = "ACCOUNT_NON_EXPIRED")
	public boolean isAccountNonExpired() {
		return accountNonExpired;
	}
	
	/**
	 * @param accountNonExpired the accountNonExpired to set
	 */
	public void setAccountNonExpired(Boolean accountNonExpired) {
		this.accountNonExpired = accountNonExpired;
	}

	/**
	 * @return the credentialsNonExpired
	 */
	@Column(name = "CREDENTIALS_NON_EXPIRED")
	public boolean isCredentialsNonExpired() {
		return this.credentialsNonExpired;
	}

	/**
	 * @param credentialsNonExpired the credentialsNonExpired to set
	 */
	public void setCredentialsNonExpired(Boolean credentialsNonExpired) {
		this.credentialsNonExpired = credentialsNonExpired;
	}

	@Column(name = "PASSWORD")
	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@ManyToMany(cascade = CascadeType.ALL)
	@JoinTable(name = "USR_USUARIO_ROL", joinColumns = @JoinColumn(name = "USUARIO_ID"), inverseJoinColumns = @JoinColumn(name = "ROL_ID"))
	public Collection<Rol> getRoles() {
		return roles;
	}

	public void setRoles(Collection<Rol> roles) {
		this.roles = roles;
	}

	/**
	 * @return the authorities
	 */
	@Transient
	public Collection<? extends GrantedAuthority> getAuthorities() {
		return authorities;
	}

	/**
	 * @param authorities the authorities to set
	 */
	public void setAuthorities(Collection<? extends GrantedAuthority> authorities) {
		this.authorities = authorities;
	}

	public void eraseCredentials() {
		password = null;
	}

	@Transient
	public Object getCredentials() {
		return getAuthorities();
	}	 
		
	@Transient
	public Object getDetails() {
		return this;
	}

	@Transient
	public Object getPrincipal() {
		return this;
	}
	
	@Transient
	public boolean isAuthenticated() {
		return isAuthenticated;
	}
	
	public void setAuthenticated(boolean isAuthenticated) throws IllegalArgumentException{
		this.isAuthenticated=isAuthenticated;
	} 
	
	@Transient
	public String getName() {
		return getNombre() + " " + getApellido();
	}
	
	@Transient
	public String getGravatar() {
		return this.gravatar;
	}
	
	/* (non-Javadoc)
	 * @see java.lang.Object#hashCode()
	 */
	@Override
	public int hashCode() {
		final int prime = 31;
		int result = super.hashCode();
		result = prime * result + ((accountNonExpired == null) ? 0 : accountNonExpired.hashCode());
		result = prime * result + ((accountNonLocked == null) ? 0 : accountNonLocked.hashCode());
		result = prime * result + ((apellido == null) ? 0 : apellido.hashCode());
		result = prime * result + ((attempts == null) ? 0 : attempts.hashCode());
		result = prime * result + ((credentialsNonExpired == null) ? 0 : credentialsNonExpired.hashCode());
		result = prime * result + ((email == null) ? 0 : email.hashCode());
		result = prime * result + ((enabled == null) ? 0 : enabled.hashCode());
		result = prime * result + ((nombre == null) ? 0 : nombre.hashCode());
		result = prime * result + ((username == null) ? 0 : username.hashCode());
		return result;
	}

	/* (non-Javadoc)
	 * @see java.lang.Object#equals(java.lang.Object)
	 */
	@Override
	public boolean equals(Object obj) {
		if (this == obj)
			return true;
		if (!super.equals(obj))
			return false;
		if (getClass() != obj.getClass())
			return false;
		Usuario other = (Usuario) obj;
		if (accountNonExpired == null) {
			if (other.accountNonExpired != null)
				return false;
		} else if (!accountNonExpired.equals(other.accountNonExpired))
			return false;
		if (accountNonLocked == null) {
			if (other.accountNonLocked != null)
				return false;
		} else if (!accountNonLocked.equals(other.accountNonLocked))
			return false;
		if (apellido == null) {
			if (other.apellido != null)
				return false;
		} else if (!apellido.equals(other.apellido))
			return false;
		if (attempts == null) {
			if (other.attempts != null)
				return false;
		} else if (!attempts.equals(other.attempts))
			return false;
		if (credentialsNonExpired == null) {
			if (other.credentialsNonExpired != null)
				return false;
		} else if (!credentialsNonExpired.equals(other.credentialsNonExpired))
			return false;
		if (email == null) {
			if (other.email != null)
				return false;
		} else if (!email.equals(other.email))
			return false;
		if (enabled == null) {
			if (other.enabled != null)
				return false;
		} else if (!enabled.equals(other.enabled))
			return false;
		if (nombre == null) {
			if (other.nombre != null)
				return false;
		} else if (!nombre.equals(other.nombre))
			return false;
		if (username == null) {
			if (other.username != null)
				return false;
		} else if (!username.equals(other.username))
			return false;
		return true;
	}

}