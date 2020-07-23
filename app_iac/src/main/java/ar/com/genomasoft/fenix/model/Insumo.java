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
@ApiModel(	value="Insumo", 
			description="Entidad Insumo del sistema Fénix.", 
			reference="El insumo es una entidad del sistema.", 
			parent=BaseAuditedEntity.class)
@Table(name = "USR_INSUMO")
@Where(clause="DELETED_TIME IS NULL")
@SQLDelete(sql="UPDATE USR_INSUMO SET DELETED_TIME = CURRENT_TIMESTAMP WHERE ID = ? AND VERSION = ?")
public class Insumo extends BaseClientAuditedEntity {

	
	private String marca;
	private String producto;
	private Integer cantidad;	
	private String observacion;
		
	public Insumo() {

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
	 * @return la marca
	 */
	@Column(name = "MARCA", nullable=false)
	public String getMarca() {
		return marca;
	}

	/**
	 * @param marca del insumo
	 */
	public void setMarca(String marca) {
		this.marca = marca.toUpperCase();
	}
	
	/**
	 * @return el producto
	 */
	@Column(name = "PRODUCTO", nullable=false)
	public String getProducto() {
		return producto;
	}

	/**
	 * @param el producto de esa marca
	 */
	public void setProducto(String producto) {
		this.producto= producto.toUpperCase();
	}

	/**
	 * @return la cantidad
	 */
	public Integer getCantidad() {
		return cantidad;
	}
	
	/**
	 * @param la cantidad de ese insumo
	 */

	public void setCantidad(Integer cantidad) {
		this.cantidad = cantidad;
	}
	
	/**
	 * @return la observacion
	 */
	
	public String getObservacion() {
		return observacion;
	}
	
	/**
	 * @param la observacion ese insumo
	 */
	
	public void setObservacion(String observacion) {
		this.observacion = observacion;
	}

		
}