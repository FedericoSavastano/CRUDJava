var tabla;

$(document).ready(function(){

	tabla = $("#tblClientes").DataTable({
		'language'   : {'url'   : _path + 'js/plugins/datatables.es.json'},		        	
		'columnDefs' : [	{ className: 'text-left', 	'targets': [2] }, 
							{ className: 'text-center', 'targets': [0, 1, 3] }, 
							{ 'width': '5%', 'targets': [0] }, 
							{ 'width': '10%', 'targets': [1, 3] }
							
					   ],
	     'order'	 : [[1, 'asc']]
		});
	
	 loadData();
	 
	$('#formulario-entidad').validator().on('submit', function (e) {
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
	$('#modal-entidad').modal('hide');
}

function limpiarFormulario(){
	//limpia campos
	$("#accion-form").val('POST');
	$("#modal-entidad-title").html('Nuevo Cliente');
	$("#btnProcesar").html('Guardar');
	$("#form-group-id").hide();
	$("#txtId").val("").attr('readonly', 'readonly');
	$("#txtVersion").val("").attr('readonly', 'readonly').hide();
	$("#txtCuit").val("").attr('readonly', false);
	$("#txtDenominacion").val("").attr('readonly', false);
}

// carga y recarga de la tabla.
function loadData(){
		
	   tabla.clear();
		$.ajax({
		    type: "GET",
		    url: _path + "api/clientes",
			beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
		}).done( function(data){

        for(i=0;i<data.rows.length;i++){

         	tabla.row.add([
         		data.rows[i].id,
         		data.rows[i].cuit,
         		data.rows[i].denominacion,
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
	var cliente ={};
	cliente["id"] 			= $("#txtId").val();
	cliente["version"]		= $("#txtVersion").val();
	cliente["cuit"] 		= $("#txtCuit").val();
	cliente["denominacion"] = $("#txtDenominacion").val();

	var modo = $("#accion-form").val();
	var urlPostfijo   = '';
	if(modo=='PUT')
		urlPostfijo   = '/' + cliente["id"];
	if(modo=='DELETE')
		urlPostfijo   = '/' + cliente["id"] + '?version=' + cliente["version"];
	
	$.ajax({
	    type: modo,
	    url: _path + "api/clientes" + urlPostfijo,
	    data: JSON.stringify(cliente),
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
			modalWaitShow();
		}
	}).done(function(){
		modalSuccess("Operación realizada correctamente.");
		$("#modal-entidad").modal('hide');
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
		$("#modal-entidad-title").html('Eliminar Cliente');
		$("#btnProcesar").html('Eliminar');
		$("#txtCuit").attr('readonly', 'readonly');
		$("#txtDenominacion").attr('readonly', 'readonly');
	}
	if(accion=='PUT'){	
		$("#modal-entidad-title").html('Editar Cliente');
	}

	$.ajax({
	    type: "GET",
	    url: _path + "api/clientes/"+id,
		beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
	}).done( function(data){
		$("#accion-form").val(accion);
		$("#txtId").val(data.id);
		$("#txtVersion").val(data.version);
		$("#txtCuit").val(data.cuit);
		$("#txtDenominacion").val(data.denominacion);
	});
	$('#modal-entidad').modal();	
}