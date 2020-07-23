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
@Table(name = "USR_PERSONA")
@Where(clause="DELETED_TIME IS NULL")
@SQLDelete(sql="UPDATE USR_PERSONA SET DELETED_TIME = CURRENT_TIMESTAMP WHERE ID = ? AND VERSION = ?")
public class Persona extends BaseClientAuditedEntity {

	
	private String nombre;
	private String apellido;	
	private String documento;



	private Date fechadenacimiento;
	private String email;
		
	public Persona() {

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
	@Column(name = "NOMBRE", nullable=false)
	@ApiModelProperty(value="Nombre de la persona.", required=true, position=1)
	public String getNombre() {
		return nombre;
	}

	/**
	 * @param apellido the codigo to set
	 */
	public void setNombre(String nombre) {
		this.nombre = nombre.toUpperCase();
	}
	
	/**
	 * @return the apellido
	 */
	@Column(name = "APELLIDO", nullable=false)
	@ApiModelProperty(value="Apellido de la persona.", required=true, position=2)
	public String getApellido() {
		return apellido;
	}

	/**
	 * @param nombre the codigo to set
	 */
	public void setApellido(String apellido) {
		this.apellido= apellido.toUpperCase();
	}

	/**
	 * @return the numero de documento
	 */
	@Column(name = "NRO_DOCUMENTO", nullable=false)
	@ApiModelProperty(value="NUMERO DE DOCUMENTO de la persona.", required=true, position=4)
	public String getDocumento() {
		return documento;
	}

	public void setDocumento(String documento) {
		this.documento = documento;
	}

	/**
	 * @return the email
	 */
	@Column(name = "EMAIL", nullable=true)
	@ApiModelProperty(value="EMAIL de la persona.", required=false, position=5)
	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email==null?null:email.toLowerCase();
	}

	
	/*METODOS TRANSIENT, NO ASOCIADOS A NINGUN CAMPO DE LA BASE*/
	@Transient
    public String getNombreApellidoDni() {
    	String s = (nombre != null? nombre  + " ": "") +
    			(apellido != null? apellido  + " ": "") +
    			(documento != null? "(" + documento  + ") ": "");
    	
    	return s;
	}


	@Column(name = "FECHA", nullable=true)
	public Date getFechadenacimiento() {
		return fechadenacimiento;
	}

	public void setFechadenacimiento(Date fechadenacimiento) {
		this.fechadenacimiento = fechadenacimiento;
	}
	
}