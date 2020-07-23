var tabla;

$(document).ready(function(){

	tabla = $("#tblTipoAfiliados").DataTable({
		'language'   : {'url'   : _path + 'js/plugins/datatables.es.json'},		        	
		'columnDefs' : [	{ className: 'text-left',  	'targets': [0, 1] }, 
							{ className: 'text-center', 'targets': [2] }, 
					   ],
	     'order'	 : [[1, 'asc']], 
	     'columnDefs': [{ 'width': '10%', 'targets': [0, 2] }]
		});
	
	 loadData();
		
	 $('#frmTipoAfiliados').validator().on('submit', function (e) {
		  if (e.isDefaultPrevented()) {
		    return false;
		  } else {
			e.preventDefault(e);
		    procesarAccion();
		  }
	 });
});

function salir(){
	limpiarFormulario();
	$('#modalEntidad').modal('hide');
	$("#accion-form").val('POST');
	$("#modal-entidad-title").html('Nuevo Tipo Afiliado');
	$("#btnProcesar").html('Guardar');
	$("#form-group-id").hide();
	$("#txtId").val("").attr('readonly', 'readonly');
	$("#txtVersion").val("").attr('readonly', 'readonly').hide();
	$("#txtDescripcion").val("").attr('readonly', false);
}

function limpiarFormulario(){
	//limpia campos
	$("#accion-form").val('POST');
	$("#form-group-id").hide();
	$("#txtId").val("").attr('readonly', 'readonly');
	$("#txtVersion").val("").attr('readonly', 'readonly').hide();
	$("#txtDescripcion").val("").attr('readonly', false);	
	
}

// carga y recarga de la tabla.
function loadData(){
		
	   tabla.clear();
	   
		$.ajax({
		    type: "GET",
		    url: _path + "api/afiliados/tipos",
			beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
		}).done( function(data){

        for(i=0;i<data.rows.length;i++){

         	tabla.row.add([
         		data.rows[i].id,
         		data.rows[i].descripcion,         		         		
         		'<div class="text-center">' + 
                	'<a onclick="cargar(\''+data.rows[i].id+'\', \'PUT\')" href="#"><i class="fa fa-pencil"></i></a>' + 
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

	var modo = $("#accion-form").val();
	var urlPostfijo   = '';
	if(modo=='PUT')
		urlPostfijo   = '/' + servicio["id"];
	if(modo=='DELETE')
		urlPostfijo   = '/' + servicio["id"] + '?version=' + servicio["version"];
	
	$.ajax({
	    type: modo,
	    url: _path + "api/afiliados/tipos" + urlPostfijo,
	    data: JSON.stringify(servicio),
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	
			modalWaitShow();
		}
	}).done(function(){
		modalSuccess("Operación realizada correctamente.");
		$("#modalEntidad").modal('hide');
		limpiarFormulario();		
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
		$("#modal-entidad-title").html('Eliminar Tipo Afiliado');
		$("#btnProcesar").html('Eliminar');
		$("#txtDescripcion").attr('readonly', 'readonly');		
	}
	
	if(accion=='PUT'){	
		$("#modal-entidad-title").html('Editar Servicio');
	}
	
	$.ajax({
	    type: "GET",
	    url: _path + "api/afiliados/tipos/"+id,
		beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
	}).done( function(data){
		$("#accion-form").val(accion);
		$("#txtId").val(data.id);
		$("#txtVersion").val(data.version);
		$("#txtDescripcion").val(data.descripcion);
				
	});
	$('#modalEntidad').modal();	
}