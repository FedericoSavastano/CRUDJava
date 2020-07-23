package ar.com.genomasoft.fenix.dao;

import java.util.Collection;

import ar.com.genomasoft.fenix.model.Rol;
import ar.com.genomasoft.fenix.model.Usuario;
import ar.com.genomasoft.jproject.core.daos.BaseClientAuditedEntityDao;
import ar.com.genomasoft.jproject.core.exception.BaseException;

public interface UsuarioDao extends BaseClientAuditedEntityDao<Usuario> {
	
	Usuario getUsuarioByEmail(String email) throws BaseException;

	void updateFailAttempts(String email) throws BaseException;
	
	void resetFailAttempts(String email) throws BaseException;
	
	Integer getUserAttempts(String email) throws BaseException;
	
	Collection<Rol> getRolesByUserId(Integer userId) throws BaseException;

}
