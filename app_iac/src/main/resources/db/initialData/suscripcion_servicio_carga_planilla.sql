INSERT INTO svc_servicio(
			id, codigo, descripcion, client_id, version, created_time, created_user, 
            updated_time, updated_user, deleted_time, servicio_tipo_id, proveedor_id)
    VALUES (nextval('svc_servicio_id_seq'), 'PLANILLA', 'Servicio para planilla de cargos manuales', -1, 1, current_date, 0, 
            current_date, 0, null, 'FACTURADO', -1);


INSERT INTO usr_afiliado_suscripcion(
            id, numero_suscripcion, servicio_id, afiliado_id, client_id, 
            version, created_time, created_user, updated_time, updated_user, 
            deleted_time, activo)
 SELECT nextval('usr_afiliado_suscripcion_id_seq'), id_externo, (select id from svc_servicio where codigo='PLANILLA' and client_id=-1 and deleted_time is null), id, -1, 
            1, current_date, 0, 
            current_date, 0, null, true
from usr_afiliado
where client_id=-1
and deleted_time is null;


