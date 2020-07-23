
$(document).ready(function(){
	
	$('#selectVehiculos').empty()
	cargarSelectVehiculos();
	cargarVehiculosTabla();
});

function guardarVehiculo(){
	var patente = $("#patente").val();
	var modelo = $("#modelo").val();
	
	var vehiculo ={};
		
	vehiculo["id"] 				= '';
	vehiculo["patente"] 			= patente;
	vehiculo["modelo"] 	= modelo;	
	vehiculo["version"]			= '';	
		
	$.ajax({
	    type: 'POST',
	    url: _path + "api/vehiculos",
	    data: JSON.stringify(vehiculo),
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
			modalWaitShow();
		}
	}).done(function(){
	
		 $("#patente").val('');
		 $("#modelo").val('');
		
			$('#selectVehiculos').empty()
			cargarSelectVehiculos();
			cargarVehiculosTabla();
		modalSuccess("Operación realizada correctamente.");
				    
		 	
	})
	.fail(function(data){
		modalError("La operación no pudo realizarse correctamente.", data)
	});
}


function cargarSelectVehiculos(){
	
	var selector = "selector";
	
	$.ajax({
	    type: 'GET',
	    url: _path + "api/vehiculos",
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
			modalWaitShow();
		}
	}).done(function(listaVehiculos){
	
		modalWaitHide();
		$("#selectVehiculos").val('');
	$('#selectVehiculos').val("Elegir").append('<option version=' + selector +   ' value=' + selector +   '>' +   ' Elegir uno '   + 
    '</option>');
		
		//recorriendo todos los articulos
		 listaVehiculos.rows.forEach(function(veh){
             //y los agrego al selector
             $('#selectVehiculos').append('<option version=' + veh.version +   ' value=' + veh.id +   '>' + veh.patente +    ' - ' +   veh.modelo + 
                '</option>');
                
            });
				    
		 	
	})
	.fail(function(data){
		modalWaitHide();
		modalError("La operación no pudo realizarse correctamente.", data)
	});
	
}


function cargar(){
	
	var id = $('option:selected', $('#selectVehiculos')).attr('value');
	console.log("en cargar" , id);
	if(id!="selector"){
	
	$.ajax({
	    type: 'GET',
	    url: _path + "api/vehiculos/" + id,
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
			modalWaitShow();
		}
	}).done(function(vehiculo){
	
		modalWaitHide();
		
		
		
		 $("#patente_edit").val(vehiculo.patente);
		 $("#modelo_edit").val(vehiculo.modelo);
		
		
		 	
	})
	.fail(function(data){
		modalWaitHide();
		modalError("La operación no pudo realizarse correctamente.", data)
	});

	}else{
		$("#patente_edit").val("Elija uno de la lista");
		 $("#modelo_edit").val("Elija uno de la lista");
	}

	
}


function actualizarVehiculo() {
	
	var patente = $("#patente_edit").val();
	var modelo = $("#modelo_edit").val();
	var id = $('option:selected', $('#selectVehiculos')).attr('value');
	var version = $('option:selected', $('#selectVehiculos')).attr('version');
	 
	var vehiculo ={};
		
	vehiculo["id"] 				= id;
	vehiculo["patente"] 			= patente;
	vehiculo["modelo"] 	= modelo;	
	vehiculo["version"]			= version;	
		
	$.ajax({
	    type: 'PUT',
	    url: _path + "api/vehiculos/" + id,
	    data: JSON.stringify(vehiculo),
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
			modalWaitShow();
		}
	}).done(function(){
		 
		 $("#patente_edit").val('');
		 $("#modelo_edit").val('');
		
		 $('#selectVehiculos').empty()
			cargarSelectVehiculos();
		 cargarVehiculosTabla();
		modalSuccess("Operación realizada correctamente.");
		 
		 	
	})
	.fail(function(data){
		modalWaitHide();
		modalError("La operación no pudo realizarse correctamente.", data)
		
	});
}

function borrarVehiculo(){
	
	var id = $('option:selected', $('#selectVehiculos')).attr('value');
	var version = $('option:selected', $('#selectVehiculos')).attr('version');
	 
	
	$.ajax({
		
		type: 'DELETE',
	    url: _path + "api/vehiculos/" + id + "?version=" + version,
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
			modalWaitShow();
		}
	}).done(function(){
		 
		 $("#patente_edit").val('');
		 $("#modelo_edit").val('');
		
		 $('#selectVehiculos').empty()
			cargarSelectVehiculos();
		 cargarVehiculosTabla();
		modalSuccess("Operación realizada correctamente.");
		 
		 	
	})
	.fail(function(data){
		modalWaitHide();
		modalError("La operación no pudo realizarse correctamente.", data)
		
	});
	
}




//AGREGADOS NUEVOS






function cargarVehiculosTabla(){
	
	var selector = "selector";
		
		$.ajax({
		    type: 'GET',
		    url: _path + "api/vehiculos",
		    dataTYpe: 'json',
		    contentType: 'application/json',
			beforeSend: function(xhr){
				xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
				modalWaitShow();
			}
		}).done(function(listaVehiculos){
		
			modalWaitHide();
			$('#tablabody').empty();
			//recorriendo todos los articulos
			 listaVehiculos.rows.forEach(function(veh){
	             //y los agrego al selector
				 
	             $('#tablabody').append(' <tr> <th scope="row" version=' + veh.version +   ' >1</th> <td> ' + veh.id + ' </td> <td> ' + veh.patente + ' </td> <td> ' + veh.modelo + ' </td> </tr>');
	                
	            });
					    
			 	
			 
			 
		})
		.fail(function(data){
			modalWaitHide();
			modalError("La operación no pudo realizarse correctamente.", data)
		});
		
	}



