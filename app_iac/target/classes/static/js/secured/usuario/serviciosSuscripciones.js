var tabla;
var idForm;

$(document).ready(function() {

	tabla = $("#tabla-entidades").DataTable({
		'language' : {
			'url' : _path + 'js/plugins/datatables.es.json'
		}
	});

	var idServicio = getURLParameter('idServicio');
	if(idServicio){
		loadData(idServicio);		
	} else {
		modalError("Servicio no identificado.");
	}

});

// carga y recarga de la tabla.
function loadData(idServicio) {
	tabla.clear();
	$
			.ajax({
				type : "GET",
				url : _path + "api/suscripciones?fetchs=afiliado.persona&sidx=numeroSuscripcion&sord=asc&searchField=servicio.id&searchOper=eq&searchString=" + idServicio ,
				beforeSend : function(xhr) {
					xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
					modalWaitShow();
				}
			})
			.done(
					function(data) {
						if(data.rows.length==0){
							modalWarning("El servicio no posee suscripciones");
							return;
						}
						
						for (i = 0; i < data.rows.length; i++) {
							var date = new Date(data.rows[i].createdTime);
				        	var fechaAlta=  date.getDate()+'/' + (date.getMonth()+1) + '/'+date.getFullYear();
							tabla.row
									.add([
											data.rows[i].numeroSuscripcion,
											data.rows[i].afiliado.numeroAfiliado,
											data.rows[i].afiliado.idExterno,
											data.rows[i].afiliado.persona.apellido,
											data.rows[i].afiliado.persona.nombre,	
											fechaAlta,
											data.rows[i].activo?'SI':'NO'
										]);
						}
						tabla.draw();
						modalWaitHide();
					})

			.fail(function(data) {
				modalError("La tabla no pudo cargarse correctamente.", data);
			});
}