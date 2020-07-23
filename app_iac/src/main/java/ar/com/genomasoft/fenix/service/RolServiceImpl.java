package ar.com.genomasoft.fenix.service;

import org.springframework.stereotype.Service;

import ar.com.genomasoft.fenix.dao.RolDao;
import ar.com.genomasoft.fenix.model.Rol;
import ar.com.genomasoft.jproject.core.services.BaseAuditedEntityServiceImpl;

@Service
public class RolServiceImpl extends BaseAuditedEntityServiceImpl<Rol, RolDao> implements RolService {

}
