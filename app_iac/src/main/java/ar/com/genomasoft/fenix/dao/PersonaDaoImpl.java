package ar.com.genomasoft.fenix.dao;

import org.springframework.stereotype.Repository;

import ar.com.genomasoft.fenix.model.Persona;
import ar.com.genomasoft.jproject.core.daos.BaseClientAuditedEntityDaoImpl;

@Repository
public class PersonaDaoImpl extends BaseClientAuditedEntityDaoImpl<Persona> implements PersonaDao {
	
}
