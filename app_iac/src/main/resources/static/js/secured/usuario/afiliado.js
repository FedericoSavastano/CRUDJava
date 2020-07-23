var tabla;

$(document).ready(function(){

	loadComboTipoAfiliado();
	            
	tabla = $("#tblAfiliados").DataTable({
		'language'   : {'url'   : _path + 'js/plugins/datatables.es.json'},		        	
		'columnDefs' : [	{ className: 'text-left',  	'targets': [1] }, 
							{ className: 'text-center', 'targets': [2] }
							
					   ],
	     'order'	 : [[1, 'asc']], 
	     'columnDefs': [{ 'width': '10%', 'targets': [2] },
	                    { "visible": false, "targets": [0,8] }
	                   ]
	});

	loadData();
	
	//Limpia mensajes de validacion del form en el hidden.
	//Unicamente cuando se oculta el modal haciendo click en algún lugar de la pantalla.
	//El evento hide.bs.modal también se ejecuta cuando se pierde el foco en el datapicker, por
	//eso es necesario validar que no sea el datepicker el que genera el evento.
	$("#modal-afiliado").on('hide.bs.modal', function (e) {
		var targetId = $(e.target).attr('id');
		if(targetId != 'txtFechaAlta') {
			limpiarFormulario();
		}	 
	 });
	 
	 createValidator();
	 createDatepicker();

});


function createDatepicker() {

	$('#txtFechaAlta').datepicker({
	    format: 'dd/mm/yyyy',
	    endDate: '0d',
	    autoclose: true,
	    todayHighlight: true,
	    language: 'es'
	});
}


function createValidator() {

	$('#frmAfiliado').validator({
		 custom: {
			 dateformat: function($el) {
			    if (!moment($el.val(), 'DD/MM/YYYY',true).isValid()) {
			    	return "Formato de fecha inválido" 
				}
		 	 }
	 	}
	 }).on('submit', function (e) {
		  if (e.isDefaultPrevented()) {
		    return false;
		  } else {
			e.preventDefault(e);
			procesarAccion();
		  }
	 });
	
}


function salirAfiliado(){
	limpiarFormulario();
	$('#modal-afiliado').modal('hide');
}


function limpiarFormulario(){
	//limpia campos
	$("#form-group-id").hide();
	$("#txtId").val("").attr('readonly', 'readonly');
	
	$("#txtFechaAlta").val("").attr('readonly', false);
	$("#txtNroAfiliado").val("").attr('readonly', false);
	$("#txtIdExterno").val("").attr('readonly', false);
	$("#cmbTipoAfiliado").val("").attr('readonly', false);
	$("#cmbTipoAfiliado").val("").attr('disabled', false);
	
	//Resetea validaciones del formulario.
	$('#frmAfiliado')[0].reset();
	$('#frmAfiliado').validator('destroy').validator();

}

function loadComboTipoAfiliado(){

	//combo tipo Afiliado
	$.ajax({
		    type: "GET",
		    url: _path + "api/afiliados/tipos",
			beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
		}).done( function(data){
			for(i=0;i<data.rows.length;i++){
			    var id =data.rows[i].id ;
			    var descrip =data.rows[i].descripcion;
			    $('#cmbTipoAfiliado').append('<option value="' + id  + '">' + descrip  + '</option>');
			}
		});
}	


// carga y recarga de la tabla.
function loadData(){
	   tabla.clear();
		$.ajax({
		    type: "GET",
		    url: _path + "api/afiliados?fetchs=persona,tipoAfiliado",
			beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
		}).done( function(data){

			for(i=0;i<data.rows.length;i++){
	        	var date = new Date(data.rows[i].fechaAlta); 
	        	var fechaAlta=  date.getDate()+'/' + (date.getMonth()+1) + '/'+date.getFullYear();
	        	
	         	tabla.row.add([
	         		data.rows[i].id,
	         		data.rows[i].numeroAfiliado,
	         		data.rows[i].persona.apellido,
	         		data.rows[i].persona.nombre,
	         		data.rows[i].persona.tipoDocumento,
	         		data.rows[i].persona.documento,
	         		data.rows[i].tipoAfiliado.descripcion,
	         		fechaAlta,
	         		data.rows[i].persona.idExterno,
	         		data.rows[i].idExterno,
	         		'<div class="text-center">' + 
	                	'<a href="' + _path + 'usuario/afiliadosFicha/' + data.rows[i].id + '"><i class="fa fa-pencil"></i></a>' + 
	                	'    ' +
	                	'<a onclick="cargar(\''+data.rows[i].id+'\', \'DELETE\')" href="#"><i class="fa fa-trash"></i></a>' + 
	                '</div>'
	                ]);
			   }		   
			   tabla.draw();
		});
}

function procesarAccion(){


	var servicio ={};
	servicio["id"] 			= $("#txtId").val();
	servicio["descripcion"] 			= $("#txtDescripcion").val();
	servicio["version"]		= $("#txtVersion").val();	
	
	servicio["numeroAfiliado"] 			= $("#txtNroAfiliado").val();	
	servicio["idExterno"] 			= $("#txtIdExterno").val();	
	
	var from = $("#txtFechaAlta").val().split("/")
	var f = new Date(from[2], from[1] - 1, from[0])
	servicio["fechaAlta"]=f;
	
	servicio["persona"]        = new Object();	
	servicio.persona["id"] 	= localStorage.getItem('personaId');		
	
	servicio["tipoAfiliado"]        = new Object();	
	servicio.tipoAfiliado["id"] 	= $("#cmbTipoAfiliado").val();		


	var modo = $("#accion-form").val();
	var urlPostfijo   = '';
	if(modo=='PUT')
		urlPostfijo   = '/' + servicio["id"];
	if(modo=='DELETE')
		urlPostfijo   = '/' + servicio["id"] + '?version=' + servicio["version"];
	
	$.ajax({
	    type: modo,
	    url: _path + "api/afiliados" + urlPostfijo,
	    data: JSON.stringify(servicio),
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	
			modalWaitShow();
		}
	}).done(function(){
		salirAfiliado();
		modalSuccess("Operación realizada correctamente.");
		loadData();
	})
	.fail(function(data){
		modalError("La operación no pudo realizarse correctamente.", data)
	});
}

function cargar(id, accion){	
	
	$("#form-group-id").show();
	$("#txtId").val("").attr('readonly', 'readonly');
	$("#txtVersion").val("").attr('readonly', 'readonly').hide();

	if(accion=='DELETE'){
		$("#modal-entidad-title").html('Eliminar Afiliado');
		$("#btnProcesar").html('Eliminar');
		$("#txtNroAfiliado").attr('readonly', 'readonly');
		$("#txtIdExterno").attr('readonly', 'readonly');
		$("#cmbTipoAfiliado").attr('disabled', 'disabled');
		$("#txtFechaAlta").attr('readonly', 'readonly');
		
		// Se quita el datapicker para la eliminación.
		$('#txtFechaAlta').datepicker('remove');
		//Se quitan validaciones en acción de eliminar.
		$('#frmAfiliado').validator('destroy');
	}
	
	if(accion=='PUT'){	
		$("#modal-entidad-title").html('Editar Afiliado');
		$("#btnProcesar").html('Guardar');

		createValidator();
		createDatepicker();
	}
	
	$.ajax({
	    type: "GET",
	    url: _path + "api/afiliados/"+id,
		beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
	}).done( function(data){
		$("#accion-form").val(accion);
		$("#txtId").val(data.id);
		$("#txtVersion").val(data.version);
		
		$("#txtNroAfiliado").val(data.numeroAfiliado);
		$("#txtIdExterno").val(data.idExterno);
		
		var date = new Date(data.fechaAlta);
        var fechaNacimiento=  date.getDate()+'/' + (date.getMonth()+1) + '/'+date.getFullYear();		
		$("#txtFechaAlta").val(fechaNacimiento);		
	
		combo_FilterByValue($('#cmbTipoAfiliado'), $('#cmbTipoAfiliado option'), data.xIdTipoAfiliado);
	});
	$('#modal-afiliado').modal();	
}

