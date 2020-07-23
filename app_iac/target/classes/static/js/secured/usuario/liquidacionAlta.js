var tablaDetalle;
var idForm;
var servParamObj;
var form;
var fileSelect;
var uploadButton;
var liquidaciones;
var idPeriodo;
$(document).ready(function() {
	
	 $('#txtPeriodo').datepicker({
		    format: 'dd/mm/yyyy',
		    defaultDate: 0,
		    autoclose: true,
		    todayHighlight: true,
		    language: 'es', 
		    
	 });
	 $('#txtPeriodo').datepicker( "setDate", new Date() );
	 calcularPeriodo();
	 $("#cmbServicio").focus();
	 $('#txtPeriodo').change(function() {
		 calcularPeriodo();
	 });

	 
	 
	tablaDetalle = $("#tblDetalleLiquidacion").DataTable({
		'language' : {
			'url' : _path + 'js/plugins/datatables.es.json'
		},
		'columnDefs' : [
						{className : 'text-right', 'targets' : [ 4 ]},
						{className : 'text-left', 'targets' : [ 1,3 ]},
						{className : 'text-center', 'targets' : [0,2 ]} 
						]
	});

	$("#detalle").hide();

	loadComboServicio();
});

function onOpenLoad(fileContent) {
	var data = JSON.parse(fileContent);
}

function loadComboServicio() {
	$.ajax({
		type : "GET",
		async : false,
		url : _path + "api/servicios",
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
		}
	}).done(
			function(data) {
				for (i = 0; i < data.rows.length; i++) {
					var id = data.rows[i].id;
					var descrip = data.rows[i].descripcion;
					var tipo = data.rows[i].tipo;
					servicioParametro = data.rows[i].servicioParametro;
					$('#cmbServicio').append(
							'<option servicioParametro="' + servicioParametro
									+ '" tipo="' + tipo + '" value="' + id
									+ '">' + descrip + '</option>');

				}
			});
}

function dibujarCamposConf() {
	servParamObj = '';
	var selector = document.getElementById('cmbServicio');
	var tipo = selector[selector.selectedIndex].attributes[1].value;
	var idServ = selector[selector.selectedIndex].attributes[2].value;
	validarServicioPeriodo(idServ);
	getParametro(idServ);
	modalWaitHide();
	modalWaitHide();	
}

function getParametro(idServicio) {

	servParamObj = '';
	$.ajax({
		type : "GET",
		async : false,
		url : _path + "api/servicios/" + idServicio,
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
		}
	}).done(function(data) {
		servParamObj = JSON.parse(data.servicioParametro);
		cargarParametroServicioTipo(data.tipo, servParamObj);
	});
	//return servParamObj;
}

function cargarParametroServicioTipo(idTipo, servParamObj) {

	limpiarDiv();
	$.ajax({
		type : "GET",
		url : _path
				+ "api/servicios/tipos/parametros?searchField=servicioTipo&searchOper=eq&searchString="
				+ idTipo,
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
		}
	}).done(
	function(data) {
		idForm = {
			items : []
		};
		for (i = 0; i < data.rows.length; i++) {
			var idElement = data.rows[i].id;
			var codigo = data.rows[i].codigo;
			var label = data.rows[i].label;
			var tipoDato = data.rows[i].tipoValor;
			var value = '';
			var idParam = 0;
			if (servParamObj != null) {
				value = servParamObj[i].valor;
				idParam = servParamObj[i].id;
			}

			dibujarForm(idElement, label, codigo, tipoDato, value, idParam);

			idForm.items.push({
				id : idElement,
				titulo : label,
				tipodato : tipoDato,
				idParam : idParam
			});
		}

	});
	$('#modal-entidad').modal();

}

function dibujarForm(idElement, label, codigo, tipoDato, value, idParam) {

	if (tipoDato == 'NUMERO') {
		$('#frmtiposervicio').append('<div class="col-md-3"><label for=lbl_' + idElement + '>' 
				+ label + '</label><input disabled type=number  class="form-control"  codigo="'
				+ codigo + '"  idParam = "' + idParam + '" id=tb'
				+ idElement + ' ' + 'value="' + value + '" /></div>');

	}

	if (tipoDato == 'TEXTO') {
		$('#frmtiposervicio').append('<div class="col-md-3"><label for=lbl_' + idElement + '>' 
				+ label + '</label><input disabled type=text class="form-control" codigo="'
										+ codigo + '" idParam = "' + idParam + '" id=tb'
										+ idElement + ' ' + 'value="' + value + '" /></div>');
	}

	if (tipoDato == 'FECHA') {
		$('#frmtiposervicio').append('<div class="col-md-3"><label for=lbl_' + idElement + '>' 
				+ label + '</label><input disabled type=date class="form-control" codigo="'
				+ codigo + '" idParam = "' + idParam + '" id=tb'
				+ idElement + ' ' + 'value="' + value + '" /></div>');
	}

}

function limpiarDiv() {
	document.getElementById('frmtiposervicio').innerHTML = '';
}

function salirLiquidacion() {
	$('#modal-liquidacion').modal('hide');
}



// carga y recarga de la tabla.

function procesarAccion() {

	$("#detalle").hide();

	var selector = document.getElementById('cmbServicio');
	var idServ = selector[selector.selectedIndex].attributes[2].value;
	servicio = idServ;

	// FILE
	var singleFileUploadInput = document
			.querySelector('#singleFileUploadInput');
	var files = singleFileUploadInput.files;

	if (files.length === 0) {
		modalError( "Por favor, seleccione un archivo.");
		return;
	}

	var formData = new FormData();
	formData.append("file", files[0]);

	var modo = $("#accion-form").val();

	$.ajax({
		type : modo,
		enctype : 'multipart/form-data',
		url : _path + "api/liquidacion/validar/" + idServ,
		data : formData,
		dataTYpe : 'json',
		contentType : 'application/json',
		processData : false,
		contentType : false,
		async : false,
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
			modalWaitShow();
		}
	}).done(function(data) {
				modalWaitHide();
				$("#detalle").show();
				liquidaciones = data;
				var imputado = 0;
				var noimputado = 0;
				for (i = 0; i < data.length; i++) {
					var fila = data[i].fila;
					var nroSuscriptor = data[i].nroSuscriptor;
					var descripcion = data[i].descripcion;
					var importe = data[i].importe;
					var estado = data[i].statusImputaciones;
					if (estado == "NO IMPUTADO") {
						noimputado = eval(noimputado) + eval(importe);
					} else {
						imputado = eval(imputado) + eval(importe);
					}
					tablaDetalle.row.add([nroSuscriptor, estado, fila, descripcion, importe]);
				}
				tablaDetalle.draw();
				imputado   = parseFloat(Math.round(imputado * 100) / 100).toFixed(2);
				noimputado = parseFloat(Math.round(noimputado * 100) / 100).toFixed(2);
				$("#txtImputado").val(imputado);
				$("#txtNoImputado").val(noimputado);
				$("#liquidacion").hide();
			}).fail(function(data) {
		modalError("La operación no pudo realizarse correctamente.", data)
	});
}

function cargar(id, accion) {

	$("#form-group-id").show();
	$("#txtId").val("").attr('readonly', 'readonly');
	$("#txtVersion").val("").attr('readonly', 'readonly').hide();

	if (accion == 'DELETE') {
		$("#modal-entidad-title").html('Eliminar Liquidación');
		$("#btnProcesar").html('Eliminar');
		$("#txtPeriodo").attr('readonly', 'readonly');

		// Se quita el datapicker para la eliminación.
		$('#txtPeriodo').datepicker('remove');
		// Se quitan validaciones en acción de eliminar.
		$('#frmLiquidacion').validator('destroy');
	}

	if (accion == 'PUT') {
		$("#modal-entidad-title").html('Editar Afiliado');
		$("#btnProcesar").html('Guardar');

	}

	$.ajax({
		type : "GET",
		url : _path + "api/liquidacion/" + id,
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
		}
	}).done(
			function(data) {
				$("#accion-form").val(accion);
				$("#txtId").val(data.id);
				$("#txtVersion").val(data.version);

				var date = new Date(data.fechaAlta);
				var fecha = date.getDate() + '/'
						+ (date.getMonth() + 1) + '/' + date.getFullYear();
				$("#txtPeriodo").val(fecha);
			});
	$('#modal-liquidacion').modal();
}

function liquidar() {

	var selector = document.getElementById('cmbServicio');
	var idServ = selector[selector.selectedIndex].attributes[2].value;
	servicio = idServ;

	var from = $("#txtPeriodo").val().split("/")
	var fechaliq = new Date(from[2], from[1] - 1, from[0]);

	var imputado = $("#txtImputado").val();
	var noimputado = $("#txtNoImputado").val();
	var a = liquidaciones;
	var modo = "POST";

	$.ajax({
		type : modo,
		enctype : 'multipart/form-data',
		url : _path + "api/liquidacion/liquidar/",
		data : JSON.stringify(liquidaciones),
		dataTYpe : 'json',
		contentType : 'application/json',
		processData : false,
		contentType : false,
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
			xhr.setRequestHeader('imputado', imputado);
			xhr.setRequestHeader('noimputado', noimputado);
			xhr.setRequestHeader('idserv', idServ);
			xhr.setRequestHeader('idperiodo', idPeriodo);
			xhr.setRequestHeader('fechaliq', fechaliq);
			modalWaitShow();
		}
	}).done(function(data) {

		modalWaitHide();
		modalSuccess("Operación realizada correctamente.");

		window.location.href = _path + "usuario/liquidacion";

	}).fail(function(data) {
		modalError("La operación no pudo realizarse correctamente.", data)
	});

}

function calcularPeriodo() {

	var from = $("#txtPeriodo").val().split("/")
	f = new Date(from[2], from[1] - 1, from[0]);

	$.ajax({
		type : 'GET',
		enctype : 'multipart/form-data',
		url : _path + "api/periodos/calcular",
		data : JSON.stringify(liquidaciones),
		dataTYpe : 'json',
		contentType : 'application/json',
		processData : false,
		contentType : false,
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
			xhr.setRequestHeader('fecha', f);
			modalWaitShow();
		}
	}).done(function(data) {
		modalWaitHide();
		if (data.id == null) {
			modalError("No posee periodo para la fecha seleccionada.", data);
		} else {
			idPeriodo=data.id;
			let fechaDesde = moment(data.fechaDesde);
			let fechaHasta = moment(data.fechaHasta);
			$("#txtIntervaloPeriodo").val(fechaDesde.format('DD/MM/YYYY') + ' a ' + fechaHasta.format('DD/MM/YYYY'));
		}

	}).fail(function(data) {
		modalError("La operación no pudo realizarse correctamente.", data);
	});

}

function validarServicioPeriodo(idServ){
	$.ajax({
		type : 'GET',
		enctype : 'multipart/form-data',
		url : _path + "api/liquidacion/control",
		data : JSON.stringify(liquidaciones),
		dataTYpe : 'json',
		contentType : 'application/json',
		processData : false,
		async : false,
		contentType : false,
		beforeSend : function(xhr) {
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf);
			xhr.setRequestHeader('idPeriodo', idPeriodo);
			xhr.setRequestHeader('idServ', idServ);
			modalWaitShow();
		}
	}).done(function(data) {
		modalWaitHide();
		if (data.length >0) {
			modalError("Posee liquidaciones para el periodo y servicio seleccionado.", data);
		} 
	}).fail(function(data) {
		modalError("La operación no pudo realizarse correctamente.", data);
	});	
}