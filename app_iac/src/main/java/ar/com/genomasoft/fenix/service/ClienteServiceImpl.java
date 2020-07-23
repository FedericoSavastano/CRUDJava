package ar.com.genomasoft.fenix.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import ar.com.genomasoft.fenix.dao.ClienteDao;
import ar.com.genomasoft.fenix.dao.FenixNativeDao;
import ar.com.genomasoft.fenix.model.Cliente;
import ar.com.genomasoft.jproject.core.exception.BaseException;
import ar.com.genomasoft.jproject.core.services.BaseAuditedEntityServiceImpl;

@Service
public class ClienteServiceImpl extends BaseAuditedEntityServiceImpl<Cliente, ClienteDao> 
implements ClienteService {


	@Autowired
	FenixNativeDao nativeDao;
	
	@Override
	@Transactional(rollbackFor=Exception.class)
	public Cliente save(Cliente object) throws BaseException{
		Long nroCuentaCorriente = nativeDao.getNuevoNroCuentaCorriente();
		object.setNroCuentaCorriente(nroCuentaCorriente);
		return super.save(object);
	}
}
