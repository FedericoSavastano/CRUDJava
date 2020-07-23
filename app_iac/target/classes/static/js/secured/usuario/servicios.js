var tabla;
var idForm;

$(document).ready(function() {

	tabla = $("#tabla-entidades").DataTable({
		'language' : {
			'url' : _path + 'js/plugins/datatables.es.json'
		},
		'columnDefs' : [ {
			className : 'text-left',
			'targets' : [ 0, 1, 2, 3 ]
		}, {
			className : 'text-center',
			'targets' : [ 4 ]
		}, {
			'width' : '5%',
			'targets' : [ 0 ]
		}, {
			'width' : '10%',
			'targets' : [ 1, 3, 4 ]
		} ],
		'order' : [ [ 1, 'asc' ] ]
	});

	loadData();

	cargarTipos();
	cargarProveedores();

	$('#formulario-entidad').validator().on('submit', function(e) {
		if (e.isDefaultPrevented()) {
			return false;
		} else {
			e.preventDefault(e);
			procesarAccion();
		}
	});

	limpiarDiv();

});

function cargarProveedores() {
	$.ajax({
		type : "GET",
		url : _path + "api/proveedores",
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
		}
	}).done(
			function(data) {
				for (i = 0; i < data.rows.length; i++) {
					var id = data.rows[i].id;
					var descrip = data.rows[i].razonSocial;
					$('#cmbProveedor').append(
							'<option value="' + id + '">' + descrip	+ '</option>');
				}
			});
}

function cargarTipos() {

	$.ajax({
		type : "GET",
		url : _path + "api/servicios/tipos",
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
		}
	}).done(
			function(data) {
				for (i = 0; i < data.length; i++) {
					$('#cmbTipo').append(
							'<option value="' + data[i] + '">' + data[i]
									+ '</option>');
				}
			});

}

function limpiarDiv() {
	document.getElementById('frmtiposervicio').innerHTML = '';
}

function dibujarCamposConf() {

	var selector = document.getElementById('cmbTipo');
	var value = $('#cmbTipo').val();

	cargarParametroServicioTipo(value, null);
}

function salir() {
	limpiarFormulario();
	$('#modal-entidad').modal('hide');
}

function limpiarFormulario() {
	// limpia campos
	limpiarDiv();

	$("#accion-form").val('POST');
	$("#modal-entidad-title").html('Nuevo Servicio');
	$("#btnProcesar").html('Guardar');
	$("#form-group-id").hide();
	$("#txtId").val("").attr('readonly', 'readonly');
	$("#txtVersion").val("").attr('readonly', 'readonly').hide();
	$("#txtCodigo").val("").attr('readonly', false);
	$("#txtDescripcion").val("").attr('readonly', false);
	$("#cmbTipo").val('EMPTY').attr('readonly', false);
	$("#cmbProveedor").val('EMPTY').attr('readonly', false);
	
}

// carga y recarga de la tabla.
function loadData() {
	tabla.clear();
	$
			.ajax({
				type : "GET",
				url : _path + "api/servicios",
				beforeSend : function(xhr) {
					xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
					modalWaitShow();
				}
			})
			.done(
					function(data) {
						for (i = 0; i < data.rows.length; i++) {
							tabla.row
									.add([
											data.rows[i].id,
											data.rows[i].codigo,
											data.rows[i].descripcion,
											data.rows[i].tipo,
											'<div class="text-center">'
													+ '<a onclick="cargar(\''
													+ data.rows[i].id
													+ '\', \'PUT\')" href="#"><i class="fa fa-pencil"></i></a>&nbsp;&nbsp;&nbsp;'
													+ '<a onclick="cargar(\''
													+ data.rows[i].id
													+ '\', \'DELETE\')" href="#"><i class="fa fa-trash"></i></a>&nbsp;&nbsp;&nbsp;'
													+ '<a onclick="verSuscripciones(\''
													+ data.rows[i].id
													+ '\')" href="#"><i class="fa fa-link"></i></a>'
													+ '</div>' ]);
							
							
							
						}
						tabla.draw();
						modalWaitHide();
					})

			.fail(function(data) {
				modalError("La tabla no pudo cargarse correctamente.", data)
			});
}


function verSuscripciones(idServicio){
	window.location = _path + 'usuario/servicios/suscripciones?idServicio=' + idServicio;	
}

function procesarAccion() {

	if ($("#cmbTipo").val() == 'EMPTY') {
		modalError(
				"El campo Tipo de Servicio es obligatorio. Por favor, seleccione uno.",
				null);
		return;
	}

	var servicio = {};
	servicio["id"] = $("#txtId").val();
	servicio["version"] = $("#txtVersion").val();
	servicio["codigo"] = $("#txtCodigo").val();
	servicio["descripcion"] = $("#txtDescripcion").val();
	servicio["tipo"] = $("#cmbTipo").val();
	servicio["proveedor"]        = new Object();	
	servicio.proveedor["id"] 	= $("#cmbProveedor").val();

	parametroServicio = {
		"items" : []
	};

	for (i = 0; i < idForm.items.length; i++) {

		var idElement = idForm.items[i].id;
		var valor = $("#" + idForm.items[i].id).val();
		var idParam = $("#" + idForm.items[i].id).attr('idParam');
		var codigo = $("#" + idForm.items[i].id).attr('codigo');
		var tipoDato = idForm.items[i].tipodato;

		// si se esta creando el paramserv la var idparam viene 0
		parametroServicio.items.push({
			codigo : codigo,
			valor : valor,
			tipodato : tipoDato,
			idparam : idParam
		});

	}

	servicio["servicioParametro"] = JSON.stringify(parametroServicio);

	var modo = $("#accion-form").val();
	var urlPostfijo = '';

	if (modo == 'PUT')
		urlPostfijo = '/' + servicio["id"];
	if (modo == 'DELETE')
		urlPostfijo = '/' + servicio["id"] + '?version=' + servicio["version"];

	$.ajax({
		type : modo,
		url : _path + "api/servicios" + urlPostfijo,
		data : JSON.stringify(servicio),
		dataTYpe : 'json',
		contentType : 'application/json',
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
		}
	}).done(function() {

		modalSuccess("Operación realizada correctamente.");
		$("#modal-entidad").modal('hide');
		limpiarFormulario();
		loadData();
	}).fail(function(data) {
		modalError("La operación no pudo realizarse correctamente.", data)
	});
}

function crearParametroSistema() {

	$.ajax({
		type : 'POST',
		url : _path + "api/servicios" + urlPostfijo,
		data : JSON.stringify(servicio),
		dataTYpe : 'json',
		contentType : 'application/json',
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
		}
	}).done(function() {

		if (modo == 'PUT')
			actualizarParametroSistema();
		if (modo == 'DELETE')
			eliminarParametroSistema();
		if (modo == 'POST')
			crearParametroSistema();

		modalSuccess("Operación realizada correctamente.");
		$("#modal-entidad").modal('hide');
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
		$("#modal-entidad-title").html('Eliminar Servicio');
		$("#btnProcesar").html('Eliminar');
		$("#txtCodigo").attr('readonly', 'readonly');
		$("#txtDescripcion").attr('readonly', 'readonly');
		$("#cmbTipo").attr('disabled', 'disabled');

	}
	if (accion == 'PUT') {
		$("#modal-entidad-title").html('Editar Servicio');
	}

	$.ajax({
		type : "GET",
		url : _path + "api/servicios/" + id,
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
		}
	}).done(function(data) {
		$("#accion-form").val(accion);
		$("#txtId").val(data.id);
		$("#txtVersion").val(data.version);
		$("#txtCodigo").val(data.codigo);
		$("#txtDescripcion").val(data.descripcion);
		$("#cmbTipo").val(data.tipo);
		
		//limpio el cmb de proveddores para que no cache el valor de otro servicio.
		document.getElementById("cmbProveedor").value = "EMPTY";
		if( data.proveedor!=null  ) {
			combo_FilterByValue($('#cmbProveedor'), $('#cmbProveedor option'), data.proveedor.id);
		}
		var servParamObj = JSON.parse(data.servicioParametro);

		cargarParametroServicioTipo(data.tipo, servParamObj);

	});
	$('#modal-entidad').modal();
}

function cargarParametroServicioTipo(idTipo, servParamObj) {

	limpiarDiv();

	$
			.ajax(
					{
						type : "GET",
						url : _path
								+ "api/servicios/tipos/parametros?searchField=servicioTipo&searchOper=eq&searchString="
								+ idTipo,
						beforeSend : function(xhr) {
							xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
						}
					}).done(function(data) {

				idForm = {
					items : []
				};

				for (i = 0; i < data.rows.length; i++) {

					var id = data.rows[i].id;
					var codigo = data.rows[i].codigo;
					var label = data.rows[i].label;					
					var tipoDato = data.rows[i].tipoValor;

					var value = '';
					var idParam = 0;

					if (servParamObj != null) {
						value = servParamObj[i].valor;
						idParam = servParamObj[i].id;
					}

					dibujarForm(id,label,codigo,tipoDato, value, idParam);

					idForm.items.push({
						id : id,
						titulo : label,
						tipodato : tipoDato,
						idParam : idParam
					});
				}

			});
	$('#modal-entidad').modal();

}

function dibujarForm(idElement, label,codigo ,tipoDato, value, idParam) {

	if (tipoDato == 'NUMERO') {

		$('#frmtiposervicio').append(
				'<label for=lbl_' + idElement + '>' + label + '</label>');

		$('#frmtiposervicio').append(
				'<input type=number  class="form-control" idParam = "'
						+ idParam + '" id= "' + idElement + '" codigo= "' + codigo +'" value="'
						+ value + '" />');
	}

	if (tipoDato == 'TEXTO') {

		$('#frmtiposervicio').append(
				'<label for=lbl_' + idElement + '>' + label + '</label>');

		$('#frmtiposervicio').append(
				'<input type=text class="form-control" idParam = "' + idParam
						+ '" id= "' + idElement + '" codigo= "' + codigo +'"value="' + value
						+ '" />');
	}

	if (tipoDato == 'FECHA') {

		$('#frmtiposervicio').append(
				'<label for=lbl_' + idElement + '>' + label + '</label>');

		$('#frmtiposervicio').append(
				'<input type=date class="form-control" idParam = "' + idParam
						+ '" id= "' + idElement + '" codigo= "' + codigo +'"value="' + value
						+ '" />');

	}

}
