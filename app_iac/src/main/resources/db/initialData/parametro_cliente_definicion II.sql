



insert into usr_parametro_cliente_def 
	 (id,codigo,descripcion,tipo,version,created_time,created_user,updated_time,updated_user,deleted_time)
	 values
 (-4,'PATH_DEBITO','ruta base donde se guarda los archivos debitos','TEXTO',1,current_date,-1,current_date,-1,null);

insert into usr_parametro_cliente 
	 (id,prm_id,valor,client_id,version,created_time,created_user,updated_time,updated_user,deleted_time)
	 values
 (-4,-4,'/app/',-1,1,current_date,-1,current_date,-1,null);


ALTER TABLE SVC_LIQUIDACION  alter column FECHA_CONFIRMACION  set default NULL

