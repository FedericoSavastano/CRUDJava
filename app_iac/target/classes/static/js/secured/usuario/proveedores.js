var tabla;
var endpointRest = _path + "api/proveedores";


$(document).ready(function(){

	tabla = $("#tblListado").DataTable({
		'language'   : {'url'   : _path + 'js/plugins/datatables.es.json'},		        	
		'columnDefs' : [	{ className: 'text-left',  	'targets': [0, 2] }, 
							{ className: 'text-center', 'targets': [1, 3] },
							{ 'width': '10%', 'targets': [0, 3] },
							{ 'width': '30%', 'targets': [1] },
							{ 'width': '50%', 'targets': [2] },
					   ],
	     'order'	 : [[0, 'asc']]
		});
	
	 loadData();
		
	 $('#frmEntidad').validator().on('submit', function (e) {
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
	$("#modal-entidad-title").html('Nuevo Proveedor');
	$("#btnProcesar").html('Guardar');
}

function limpiarFormulario(){
	//limpia campos
	$("#accion-form").val('POST');
	$("#form-group-id").hide();
	$("#txtId").val("").attr('readonly', 'readonly');
	$("#txtVersion").val("").attr('readonly', 'readonly').hide();
	$("#txtCUIT").val("").attr('readonly', false);	
	$("#txtRazonSocial").val("").attr('readonly', false);	
	
}

// carga y recarga de la tabla.
function loadData(){
		
	   tabla.clear();
	   
		$.ajax({
		    type: "GET",
		    url: endpointRest,
			beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
		}).done( function(data){

        for(i=0;i<data.rows.length;i++){

         	tabla.row.add([
         		data.rows[i].id,
         		data.rows[i].cuit,
         		data.rows[i].razonSocial,         		         		
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
	servicio["cuit"] 		= $("#txtCUIT").val();
	servicio["razonSocial"] = $("#txtRazonSocial").val();
	servicio["version"]		= $("#txtVersion").val();	

	var modo = $("#accion-form").val();
	var urlPostfijo   = '';
	if(modo=='PUT')
		urlPostfijo   = '/' + servicio["id"];
	if(modo=='DELETE')
		urlPostfijo   = '/' + servicio["id"] + '?version=' + servicio["version"];
	
	$.ajax({
	    type: modo,
	    url: endpointRest + urlPostfijo,
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
		$("#modal-entidad-title").html('Eliminar Proveedor');
		$("#btnProcesar").html('Eliminar');
		$("#txtCUIT").attr('readonly', 'readonly');	
		$("#txtRazonSocial").attr('readonly', 'readonly');		
	}
	
	if(accion=='PUT'){	
		$("#modal-entidad-title").html('Editar Proveedor');
		$("#txtCUIT").attr('readonly', false);	
		$("#txtRazonSocial").attr('readonly', false);	
	}
	
	$.ajax({
	    type: "GET",
	    url: endpointRest + "/" +id,
		beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
	}).done( function(data){
		$("#accion-form").val(accion);
		$("#txtId").val(data.id);
		$("#txtVersion").val(data.version);
		$("#txtCUIT").val(data.cuit);
		$("#txtRazonSocial").val(data.razonSocial);
				
	});
	$('#modalEntidad').modal();	
}