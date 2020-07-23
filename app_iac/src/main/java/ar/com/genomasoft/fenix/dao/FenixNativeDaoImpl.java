package ar.com.genomasoft.fenix.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;

import org.hibernate.SQLQuery;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import antlr.collections.List;
import ar.com.genomasoft.jproject.core.daos.NativeDaoImpl;
import ar.com.genomasoft.jproject.core.exception.BaseException;
import ar.com.genomasoft.jproject.core.exception.InternalErrorException;

@Repository
public class FenixNativeDaoImpl extends NativeDaoImpl implements FenixNativeDao {

	@Transactional(rollbackFor = Exception.class)
	public Long getNuevoNroCuentaCorriente() throws BaseException {
		try {
			String queryBase = "select nextval('seq_cta_cte_id')";
			SQLQuery q = this.sessionFactory.getCurrentSession().createSQLQuery(queryBase);
			return Long.valueOf(((Number) q.uniqueResult()).longValue());
		} catch (Exception arg6) {
			this.logger.error(arg6.getMessage(), arg6);
			throw new InternalErrorException(arg6);
		}
	}

	@SuppressWarnings("unchecked")
	@Transactional(rollbackFor = Exception.class)
	public ArrayList getPresentacionDetalle(Integer idPeriodo) throws BaseException {
		try {
			String	queryBase = " SELECT  af.ID as AF_ID, SUM(importe)  as TOTAL from  CTA_MOVIMIENTO  mov "
					+ " INNER JOIN SVC_LIQUIDACION liq on mov.liquidacion_id=liq.id "
					+ " INNER JOIN USR_AFILIADO_SUSCRIPCION sus on mov.suscripcion_id=sus.id "
					+ " INNER JOIN USR_AFILIADO af on sus.afiliado_id=af.id "
					+ " INNER JOIN USR_PERSONA prs on prs.id=af.persona_id " + " WHERE movimientodel = '0' "
					+ " AND suscripcion_id is not null " + " AND liq.periodo_id=:idPeriodo "
					+ " GROUP BY prs.nombre, prs.apellido, AF_ID ";

			SQLQuery q = this.sessionFactory.getCurrentSession().createSQLQuery(queryBase);
			q.setInteger("idPeriodo", idPeriodo);

			
			ArrayList filas = (ArrayList) q.list();
			
			
			
			return filas;
		} catch (Exception arg6) {
			this.logger.error(arg6.getMessage(), arg6);
			throw new InternalErrorException(arg6);
		}
	}

}