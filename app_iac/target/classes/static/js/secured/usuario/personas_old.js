var tabla;
var tablaAfiliado;
var personas;

$(document).ready(function(){

	//Para el ABM de Personas.
	if(esAbmPersona()){
		tabla = craarTabla(tabla, '#tblPersonas', true);
		loadData(tabla, true);
	}
	
	//Para el ABM de Afiliados
	if(esAbmAfiliado()){
		tablaAfiliado = craarTabla(tablaAfiliado, '#tblPersonaAfiliados', false);
		loadData(tablaAfiliado, false);
	}
	 
	 loadCombo();	
	 
	//Limpia mensajes de validacion del form en el hidden.
	//Unicamente cuando se oculta el modal haciendo click en algún lugar de la pantalla.
	//El evento hide.bs.modal también se ejecuta cuando se pierde el foco en el datapicker, por
	//eso es necesario validar que no sea el datepicker el que genera el evento.
	 $("#modal-entidad").on('hide.bs.modal', function (e) {
		 var targetId = $(e.target).attr('id');
		 if(targetId != 'txtFechaNacimiento') {
			 limpiarFormulario();
		 }	 
	 });
	 
	 // Para validacione de campos Nombre y Apellido.
	
	 $(function(){
	    $("input[name=txtNombre]")[0].oninvalid = function () {
	        this.setCustomValidity("Completa este campo. Solamente puedes utilizar letras o espacios. (Max. 50)");
	    };
	    $("input[name=txtNombre]")[0].oninput = function () {
	        this.setCustomValidity("");
	    };
	 });
	 
	 $(function(){
	    $("input[name=txtApellido]")[0].oninvalid = function () {
	        this.setCustomValidity("Completa este campo. Solamente puedes utilizar letras o espacios. (Max. 50)");
	    };
	    $("input[name=txtApellido]")[0].oninput = function () {
	        this.setCustomValidity("");
	    };
	 });
	 
	 createValidator();
	 createDatepicker();

});



function createValidator() {
	
	$('#frmPersona').validator({
		 custom: {
			 lengthnumdoc: function($el) {
				if ($el.val().length < 8) {
			    	return "Longitud mínima 8 digitos" 
			    }
	 			else if($el.val().length > 9){
	 				return "Longitud máxima 9 digitos"
	 			}
	 			else if($el.val().length == 9 || $el.val().length == 8){
	 				// Validamos que no exista la persona.
	 				if(personas){
		 				for (i = 0; i < personas.length; i++) { 
		 					if(personas[i].documento.trim() == $el.val().trim()){
		 						return "Persona ya registrada";
		 					}
		 				}
	 				}	
	 			}
	 		 },
	 		 dateformat: function($el) {
			    if (!moment($el.val(), 'DD/MM/YYYY',true).isValid()) {
			    	return "Formato de fecha inválido" 
				}
		 	 },
		 	 onlyletters: function($el){
		 		 var test = /^[A-Za-z," "]+$/i.test($el.val());
		 		 if (test == false) {
			    	return "Completa este campo. Solamente puedes utilizar letras o espacios. (Max. 50)" 
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


function createDatepicker() {
	
	 $('#txtFechaNacimiento').datepicker({
		    format: 'dd/mm/yyyy',
		    endDate: '0d',
		    autoclose: true,
		    todayHighlight: true,
		    language: 'es'
	  });
}


function salir(){
	limpiarFormulario();
	$('#modal-entidad').modal('hide');
	$('body').removeClass('modal-open');
	$('.modal-backdrop').remove();
}

function limpiarFormulario(){
	$('#frmPersona')[0].reset();
	$('#frmPersona').validator('destroy').validator();
	
	//limpia campos
	$("#accion-form").val('POST');
	$("#modal-entidad-title").html('Nueva Persona');
	$("#btnProcesar").html('Guardar');
	$("#form-group-id").hide();
	$("#txtId").val("").attr('readonly', 'readonly');
	$("#txtVersion").val("").attr('readonly', 'readonly').hide();
	$("#txtNombre").val("").attr('readonly', false);
	$("#txtFechaNacimiento").val("").attr('readonly', false);
	$("#txtNroDocumento").val("").attr('readonly', false);
	$("#txtApellido").val("").attr('readonly', false);
	$("#cmbSexo").val('').attr('readonly', false);
	$("#cmbTipoDocumento").val("").attr('readonly', false);
	$("#cmbEstadoCivil").val("").attr('readonly', false);
	$("#txtIdExterno").val("").attr('readonly', false);
	$("#txtEmail").val("").attr('readonly', false);
}

	function loadCombo(){
		//combo cmbSexo
		$.ajax({
			    type: "GET",
			    url: _path + "api/personas/sexos",
				beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
			}).done( function(data){
			    for(i=0;i<data.length;i++){
				    var id =i ;
				    var descrip =data[i];
				    $('#cmbSexo').append('<option value="' + id  + '">' + descrip  + '</option>');
				}		
			});
			
		//combo cmbTipoDocumento
		$.ajax({
			    type: "GET",
			    url: _path + "api/personas/documentos/tipos",
				beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
			}).done( function(data){
			    for(i=0;i<data.length;i++){
				    var id =i ;
				    var descrip =data[i];
				    $('#cmbTipoDocumento').append('<option value="' + id  + '">' + descrip  + '</option>');
				}		
			});	

		//combo cmbTipoDocumento
		$.ajax({
			    type: "GET",
			    url: _path + "api/personas/estadosciviles",
				beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
			}).done( function(data){
			    for(i=0;i<data.length;i++){
				    var id =i ;
				    var descrip =data[i];
				    $('#cmbEstadoCivil').append('<option value="' + id  + '">' + descrip  + '</option>');
				}		
			});		
	}

	// carga y recarga de la tabla para ABM de Personas.
	function loadData(tblElement, esAbmPersona){
		tblElement.clear();
		
		var urlPersona = _path + "api/personas";
		
		if(!esAbmPersona){
			urlPersona = _path + "api/personas/sinafiliar";
		}
		
		$.ajax({
		    type: "GET",
		    url: urlPersona,
			beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	modalWaitShow();}
		})
		.done( function(data){
				personas = data.rows;
				if(!esAbmPersona){
					personas = data;
				}
		
				modalWaitHide();
			        for(i=0;i<personas.length;i++){
			        	var date = new Date(personas[i].fechaNacimiento);
			        	var fechaNacimiento=  date.getDate()+'/' + (date.getMonth()+1) + '/'+date.getFullYear();
			
			        	if(esAbmPersona){
			        
				        	tblElement.row.add([
				         		data.rows[i].id,
				         		data.rows[i].idExterno,
				         		data.rows[i].nombre,
				         		data.rows[i].apellido,
				         		data.rows[i].tipoDocumento, 
				         		data.rows[i].documento,
				         		data.rows[i].sexo,
				         		fechaNacimiento,
				         		data.rows[i].estadoCivil,
				         		'<div class="text-center">' + 
				                	'<a onclick="cargar(\''+data.rows[i].id+'\', \'PUT\')" href="#"><i class="fa fa-pencil"></i></a>' + 
				                	'    ' +
				                	'<a onclick="cargar(\''+data.rows[i].id+'\', \'DELETE\')" href="#"><i class="fa fa-trash"></i></a>' + 
				                '</div>'
				             ]);
			        	}
			        	else {
			        		
			            	tblElement.row.add([
			    		   		personas[i].id,
			    		   		personas[i].idExterno,
			    		   		personas[i].nombre,
			    		   		personas[i].apellido,
			    		   		personas[i].tipoDocumento, 
			    		   		personas[i].documento,
			    		   		personas[i].sexo,
			    		   		fechaNacimiento,
			    		   		personas[i].estadoCivil
			    			 ]);
			        	}
					}		   
			        tblElement.draw();
				})
		.fail(function(data){
			modalError("La tabla no pudo cargarse correctamente.", data)
		});
	}
	

function procesarAccion(){
	var servicio ={};
	servicio["id"] 				= $("#txtId").val();
	servicio["nombre"] 			= $("#txtNombre").val();
	servicio["apellido"] 		= $("#txtApellido").val();
	var from = $("#txtFechaNacimiento").val().split("/")
	var f = new Date(from[2], from[1] - 1, from[0])
	servicio["fechaNacimiento"]=f;
	servicio["documento"]		=$("#txtNroDocumento").val();
	servicio["version"]			= $("#txtVersion").val();	
	servicio["sexo"] 			= $("#cmbSexo").val();	
	servicio["tipoDocumento"] 	= $("#cmbTipoDocumento").val();
	servicio["estadoCivil"] 	= $("#cmbEstadoCivil").val();
	
	var id = $("#txtIdExterno").val();
	
	servicio["idExterno"] 		=id; 
	
	servicio["email"] 			= $("#txtEmail").val();

	var modo = $("#accion-form").val();
	var urlPostfijo   = '';
	if(modo=='PUT')
		urlPostfijo   = '/' + servicio["id"];
	if(modo=='DELETE')
		urlPostfijo   = '/' + servicio["id"] + '?version=' + servicio["version"];
	
	$.ajax({
	    type: modo,
	    url: _path + "api/personas" + urlPostfijo,
	    data: JSON.stringify(servicio),
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
			modalWaitShow();
		}
	}).done(function(){
		salir();
		modalSuccess("Operación realizada correctamente.");
		    
		if(esAbmPersona()){
			loadData(tabla, true);
		}
		
		if(esAbmAfiliado()){
			loadData(tablaAfiliado, false);
		}
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
		$("#btnProcesar").html('Eliminar');
		$("#txtNombre").attr('readonly', 'readonly');
		$("#txtApellido").attr('readonly', 'readonly');
		$("#cmbSexo").attr('disabled', 'disabled');
		$("#cmbTipoDocumento").attr('disabled', 'disabled');
		$("#cmbEstadoCivil").attr('disabled', 'disabled');
		$("#txtFechaNacimiento").attr('readonly', 'readonly');
		$("#txtNroDocumento").attr('readonly', 'readonly');
		$("#txtIdExterno").attr('readonly', 'readonly');
		$("#txtEmail").attr('readonly', 'readonly');

		$("#modal-entidad-title").html('Eliminar Persona');
		
		// Se quita el datapicker para la eliminación.
		$('#txtFechaNacimiento').datepicker('remove');
		//Se quitan validaciones en acción de eliminar.
		$('#frmPersona').validator('destroy');
	}
	if(accion=='PUT'){	
		$("#modal-entidad-title").html('Editar Persona');
		createValidator();
		createDatepicker();
	}
	
	$.ajax({
	    type: "GET",
	    url: _path + "api/personas/"+id,
		beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
	}).done( function(data){
		$("#accion-form").val(accion);
		$("#txtId").val(data.id);
		$("#txtVersion").val(data.version);
		$("#txtNombre").val(data.nombre);
		$("#txtApellido").val(data.apellido);
		var date = new Date(data.fechaNacimiento);
        var fechaNacimiento=  date.getDate()+'/' + (date.getMonth()+1) + '/'+date.getFullYear();		
		$("#txtFechaNacimiento").val(fechaNacimiento);		
		$("#txtNroDocumento").val(data.documento);				
		$("#txtIdExterno").val(data.idExterno);				
		$("#txtEmail").val(data.email);				
		combo_FilterByString($('#cmbSexo'), $('#cmbSexo option'), data.sexo);
		combo_FilterByString($('#cmbTipoDocumento'), $('#cmbTipoDocumento option'), data.tipoDocumento);
		combo_FilterByString($('#cmbEstadoCivil'), $('#cmbEstadoCivil option'), data.estadoCivil);
	});
	$('#modal-entidad').modal('show');	
}


function esAbmPersona() {
	if($('#tblPersonas')[0]){
		return true;
	}
	return false;
}

function esAbmAfiliado() {
	if($('#tblPersonaAfiliados')[0]){
		return true;
	}
	return false;
}

function craarTabla(tblElement, tblId, esAbmPersona) {
	
	var centerWidth = [4, 5, 6, 7, 8, 9];
	
	if(!esAbmPersona){
		centerWidth = [4, 5, 6, 7, 8];
	}
	
	tblElement = $(tblId).DataTable({
		'language'   : {'url'   : _path + 'js/plugins/datatables.es.json'},		        	
		'columnDefs' : [	{ className: 'text-left',  	'targets': [0, 1, 2, 3] }, 
							{ className: 'text-center', 'targets': centerWidth }, 
							{ 'width': '8%', 'targets': centerWidth },  
							{ "visible": false, "targets": 0 }
					   ],
	     'order'	 : [[1, 'asc']],
		    dom: 'lfrtBip',

		    buttons: [
		              {
		                  extend:    'copyHtml5',
		                  text:      '<i class="fa fa-files-o" style="color:blue;"></i>',
		                  titleAttr: 'Copiar'
		              },
		              {
		                  extend:    'excelHtml5',
		                  text:      '<i class="fa fa-file-excel-o" style="color:green;"></i>',
		                  titleAttr: 'Descargar como Excel'
		              },
		              {
		                  extend:    'csvHtml5',
		                  text:      '<i class="fa fa-file-text-o" style="color:green;"></i>',
		                  titleAttr: 'Descargar como CSV'
		              },
		              {
		                  extend:    'pdfHtml5',
		                  text:      '<i class="fa fa-file-pdf-o" style="color:red;"></i>',
		                  titleAttr: 'Descargar como PDF'
		              }
		          ]
		});
	
	
	$(tblId).on('click', 'tr', function () {
		var data = tblElement.row(this).data();
		localStorage.setItem('personaId', data[0]);	
	});
	
	return tblElement;
}

function showPersonaModal(){
	$('#modal-entidad').modal('show');
}

	
	

