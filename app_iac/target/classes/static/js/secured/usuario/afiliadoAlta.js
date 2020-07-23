var tabla;

$(document).ready(function(){
	
	loadComboTipoAfiliado();
		
	$('#tblPersonaAfiliados').on( 'click', 'tr', function () {		  
	        
        if ( $(this).hasClass('selected') ) {
            $(this).removeClass('selected');	             
        }
        else {
            tabla.$('tr.selected').removeClass('selected');
            $(this).addClass('selected');
        }
        
    	$('#modal-afiliado').modal('show');
    });
		
		
	$('#tblPersonaAfiliados').on('mouseover', 'tr', function () {
		 $(this).css('cursor', 'pointer');
		 $(this).addClass('selected');
	});
		
	$('#tblPersonaAfiliados').on('mouseleave', 'tr', function () {
		 $(this).removeClass('selected');	
	});
	
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
	 
	 createDatepicker();
	 createValidator();
		 
});

function createDatepicker() {

	$('#txtFechaAlta').datepicker({
	    format: 'dd/mm/yyyy',
	    endDate: '0d',
	    autoclose: true,
	    todayHighlight: true,
	    language: 'es'
	});
	
	var date = new Date();
	var day = date.getDate();
	if(day<10){
		day = '0' + day;
	}
	var month = date.getMonth()+1;
	if(month<10){
		month = '0' + month;
	}
	var year = date.getFullYear();
	var fullDate = day + '/' + month + '/' + year;
	$("#txtFechaAlta").val(fullDate);
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
		    guardarAfiliado();
		  }
	 });
	
}


function salirAfiliado(){
	
	limpiarFormulario();
	$('#modal-afiliado').modal('hide');
	$('.selected').removeClass('selected');
}


function limpiarFormulario(){
	//Resetea validaciones del formulario.
	$('#frmAfiliado')[0].reset();
	$('#frmAfiliado').validator('destroy').validator();
}


function guardarAfiliado(){

	var servicio ={};
	servicio["id"] 			= $("#txtId").val();
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
	
	var modo = 'POST';
	
	$.ajax({
	    type: modo,
	    url: _path + "api/afiliados",
	    data: JSON.stringify(servicio),
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	
			modalWaitShow();
		}
	}).done(function(){
		modalSuccess("Operación realizada correctamente.");
		$("#modal-afiliado").modal('hide');
		limpiarFormulario();		
		
		setTimeout(function(){
			window.location.href = 'afiliados.html';
		}, 1000);
		
		
	})
	.fail(function(data){
		modalError("La operación no pudo realizarse correctamente.", data)
	});
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
			