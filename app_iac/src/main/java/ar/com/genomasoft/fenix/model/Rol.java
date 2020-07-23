package ar.com.genomasoft.fenix.model;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import org.springframework.security.core.GrantedAuthority;

import ar.com.genomasoft.jproject.core.entities.BaseAuditedEntity;

@Entity
@Table(name = "USR_ROL")
public class Rol extends BaseAuditedEntity implements GrantedAuthority{
	

	/**
	 * 
	 */
	private static final long serialVersionUID = 5593175085315205271L;
	private String rol;
	private String descripcion;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name="ID")
	public Integer getId() {
		return super.id;
	}

	@Column(name="ROL")
	public String getRol() {
		return rol;
	}
	public void setRol(String rol) {
		this.rol = rol;
	}
	
	@Column(name="DESCRIPCION")
	public String getDescripcion() {
		return descripcion;
	}
	
	public void setDescripcion(String descripcion) {
		this.descripcion = descripcion;
	}

	@Transient
	public String getAuthority() {
		return rol;
	}
	
	@Override
	public String toString() {
		return rol;
	}
}
