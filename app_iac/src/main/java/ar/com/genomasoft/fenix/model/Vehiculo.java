package ar.com.genomasoft.fenix.model;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.Where;

import ar.com.genomasoft.jproject.core.entities.BaseAuditedEntity;
import ar.com.genomasoft.jproject.core.entities.BaseClientAuditedEntity;
import io.swagger.annotations.ApiModel;
import io.swagger.annotations.ApiModelProperty;

/** Persona
 * @author David Schwarz (juandavidschwarz@gmail.com)
 *
 */
@Entity
@ApiModel(	value="Persona", 
			description="Entidad Persona del sistema Fénix.", 
			reference="La persona es una entidad del sistema.", 
			parent=BaseAuditedEntity.class)
@Table(name = "USR_VEHICULO")
@Where(clause="DELETED_TIME IS NULL")
@SQLDelete(sql="UPDATE USR_VEHICULO SET DELETED_TIME = CURRENT_TIMESTAMP WHERE ID = ? AND VERSION = ?")
public class Vehiculo extends BaseClientAuditedEntity {

	
	private String patente;
	private String modelo;	
	
		
	public Vehiculo() {

	}
	
	@Override
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "ID", unique=true, nullable=false)
	@ApiModelProperty(value="Clave Primaria de la Persona", required=false, position=0)
	public Integer getId() {
		return super.id;
	}

	/**
	 * @return the nombre
	 */
	@Column(name = "PATENTE", nullable=false)
	public String getPatente() {
		return patente;
	}

	/**
	 * @param apellido the codigo to set
	 */
	public void setPatente(String patente) {
		this.patente = patente;
	}
	
	/**
	 * @return the apellido
	 */
	@Column(name = "MODELO", nullable=false)
	public String getModelo() {
		return modelo;
	}

	/**
	 * @param nombre the codigo to set
	 */
	public void setModelo(String modelo) {
		this.modelo= modelo.toUpperCase();
	}

		
}