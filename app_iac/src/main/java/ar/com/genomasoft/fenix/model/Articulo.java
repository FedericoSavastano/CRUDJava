package ar.com.genomasoft.fenix.model;

import java.text.SimpleDateFormat;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

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
@Table(name = "USR_ARTICULO")
@Where(clause="DELETED_TIME IS NULL")
@SQLDelete(sql="UPDATE USR_ARTICULO SET DELETED_TIME = CURRENT_TIMESTAMP WHERE ID = ? AND VERSION = ?")
public class Articulo extends BaseClientAuditedEntity {

	
	private String codigo;
	private String descripcion;	
	
		
	public Articulo() {

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
	@Column(name = "CODIGO", nullable=false)
	public String getCodigo() {
		return codigo;
	}

	/**
	 * @param apellido the codigo to set
	 */
	public void setCodigo(String codigo) {
		this.codigo = codigo;
	}
	
	/**
	 * @return the apellido
	 */
	@Column(name = "DESCRIP", nullable=false)
	public String getDescripcion() {
		return descripcion;
	}

	/**
	 * @param nombre the codigo to set
	 */
	public void setDescripcion(String descripcion) {
		this.descripcion= descripcion.toUpperCase();
	}

		
}