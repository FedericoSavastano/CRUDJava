



insert into usr_parametro_cliente_def 
	 (id,codigo,descripcion,tipo,version,created_time,created_user,updated_time,updated_user,deleted_time)
	 values
 (-1,'CLASE_BANCO','Paquete de la clase que contiene la lógica de generación/descarga de débitos','TEXTO',1,current_date,-1,current_date,-1,null);

insert into usr_parametro_cliente_def 
	 (id,codigo,descripcion,tipo,version,created_time,created_user,updated_time,updated_user,deleted_time)
	 values
 (-2,'METODO_GENERAR','Metodo en la clase que contiene la lógica de generación de débitos','TEXTO',1,current_date,-1,current_date,-1,null);




 insert into usr_parametro_cliente_def 
	 (id,codigo,descripcion,tipo,version,created_time,created_user,updated_time,updated_user,deleted_time)
	 values
 (-3,'METODO_DESCARGA','Metodo en la clase que contiene la lógica de descarga de débitos','TEXTO',1,current_date,-1,current_date,-1,null);


insert into usr_parametro_cliente 
	 (id,prm_id,valor,client_id,version,created_time,created_user,updated_time,updated_user,deleted_time)
	 values
 (-1,-1,'ar.com.genomasoft.fenix.bancos.Santander',-1,1,current_date,-1,current_date,-1,null);


insert into usr_parametro_cliente 
	 (id,prm_id,valor,client_id,version,created_time,created_user,updated_time,updated_user,deleted_time)
	 values
 (-2,-2,'generar',-1,1,current_date,-1,current_date,-1,null); 


 insert into usr_parametro_cliente 
	 (id,prm_id,valor,client_id,version,created_time,created_user,updated_time,updated_user,deleted_time)
	 values
 (-3,-3,'descargar',-1,1,current_date,-1,current_date,-1,null); 
