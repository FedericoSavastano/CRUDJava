package ar.com.genomasoft.fenix.dao;

import java.util.ArrayList;
import java.util.HashMap;

import ar.com.genomasoft.jproject.core.exception.BaseException;

public interface FenixNativeDao {

	public Long getNuevoNroCuentaCorriente() throws BaseException;

	public ArrayList getPresentacionDetalle(Integer idPeriodo) throws BaseException ;
}
