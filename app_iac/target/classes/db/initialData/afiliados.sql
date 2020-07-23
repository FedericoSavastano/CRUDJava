INSERT INTO usr_afiliado(
            id, numero_afiliado, id_externo, fecha_alta, tipo_afiliado_id, persona_id, nro_cta_cte, client_id, version, created_time, 
            created_user, updated_time, updated_user, deleted_time)
    VALUES 
(-1,-1,-1,current_date,1,(SELECT id from usr_persona where nro_documento = '18495809' AND client_id=-1),-1,-1,1,current_date,0,current_date,0,null),  
(-2,-2,-2,current_date,1,(SELECT id from usr_persona where nro_documento = '35121444' AND client_id=-1),-2,-1,1,current_date,0,current_date,0,null),  
(-3,-3,-3,current_date,1,(SELECT id from usr_persona where nro_documento = '38558657' AND client_id=-1),-3,-1,1,current_date,0,current_date,0,null),  
(-4,-4,-4,current_date,1,(SELECT id from usr_persona where nro_documento = '14053253' AND client_id=-1),-4,-1,1,current_date,0,current_date,0,null),  
(-5,-5,-5,current_date,1,(SELECT id from usr_persona where nro_documento = '38754658' AND client_id=-1),-5,-1,1,current_date,0,current_date,0,null),  
(-6,-6,-6,current_date,1,(SELECT id from usr_persona where nro_documento = '11044582' AND client_id=-1),-6,-1,1,current_date,0,current_date,0,null),  
(-7,-7,-7,current_date,1,(SELECT id from usr_persona where nro_documento = '32916179' AND client_id=-1),-7,-1,1,current_date,0,current_date,0,null),  
(-8,-8,-8,current_date,1,(SELECT id from usr_persona where nro_documento = '30258309' AND client_id=-1),-8,-1,1,current_date,0,current_date,0,null),  
(-9,-9,-9,current_date,1,(SELECT id from usr_persona where nro_documento = '12899238' AND client_id=-1),-9,-1,1,current_date,0,current_date,0,current_date);