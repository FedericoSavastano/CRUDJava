UPDATE usr_persona set id_externo=LPAD(id_externo, 5, '0') WHERE client_id=1 and LENGTH(id_externo)<5;
UPDATE usr_afiliado set id_externo=LPAD(id_externo, 5, '0') WHERE client_id=1 and LENGTH(id_externo)<5;