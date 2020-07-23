var tabla;
var idForm;
var servParamObj;
var form;
var fileSelect;
var uploadButton;


$(document).ready(function(){
	
		
	tabla = $("#tblLiquidacion").DataTable({
		'language'   : {'url'   : _path + 'js/plugins/datatables.es.json'},		        	
		'columnDefs' : [	{ className: 'text-left',  	'targets': [0,1,2,3,4,5,6,7] }, 
							{ className: 'text-center', 'targets': [7] }
							
					   ],
	     'order'	 : [[1, 'asc']], 
	     'columnDefs': [{ 'width': '10%', 'targets': [2] },
	                    { "visible": false, "targets": 0 }
	                   ]
	});

	tabla.clear();
	$.ajax({
	    type: "GET",
	    url: _path + "api/liquidacion?fetchs=periodo,servicio",
		beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
	}).done( function(data){

		for(i=0;i<data.rows.length;i++){
        	
			var date = new Date(data.rows[i].fechaAlta); 
        	var fechaAlta=  date.getDate()+'/' + (date.getMonth()+1) + '/'+date.getFullYear();
			
        	var liquidacion = data.rows[i];  		
        	var periodo =data.rows[i].periodo;
        	var servicio =data.rows[i].servicio;
        	
        	var date = new Date(periodo.fechaDesde); 
        	var fechaDesde=  date.getDate()+'/' + (date.getMonth()+1) + '/'+date.getFullYear();
        	
         	tabla.row.add([
         		liquidacion.id,
         		fechaDesde,
         		servicio.descripcion,
         		liquidacion.estado,
         		liquidacion.importeImputado,
         		liquidacion.importeNoImputado,
         		liquidacion.fechaConfirmacion,
         		liquidacion.notas,
         		'<div class="text-center">' + 
                	'<a href="' + _path + 'usuario/liquidacionFicha/' + liquidacion.id + '"><i class="fa fa-pencil"></i></a>' +                	                	 
                '</div>'
                ]);
		   }		   
		   tabla.draw();
	});

  	
});
