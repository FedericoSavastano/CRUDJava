var tabla;
var endpointRest = _path + "api/periodos";

$(document).ready(function() {

	tabla = $("#tblListado").DataTable({
		'language' : {
			'url' : _path + 'js/plugins/datatables.es.json'
		},
		'columnDefs' : [ {
			className : 'text-left',
			'targets' : [ 0, 1, 2, 3 ]
		}, {
			className : 'text-center',
			'targets' : [ 1, 2, 3 ]
		} ],
		'order' : [ [ 0, 'asc' ] ]
	});

	loadData();

	$('#frmEntidad').validator().on('submit', function(e) {
		if (e.isDefaultPrevented()) {
			return false;
		} else {
			e.preventDefault(e);
			procesarAccion();
		}
	});
});

function salir() {
	limpiarFormulario();
	$('#modalEntidad').modal('hide');
	$("#modal-entidad-title").html('Nuevo Periodo');
	$("#btnProcesar").html('Guardar');
}

function limpiarFormulario() {
	// limpia campos
	$("#accion-form").val('POST');
	$("#form-group-id").hide();
	$("#txtId").val("").attr('readonly', 'readonly');
	$("#txtVersion").val("").attr('readonly', 'readonly').hide();
	$("#txtFechaDesde").val("").attr('readonly', false);
	$("#txtFechaHasta").val("").attr('readonly', false);
	$("#txtEstado").val("").attr('readonly', false);

}

// carga y recarga de la tabla.
function loadData() {

	tabla.clear();

	$
			.ajax({
				type : "GET",
				url : endpointRest,
				beforeSend : function(xhr) {
					xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
				}
			})
			.done(
					function(data) {

						for (i = 0; i < data.rows.length; i++) {

							var date = new Date(data.rows[i].fechaDesde);
							var fechaDesde = date.getDate() + '/'
									+ (date.getMonth() + 1) + '/'
									+ date.getFullYear();

							var date = new Date(data.rows[i].fechaHasta);
							var fechaHasta = date.getDate() + '/'
									+ (date.getMonth() + 1) + '/'
									+ date.getFullYear();

							tabla.row
									.add([
											data.rows[i].id,
											fechaDesde,
											fechaHasta,
											data.rows[i].estado,
											'<div class="text-center">'
													+ '<a onclick="cargar(\''
													+ data.rows[i].id
													+ '\', \'PUT\')" href="#"><i class="fa fa-pencil"></i></a>'
													+ '    '
													+ '<a onclick="cargar(\''
													+ data.rows[i].id
													+ '\', \'DELETE\')" href="#"><i class="fa fa-trash"></i></a>'
													+ '</div>' ]);
						}
						tabla.draw();
					});
}

function procesarAccion() {

	var servicio = {};
	servicio["id"] = $("#txtId").val();

	var from = $("#txtFechaDesde").val().split("/")
	var f = new Date(from[2], from[1] - 1, from[0])
	servicio["fechaDesde"] = f;

	var from = $("#txtFechaHasta").val().split("/")
	var f = new Date(from[2], from[1] - 1, from[0])
	servicio["fechaHasta"] = f;

	servicio["estado"] = 'PENDIENTE';

	servicio["version"] = $("#txtVersion").val();

	var modo = $("#accion-form").val();
	var urlPostfijo = '';
	if (modo == 'PUT')
		urlPostfijo = '/' + servicio["id"];
	if (modo == 'DELETE')
		urlPostfijo = '/' + servicio["id"] + '?version=' + servicio["version"];

	$.ajax({
		type : modo,
		url : endpointRest + urlPostfijo,
		data : JSON.stringify(servicio),
		dataTYpe : 'json',
		contentType : 'application/json',
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
			modalWaitShow();
		}
	}).done(function() {
		modalSuccess("Operación realizada correctamente.");
		$("#modalEntidad").modal('hide');
		limpiarFormulario();
		loadData();
	}).fail(function(data) {
		modalError("La operación no pudo realizarse correctamente.", data)
	});
}

function cargar(id, accion) {

	$("#form-group-id").show();
	$("#txtId").val("").attr('readonly', 'readonly');
	$("#txtVersion").val("").attr('readonly', 'readonly').hide();

	if (accion == 'DELETE') {
		$("#modal-entidad-title").html('Eliminar Proveedor');
		$("#btnProcesar").html('Eliminar');
		$("#txtFechaDesde").attr('readonly', 'readonly');
		$("#txtFechaHasta").attr('readonly', 'readonly');
		$("#txtEstado").attr('readonly', 'readonly');
	}

	if (accion == 'PUT') {
		$("#modal-entidad-title").html('Editar Proveedor');
		$("#txtEstado").attr('readonly', 'readonly');
	}

	$.ajax({
		type : "GET",
		url : endpointRest + "/" + id,
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
		}
	}).done(
			function(data) {
				$("#accion-form").val(accion);
				$("#txtId").val(data.id);
				$("#txtVersion").val(data.version);
				$("#txtEstado").val(data.estado);

				var date = new Date(data.fechaDesde);
				var fechaDesde = date.getDate() + '/' + (date.getMonth() + 1)
						+ '/' + date.getFullYear();

				$("#txtFechaDesde").val(fechaDesde);

				var date = new Date(data.fechaHasta);
				var fechaHasta = date.getDate() + '/' + (date.getMonth() + 1)
						+ '/' + date.getFullYear();
				
				$("#txtFechaHasta").val(fechaHasta);

			});
	$('#modalEntidad').modal();
}