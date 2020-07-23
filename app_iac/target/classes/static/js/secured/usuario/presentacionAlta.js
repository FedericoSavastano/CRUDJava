var tablaDetalle;
var idPeriodo;
var LiquidacionesServicios;

$(document).ready(function() {

	tablaDetalle = $("#tblDetalle").DataTable({
		'language' : {
			'url' : _path + 'js/plugins/datatables.es.json'
		},
		'columnDefs' : [ {
			className : 'text-center',
			'targets' : [ 0, 1, 2 ]
		}, {
			className : 'text-center',
			'targets' : [ 2 ]
		} ]
	});

	var date = new Date();
	var day = date.getDate();
	if (day < 10) {
		day = '0' + day;
	}
	var month = date.getMonth() + 1;
	if (month < 10) {
		month = '0' + month;
	}
	var year = date.getFullYear();
	var fecha = day + '/' + month + '/' + year;

	$("#txtPresentacion").val(fecha);
	$("#txtVencimiento").val(fecha);
	$("#cboPeriodo").focus();

	// cargarservicio
	loadCombo();

});

function loadCombo() {

	// combo tipo
	$.ajax({
		type : "GET",
		async : false,
		url : _path + "api/periodos",
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
		}
	}).done(
			function(data) {
				for (i = 0; i < data.rows.length; i++) {
					var id = data.rows[i].id;

					var descrip = data.rows[i].descripcion;

					var date = new Date(data.rows[i].fechaDesde);
					var fechaDesde = date.getDate() + '/'
							+ (date.getMonth() + 1) + '/' + date.getFullYear();

					var date = new Date(data.rows[i].fechaHasta);
					var fechaHasta = date.getDate() + '/'
							+ (date.getMonth() + 1) + '/' + date.getFullYear();

					var descrip = fechaDesde + " -- " + fechaHasta;

					$('#cmbPeriodo').append(
							'<option value="' + id + '">' + descrip
									+ '</option>');

				}
			});
}

function listarLiquidaciones() {

	var selector = document.getElementById('cmbPeriodo');
	var idPeriodo = selector[selector.selectedIndex].attributes[0].value;

	$
			.ajax(
					{
						type : "GET",
						async : false,
						url : _path
								+ "api/liquidacion?fetchs=servicio&searchField=periodo.id&searchOper=eq&searchString="
								+ idPeriodo,
						beforeSend : function(xhr) {
							xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
						}
					})
			.done(
					function(data) {

						LiquidacionesServicios = data;

						var importeTotal = 0;

						for (i = 0; i < data.rows.length; i++) {

							var liquidacion = data.rows[i];

							var servicio = liquidacion.servicio.descripcion;
							var importeImputado = liquidacion.importeImputado;
							var importeNoImputado = liquidacion.importeNoImputado;

							importeTotal = eval(importeTotal)
									+ eval(importeImputado);

							tablaDetalle.row.add([ servicio, importeNoImputado,
									importeImputado ]);
						}

						$("#txtTotal").val(importeTotal);

						tablaDetalle.draw();

					});

}

function limpiarDiv() {
	document.getElementById('frmtiposervicio').innerHTML = '';
}

function salirLiquidacion() {
	limpiarFormulario();
	$('#modal-liquidacion').modal('hide');
}

function generarPresentacion() {

	var presentacion = {};

	presentacion["periodo"] = new Object();
	presentacion.periodo["id"] = $('#cmbPeriodo').val();
	presentacion["notas"] = $("#txtnota").val();
	presentacion["importePresentacion"] = $("#txtTotal").val();
	var from = $("#txtVencimiento").val().split("/")
	var f = new Date(from[2], from[1] - 1, from[0])
	presentacion["fechaVencimiento"] = f;
	
	$.ajax({
		type : "POST",
		url : _path + "api/presentaciones/",
		data : JSON.stringify(presentacion),
		dataTYpe : 'json',
		contentType : 'application/json',
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
			modalWaitShow();
		}
	}).done(function(data) {
		modalWaitHide();
		modalSuccess("Operación realizada correctamente.");
		window.location.href = _path + "usuario/presentacion";
	}).fail(function(data) {
		modalError("La operación no pudo realizarse correctamente.", data)
	});

}
