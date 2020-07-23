
$(document).ready(function(){
	cargarInsumosTabla();
	cargarSelectInsumos();
	
});


 


function guardarInsumo(){
	
	var marca = $("#marca").val();
	var producto = $("#producto").val();
	var cantidad = $("#cantidad").val();
	var observacion = $("#observacion").val();
	
	
	var insumo ={};
		
	insumo["id"] 				= '';
	insumo["marca"] 			= marca;
	insumo["producto"] 	= producto;	
	insumo["cantidad"] 	= cantidad;	
	insumo["observacion"] 	= observacion;	
	insumo["version"]			= '';	
		
	$.ajax({
	    type: 'POST',
	    url: _path + "api/insumos",
	    data: JSON.stringify(insumo),
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
			modalWaitShow();
		}
	}).done(function(){
	
		 $("#marca").val('');
		 $("#producto").val('');
		 $("#cantidad").val('');
		 $("#observacion").val('');
		 
		 vaciarSelector();
		 cargarInsumosTabla();
		 cargarSelectInsumos();
		modalSuccess("Operación realizada correctamente.");
				    
		 	
	})
	.fail(function(data){
		modalError("La operación no pudo realizarse correctamente.", data)
	});
}




function cargarInsumosTabla(){
	
	 
	
	$.ajax({
	    type: 'GET',
	    url: _path + "api/insumos",
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
			modalWaitShow();
		}
	}).done(function(listaInsumos){
	
		modalWaitHide();
		$('#tablabodyinsumos').empty();
		//recorriendo todos los articulos
		listaInsumos.rows.forEach(function(insu){
             //y los agrego al selector
			 
             $('#tablabodyinsumos').append(' <tr> <th scope="row" version=' + insu.version +   ' > </th> <td> ' + insu.id + ' </td> <td> ' + insu.marca + ' </td> <td> ' + insu.producto + ' </td> <td> ' + insu.cantidad + ' </td> <td> ' + insu.observacion + ' </td> </tr>');
                
            });
				    
		 	
		 
		 
	})
	.fail(function(data){
		modalWaitHide();
		modalError("La operación no pudo realizarse correctamente.", data)
	});
	
}








function cargarSelectInsumos(){
	
	var selector = "selector";
	
	$.ajax({
	    type: 'GET',
	    url: _path + "api/insumos",
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
			modalWaitShow();
		}
	}).done(function(listaInsumos){
	
		modalWaitHide();
		$(".selectInsumos").val('');
	$('.selectInsumos').val("Elegir").append('<option version=' + selector +   ' value=' + selector +   '>' +   ' Elegir uno '   + 
    '</option>');
		
		//recorriendo todos los articulos
	listaInsumos.rows.forEach(function(insu){
             //y los agrego al selector
             $('.selectInsumos').append('<option version=' + insu.version +   ' value=' + insu.id +   '>' + insu.marca +    ' - ' +   insu.producto +
                '</option>');
                
            });
				    
		 	
	})
	.fail(function(data){
		modalWaitHide();
		modalError("La operación no pudo realizarse correctamente.", data)
	});
	
}


function cargar(){
	
	var id = $('option:selected', $('.selectInsumos')).attr('value');
	console.log("en cargar" , id);
	if(id!="selector"){
	
	$.ajax({
	    type: 'GET',
	    url: _path + "api/insumos/" + id,
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
			modalWaitShow();
		}
	}).done(function(insumo){
	
		modalWaitHide();
		
		
		
		 $("#marca_edit").val(insumo.marca);
		 $("#producto_edit").val(insumo.producto);
		 $("#cantidad_edit").val(insumo.cantidad);
		 $("#observacion_edit").val(insumo.observacion);
		
		
		 	
	})
	.fail(function(data){
		modalWaitHide();
		modalError("La operación no pudo realizarse correctamente.", data)
	});

	}else{
		$("#marca_edit").val("Elija uno de la lista");
		 $("#producto_edit").val("Elija uno de la lista");
	}

	
}


function actualizarInsumo() {
	
	

	var marca = $("#marca_edit").val();
	var producto = $("#producto_edit").val();
	var cantidad = $("#cantidad_edit").val();
	var observacion = $("#observacion_edit").val();
	 
	var id = $('option:selected', $('#selectmodif')).attr('value');
	var version = $('option:selected', $('#selectmodif')).attr('version');
	 
	
	var insumo ={};
		
	insumo["id"] 				= id;
	insumo["marca"] 			= marca;
	insumo["producto"] 	= producto;	
	insumo["cantidad"] 	= cantidad;	
	insumo["observacion"] 	= observacion;	
	insumo["version"]			= version;	
		
	$.ajax({
	    type: 'PUT',
	    url: _path + "api/insumos/" + id,
	    data: JSON.stringify(insumo),
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
			modalWaitShow();
		}
	}).done(function(){
		 
		 
		 $("#marca_edit").val('');
			 $("#producto_edit").val('');
			  $("#cantidad_edit").val('');
			 $("#observacion_edit").val('');
		 
		
			 vaciarSelector();
			cargarSelectInsumos();
		 cargarInsumosTabla();
		modalSuccess("Operación realizada correctamente.");
		 
		 	
	})
	.fail(function(data){
		modalWaitHide();
		modalError("La operación no pudo realizarse correctamente.", data)
		
	});
}


function borrarInsumo(){
	
	var id = $('option:selected', $('#selectborrar')).attr('value');
	var version = $('option:selected', $('#selectborrar')).attr('version');
	 
	
	$.ajax({
		
		type: 'DELETE',
	    url: _path + "api/insumos/" + id + "?version=" + version,
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
			modalWaitShow();
		}
	}).done(function(){
		 
		 
	 
	
		vaciarSelector();
		cargarSelectInsumos();
	 cargarInsumosTabla();
		modalSuccess("Operación realizada correctamente.");
		 
		 	
	})
	.fail(function(data){
		modalWaitHide();
		modalError("La operación no pudo realizarse correctamente.", data)
		
	});
	
}



function vaciarSelector(){
	 $('.selectInsumos').empty();
	 $('#selectborrar').empty();
	 $('#selectmodif').empty();
	  
	
}












