package ar.com.genomasoft.fenix.dao;

import org.springframework.stereotype.Repository;

import ar.com.genomasoft.fenix.model.Cliente;
import ar.com.genomasoft.jproject.core.daos.BaseAuditedEntityDaoImpl;

@Repository
public class ClienteDaoImpl extends BaseAuditedEntityDaoImpl<Cliente> implements ClienteDao {

}
