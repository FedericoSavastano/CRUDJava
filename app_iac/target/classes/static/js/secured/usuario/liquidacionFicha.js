
var endpointRest = _path + "api/liquidacion";

// Dinamico para que tome lo ultimo
function getLiquidacionId(){
	var liqcache = localStorage.getItem('liquidacionId');
	var liquidacion=localStorage.getItem('liquidacion');
	return liqcache;
}

//Suscriptores
var SUSCRIPTORES_DATA = {
		
	name: 'SUSCRIPTORES_DATA', 
	
	// Selectors/Ids
	selectedId: 'suscriptores_selected_id',
	tabId: 'tabSuscripciones',
	tableId: 'tableSuscripciones',
	modalId: 'modalSuscripcion',
	formId: 'frmSuscripcion',
	
	// API
	apiUrl: 'api/liquidacion/'+getLiquidacionId()+'/movimientos', 
	loadUrl: function (){
		return this.apiUrl;
	}, 
		
	// Grid Data
	titles: ['Id', 'Concepto', 'Importe', 'Estado', 'Cuenta del', 'Nro. Cuenta'],
	fields: ['id', 'concepto', 'importe', 'estado','movimientodel','nroCuentaCorriente' ],
	
	// Functions
	fnDraw: function(loadData){
		
		// Html de la grilla
		table_draw(this.tabId, this.tableId, this.titles);
		
		// Propiedades generales		
		var columnDefs = [	 
			{ className: 'text-center', 'targets': [4,5] },
			{ className: 'text-right', 'targets': [2] },
			{ className: 'text-left', 'targets': [1, 3] }	
			];
		var order = [[1, 'desc']]; // concepto
		
		table_create(this.tableId, this.selectedId, columnDefs, order, this.fnShowAddRow.bind(this));
		
		if (loadData){this.fnLoadData();}
	},
	
	fnLoadData: function(){
		table_load(this.tableId, this.loadUrl(), this.fields, 
				this.name + '.' + this.fnShowEditRow.name, this.name + '.' +  this.fnShowDeleteRow.name);
	}, 
	fnShowAddRow: function(){
		this.fnCleanModal();
		this.fnShowModal();
	}, 
	fnShowEditRow: function(id){
		this.fnLoadEntityData.apply(this, [id, 'PUT']);
	},
	fnShowDeleteRow: function(id){
		this.fnLoadEntityData.apply(this, [id,'DELETE']);
	},
	fnCleanModal: function(){
		
		//Resetea validaciones del formulario.
//		$("#" + this.formId)[0].reset();
//		$("#" + this.formId).validator('destroy').validator();
		
		//limpia campos
//		$("#" + this.formId + " #accion-form").val('POST').hide();
		
		
	}, 
	fnLoadEntityData: function(id, accion){	
		
		this.fnCleanModal();
		
	},
	fnValidatorCreate: function() {

		
	},
	fnLoadCombos: function(){
		//loadComboServicios();
	},
	
	fnShowModal: function(){
		$('#' + this.modalId).modal('show');
		$('#txtNotas').val($("#txtNota").val());
		$('#txtVersion').val($("#txtversion").val());
	},
	fnCloseModal: function(){
		$('#' + this.modalId).modal('hide');
	}, 
	
	fnAfterAddEditOrRemoveRow: function(){
		
	}
}



$(document).ready(function(){

	// Dibuja grillas
	SUSCRIPTORES_DATA.fnDraw(true);
	
	// Genera validadores
	SUSCRIPTORES_DATA.fnValidatorCreate.apply(SUSCRIPTORES_DATA);
	
	// Carga de combos
	SUSCRIPTORES_DATA.fnLoadCombos();
	
	$('#editarAfiliado').click(function() {
		SUSCRIPTORES_DATA.fnCleanModal();
		SUSCRIPTORES_DATA.fnShowModal();
		  
	});

	$('#eliminarAfiliado').click(function() {
		  
		confirm( "¿Está seguro que quiere dar de baja la liquidacion?." );
		  
		  var estado = $("#txtEstado").val();
		  
		  if(estado!='GENERADA'){
			  alert("No se puede eliminar una liquidación en el estado : " + estado);   
		  }else{
			eliminarLiquidacion();  
		  }		  
		  
		  
	});
	
	
	 $('.nav-tabs a[href="#' + tabSuscripciones + '"]').tab('show');

});

function table_draw(appendableControlId, tableId, titles){
	
	var tablHtml = '' +
		'<table id="' + tableId + '" class="table table-bordered table-striped" style="width: 100%;">'+
			'<thead>'+ 
		    	'<tr>';
	
	titles.forEach(function(t) {
		tablHtml+= '<th class="text-left">' + t + '</th>' 
	});
	
	tablHtml+=	    	    
		        '</tr>'+
		     '</thead>'+
		     '<tbody></tbody>'+
		     '<div id="footer-buttons"></div>'+
	     '</table>';
	
	 $('#'+appendableControlId).append(tablHtml);
}

function table_create(tableId, localStorageSelectedId, columnDefs, order, addCallback) {
	
	var dataTable = $('#' + tableId).DataTable({
		'language'   : {'url'   : _path + 'js/plugins/datatables.es.json'},		        	
		'columnDefs' : columnDefs,
	    'order'	 : order,
	    dom: 'lfrtBip',
	    buttons: [
	    	{
                text:      ' <i class="fa fa-plus" style="color:green;"></i>',
                titleAttr: 'Agregar registro',
                action: function ( e, dt, node, config ) {
                    if (addCallback!=null){addCallback();}
                }
            },
            {
                extend:    'copyHtml5',
                text:      '<i class="fa fa-files-o"></i>',
                titleAttr: 'Copiar'
            },
            {
                extend:    'excelHtml5',
                text:      '<i class="fa fa-file-excel-o"></i>',
                titleAttr: 'Descargar como Excel'
            },
            {
                extend:    'csvHtml5',
                text:      '<i class="fa fa-file-text-o"></i>',
                titleAttr: 'Descargar como CSV'
            },
            {
                extend:    'pdfHtml5',
                text:      '<i class="fa fa-file-pdf-o"</i>',
                titleAttr: 'Descargar como PDF'
            }
        ]
	});
	
	// Limpio
	localStorage.setItem(localStorageSelectedId, null);
	$('#' + tableId).on('click', 'tr', function () {
		var data = dataTable.row(this).data();
		localStorage.setItem(localStorageSelectedId, data==null? null: data[0]);
	});
	
	return dataTable;
}

function table_load(tableId, apiPath, entityFields, editCallback, deleteCallback) {
	
	var dataTable = $('#' + tableId).DataTable();
	dataTable.clear();
	   
	$.ajax({
	    type: "GET",
	    url: _path + apiPath,
		beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	modalWaitShow();}
	})
	.done( function(data){
		   modalWaitHide();
		        for(i=0;i<data.length;i++){
		        	
		        	var row = [];
		        	entityFields.forEach(function(field) {
		        		var fieldValue = locate(data, "rows["+i+"]." + field)
		        		row.push(fieldValue); 
		        	});
		        	
		        	// Acciones al final
		        	row.push(getEditDiv(data[i].id, editCallback, deleteCallback));
		        	
		        	dataTable.row.add(row);
				}		   
		        dataTable.draw();
			})
	.fail(function(data){
		modalError("La tabla no pudo cargarse correctamente.", data)
	});
}

function getEditDiv(entityId, editCallback, deleteCallback){
	var html = 
		'<div class="text-center">' + 
			(editCallback!=null? '<a onclick="javascript:' + editCallback + '(' + entityId + ');" href="#"><i class="fa fa-pencil" title="Editar"></i></a>': '') + 
			'    ' +
			(deleteCallback!=null? '<a onclick="javascript:' + deleteCallback + '(' + entityId + ');" href="#"><i class="fa fa-trash" title="Eliminar"></i></a>': '') + 
		'</div>'
			
	return html;
}

function processAddUpdateOrDelete(method, url, dataObj, successCallback){
	$.ajax({
	    type: method,
	    url: url,
	    data: JSON.stringify(dataObj),
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	
			modalWaitShow();
		}
	}).done(function(){
		successCallback();
	})
	.fail(function(data){
		modalError("La operación no pudo realizarse correctamente.", data)
	});
}
	
function locate(obj, path) {

  path = path.split('.');
  var arrayPattern = /(.+)\[(\d+)\]/;
  for (var i = 0; i < path.length; i++) {
    var match = arrayPattern.exec(path[i]);
    if (match) {
      obj = obj[parseInt(match[2])];
    } else {
    	obj = Reflect.get(obj, path[i]);
    }
  }

  return obj;
}

function eliminarLiquidacion(){
	
	var version = $("#txtversion").val();
	
	var modo = 'DELETE';
	var urlPostfijo   = '';
	if(modo=='PUT')
		urlPostfijo   = '/' + getLiquidacionId();
	if(modo=='DELETE')
		urlPostfijo   = '/' + getLiquidacionId() + '?version=' +version;
	
	$.ajax({
	    type: modo,
	    url: endpointRest + urlPostfijo,
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	
			modalWaitShow();
		}
	}).done(function(){
		modalSuccess("Operación realizada correctamente.");		
		window.location.href = _path + "usuario/liquidacion";
	})
	.fail(function(data){
		modalError("La operación no pudo realizarse correctamente.", data)
	});

	
}

function guardar(){
	
	var data ={};

	var notas = $("#txtNotas").val();
	
	data["id"] = getLiquidacionId();
	data["notas"] = notas ;
	data["version"] = $("#txtVersion").val();
	data["servicio"]        = new Object();	
	var servicioId=localStorage.getItem('servicioId');	
	data.servicio["id"] 	= servicioId;
	data["periodo"]        = new Object();
	var periodoId=localStorage.getItem('periodoId');	
	data.periodo["id"] 	= periodoId;
	
	
	var modo = "PUT";
	
	var urlPostfijo   = '';	
	urlPostfijo   = '/' + data["id"];
	
	
	
	$.ajax({
	    type: modo,
	    data: JSON.stringify(data), 
	    url: endpointRest + urlPostfijo,
	    dataTYpe: 'json',
	    contentType: 'application/json',
		beforeSend: function(xhr){
			xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	
			modalWaitShow();
		}
	}).done(function(){
		modalSuccess("Operación realizada correctamente.");		
		window.location.href = _path + "usuario/liquidacionFicha/"+getLiquidacionId();
	})
	.fail(function(data){
		modalError("La operación no pudo realizarse correctamente.", data)
	});
	
}
