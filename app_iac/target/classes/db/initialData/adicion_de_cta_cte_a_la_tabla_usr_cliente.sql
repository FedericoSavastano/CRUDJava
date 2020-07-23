UPDATE public.usr_cliente
   SET nro_cta_cte = nextval('seq_cta_cte_id')
 WHERE nro_cta_cte is null;
