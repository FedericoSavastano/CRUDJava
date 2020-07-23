var tabla;
var idForm;
var servParamObj;
var form;
var fileSelect;
var uploadButton;


$(document).ready(function(){
	
		
	tabla = $("#tblLiquidacion").DataTable({
		'language'   : {'url'   : _path + 'js/plugins/datatables.es.json'},		        	
		'columnDefs' : [	{ className: 'text-center',  	'targets': [0,1,2,3,4,5,6,7,8,9] }, 
							
					   ]
	});

	tabla.clear();
	$.ajax({
	    type: "GET",
	    url: _path + "api/presentaciones?fetchs=periodo",
		beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
	}).done( function(data){

		for(i=0;i<data.rows.length;i++){
			var p =data.rows[i]; 
			var estado=p.estado;
			
			var date = new Date(p.periodo.fechaDesde); 
        	var pdesde=  date.getDate()+'/' + (date.getMonth()+1) + '/'+date.getFullYear();

        	var date = new Date(p.periodo.fechaHasta); 
        	var phasta=  date.getDate()+'/' + (date.getMonth()+1) + '/'+date.getFullYear();
        	
        	var date = new Date(p.fechaPresentacion); 
        	var fechaPresentacion=  date.getDate()+'/' + (date.getMonth()+1) + '/'+date.getFullYear();
        	
        	var date = new Date(p.fechaRespuesta); 
			var fechaRespuesta=  date.getDate()+'/' + (date.getMonth()+1) + '/'+date.getFullYear();
        	
			var importePresentacion=p.importePresentacion ; 
			var importeAceptado=p.importeAceptado ;     
			var importeRechazado=p.importeRechazado  ;
        	
         	tabla.row.add([
         		p.id,
         		estado,
         		pdesde,
         		phasta,
         		fechaPresentacion,
         		fechaRespuesta,
         		importePresentacion,
         		importeAceptado,
         		importeRechazado,         		
         		'<div class="text-center">' + 
                	'<a href="' + _path + 'usuario/presentacionFicha/' + p.id + '"><i class="fa fa-pencil"></i></a>' +
                	'    ' +                	
                	'<a onclick="Descargar('+p.id+')" href="#"><i class="fa fa-file-text-o"></i></a>' +
                '</div>'
                ]);
		   }		   
		   tabla.draw();
	});
	
});


function Descargar (idPresentacion){
	

	$.ajax({
	    type: "GET",
	    url: _path + "api/presentaciones/downloadFile/"+idPresentacion ,	    
	    dataTYpe: 'json',
	    contentType: 'application/json',	    
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );
			modalWaitShow();
		}
	}).done(function(data){
		
		modalWaitHide();
		
		
		//modalSuccess("Operación realizada correctamente.");		
	})
	.fail(function(data){
		modalError("La operación no pudo realizarse correctamente.", data)
	});	
	
}