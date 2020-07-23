
// Dinamico para que tome lo ultimo
function getAfiliadoId(){
	return localStorage.getItem('afiliadoId');
}

// Cuentas corrientes
var CUENTA_CORRIENTE_DATA = {
	
	name: 'CUENTA_CORRIENTE_DATA',
		
	// Selectors/Ids
	selectedId: 'cuenta_corriente_selected_id',
	tabId: 'tabCuentaCorriente',
	tableId: 'tableCuentaCorriente',

	// API
	apiUrl: 'api/personas', // TODO cambiar por la api correspondiente 
	
	// Grid Data
	titles: ['Id', 'Fecha', 'Código', 'Concepto', 'Subconcepto', 'Suscripción', 'Importe', 'Acciones'],
	fields: ['id', 'fechaNacimiento', 'idExterno', 'nombre', 'apellido', 'sexo', 'estadoCivil'], // TODO cambiar por los campos correspondientes
	
	// Functions
	fnDraw: function(loadData){
		
		// Html de la grilla
		table_draw(this.tabId, this.tableId, this.titles);
		
		// Propiedades generales
		var columnDefs = [	{ className: 'text-right', 'targets': [5, 6] }, 
			{ className: 'text-center', 'targets': [1, 2, 7] }			
			];
		var order = [[1, 'desc']]; // fecha
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
	}, 
	fnLoadEntityData: function(id, accion){	
	},
	fnValidatorCreate: function() {

		var _this = this;
		
		$("#" + this.formId).validator().on('submit', function (e) {
			if (e.isDefaultPrevented()) {
				return false;
			} else if ($("#" + _this.modalId + " #btnProcesar").hasClass("disabled")){
				return false;
			} else {
				e.preventDefault(e);
				_this.fnAfterAddEditOrRemoveRow();
			}
		});
		
	},
	fnLoadCombos: function(){
	},
	
	fnShowModal: function(){
		$('#' + this.modalId).modal('show');
	},
	fnCloseModal: function(){
		$('#' + this.modalId).modal('hide');
	}, 
	
	fnAfterAddEditOrRemoveRow: function(){
	}
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
	apiUrl: 'api/suscripciones', 
	loadUrl: function (){
		return this.apiUrl + '?fetchs=servicio&filters=' + encodeURIComponent('[{"field":"afiliado.id","op":"eq","data":"' + getAfiliadoId() + '"}]') + '';
	}, 
	
	// Grid Data
	titles: ['Id', 'Nro. Suscripción', 'Servicio', 'Activo', 'Acciones'],
	fields: ['id', 'numeroSuscripcion', 'servicio.descripcion', 'activo'],
	
	// Functions
	fnDraw: function(loadData){
		
		// Html de la grilla
		table_draw(this.tabId, this.tableId, this.titles);
		
		// Propiedades generales
		var columnDefs = [	{ className: 'text-center', 'targets': [1, 3] }, 
			{ "visible": false, "targets": 0 },
			{ "render": function ( data, type, row ) {
                if ( type === 'display' ) {
                    return '<input type="checkbox" disabled="true" ' + (data? 'checked': '')  + '>';
                }
                return data;
            }, "targets": 3}
			];
		var order = [[1, 'asc']]
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
		$("#" + this.formId)[0].reset();
		$("#" + this.formId).validator('destroy').validator();
		
		//limpia campos
		$("#" + this.formId + " #accion-form").val('POST').hide();
		$("#" + this.formId + " #txtId").val("").attr('readonly', 'readonly');
		$("#" + this.modalId + " #txtVersion").val("");
		$("#" + this.modalId + " #modal-entidad-title").html('Agregar suscripción');
		$("#" + this.modalId + " #btnProcesar").html('Guardar');
		
		$("#" + this.formId + " #txtNroSuscripcion").val("").attr('readonly', false);
		$("#" + this.formId + " #cmbServicios").val("").attr('readonly', false);
		$("#" + this.formId + " #cmbServicios").val("").attr('disabled', false);
		$("#" + this.formId + " #chkActivo").prop( "checked", true );
		$("#" + this.formId + " #chkActivo").attr('disabled', false);
		
		
	}, 
	fnLoadEntityData: function(id, accion){	
		
		this.fnCleanModal();
		
		$("#" + this.modalId + "#form-group-id").show();
		$("#" + this.modalId + " #txtId").val("").attr('readonly', 'readonly').hide();
		$("#" + this.modalId + " #txtVersion").val("").attr('readonly', 'readonly').hide();

		if(accion=='DELETE'){
			$("#" + this.modalId + " #modal-entidad-title").html('Eliminar suscripción');
			$("#" + this.modalId + " #btnProcesar").html('Eliminar');
			$("#" + this.formId + " #txtNroSuscripcion").attr('readonly', 'readonly');
			$("#" + this.formId + " #cmbServicios").attr('disabled', 'disabled');
			$("#" + this.formId + " #chkActivo").attr('disabled', 'disabled');
			
			//Se quitan validaciones en acción de eliminar.
			$("#" + this.formId).validator('destroy');
					
		}else if(accion=='PUT'){	
			$("#" + this.modalId + " #modal-entidad-title").html('Editar suscripción');
			$("#" + this.modalId + " #btnProcesar").html('Guardar');

			this.fnValidatorCreate.bind(this);
		}
		
		var _this = this;
		$.ajax({
		    type: "GET",
		    url: _path + this.apiUrl + "/"+id + "?fetchs=servicio",
			beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
		}).done( function(data){
			$("#" + _this.formId + " #accion-form").val(accion);
			$("#" + _this.formId + " #txtId").val(data.id);
			$("#" + _this.formId + " #txtVersion").val(data.version);
			
			$("#" + _this.formId + " #txtNroSuscripcion").val(data.numeroSuscripcion);
			combo_FilterByValue($("#" + _this.formId + " #cmbServicios"), $('#cmbServicios option'), data.servicio.id);
			$("#" + _this.formId + " #chkActivo").prop( "checked", data.activo);
		});
		this.fnShowModal();
	},
	fnValidatorCreate: function() {

		var _this = this;
		
		$("#" + this.formId).validator().on('submit', function (e) {
			if (e.isDefaultPrevented()) {
				return false;
			} else if ($("#" + _this.modalId + " #btnProcesar").hasClass("disabled")){
				return false;
			} else {
				e.preventDefault(e);
				_this.fnAfterAddEditOrRemoveRow();
			}
		});
		
	},
	fnLoadCombos: function(){
		loadComboServicios();
	},
	
	fnShowModal: function(){
		$('#' + this.modalId).modal('show');
	},
	fnCloseModal: function(){
		$('#' + this.modalId).modal('hide');
	}, 
	
	fnAfterAddEditOrRemoveRow: function(){
		
		var data ={};
		data["id"] = $("#" + this.formId + " #txtId").val() || "";
		data["numeroSuscripcion"] = $("#" + this.formId + " #txtNroSuscripcion").val();
		data["version"] = $("#" + this.formId + " #txtVersion").val();	
		
		data["servicio"] = new Object();	
		data.servicio["id"] = $("#" + this.formId + " #cmbServicios").val();		
		
		data["afiliado"] = new Object();	
		data.afiliado["id"] = getAfiliadoId();		
		
		data["activo"] = $("#" + this.formId + " #chkActivo").prop( "checked");	

		var method = $("#" + this.formId + " #accion-form").val();
		var urlPostfijo = '';
		if (method=='PUT'){
			urlPostfijo   = '/' + data["id"];
		}else if  (method=='DELETE'){
			urlPostfijo   = '/' + data["id"] + '?version=' + data["version"];
		}

		var _this = this;
		var url = _path + this.apiUrl + urlPostfijo;
		processAddUpdateOrDelete(method, url, data,
			function(){
				_this.fnCloseModal();
				_this.fnLoadData();
				modalSuccess("Operación realizada correctamente.");
			});
	}
}

//Cuentas Bancarias
var CUENTAS_BANCARIAS_DATA = {
		
	name: 'CUENTAS_BANCARIAS_DATA',
	
	// Selectors/Ids
	selectedId: 'cuentas_bancarias_selected_id',
	tabId: 'tabCuentasBancarias',
	tableId: 'tableCuentasBancarias',
	modalId: 'modalCuenta',
	formId: 'frmCuenta',
	
	// API
	apiUrl: 'api/cuentas', 
	loadUrl: function (){
		return this.apiUrl + '?filters=' + encodeURIComponent('[{"field":"afiliado.id","op":"eq","data":"' + afiliadoId + '"}]') + '';
	}, 
	
	// Grid Data
	titles: ['Id', 'CBU', 'Acciones'],
	fields: ['id', 'cbu'],
	
	// Functions
	fnDraw: function(loadData){
		
		// Html de la grilla
		table_draw(this.tabId, this.tableId, this.titles);
		
		// Propiedades generales
		var columnDefs = [
			{ "visible": false, "targets": 0 }
			];
		var order = [[1, 'asc']]
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
		$("#" + this.formId)[0].reset();
		$("#" + this.formId).validator('destroy').validator();
		
		//limpia campos
		$("#" + this.formId + " #accion-form").val('POST').hide();
		$("#" + this.formId + " #txtId").val("").attr('readonly', 'readonly');
		$("#" + this.modalId + " #txtVersion").val("");
		$("#" + this.modalId + " #modal-entidad-title").html('Agregar cuenta');
		$("#" + this.modalId + " #btnProcesar").html('Guardar');
		
		$("#" + this.formId + " #txtCBU").val("").attr('readonly', false);
	}, 
	fnLoadEntityData: function(id, accion){	
		
		this.fnCleanModal();
		
		$("#" + this.modalId + "#form-group-id").show();
		$("#" + this.modalId + " #txtId").val("").attr('readonly', 'readonly').hide();
		$("#" + this.modalId + " #txtVersion").val("").attr('readonly', 'readonly').hide();

		if(accion=='DELETE'){
			$("#" + this.modalId + " #modal-entidad-title").html('Eliminar cuenta');
			$("#" + this.modalId + " #btnProcesar").html('Eliminar');
			$("#" + this.formId + " #txtCBU").attr('readonly', 'readonly');
			
			//Se quitan validaciones en acción de eliminar.
			$("#" + this.formId).validator('destroy');
					
		}else if(accion=='PUT'){	
			$("#" + this.modalId + " #modal-entidad-title").html('Editar cuenta');
			$("#" + this.modalId + " #btnProcesar").html('Guardar');

			this.fnValidatorCreate.bind(this);
		}
		
		var _this = this;
		$.ajax({
		    type: "GET",
		    url: _path + this.apiUrl + "/"+id,
			beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
		}).done( function(data){
			$("#" + _this.formId + " #accion-form").val(accion);
			$("#" + _this.formId + " #txtId").val(data.id);
			$("#" + _this.formId + " #txtVersion").val(data.version);
			
			$("#" + _this.formId + " #txtCBU").val(data.cbu);
		});
		this.fnShowModal();
	},
	fnValidatorCreate: function() {

		var _this = this;
		
		$("#" + this.formId).validator({
			 custom: {
				 'validatecbu': function($el) {
					if ($el.val().length != 22) {
				    	return "La longitud debe ser de 22 dígitos" 
				    }
		 			else if(isValid($el.val())){
		 				return "El CBU es inválido"
		 			}
		 		 }
		 	}
		 }).on('submit', function (e) {
			 if (e.isDefaultPrevented()) {
					return false;
				} else if ($("#" + _this.modalId + " #btnProcesar").hasClass("disabled")){
					return false;
				} else {
					e.preventDefault(e);
					_this.fnAfterAddEditOrRemoveRow();
				}
		 });	
	},
	fnLoadCombos: function(){
	},
	
	fnShowModal: function(){
		$('#' + this.modalId).modal('show');
	},
	fnCloseModal: function(){
		$('#' + this.modalId).modal('hide');
	}, 
	
	fnAfterAddEditOrRemoveRow: function(){
		var data ={};
		data["id"] = $("#" + this.formId + " #txtId").val() || "";
		data["cbu"] = $("#" + this.formId + " #txtCBU").val();
		data["version"] = $("#" + this.formId + " #txtVersion").val();	
		
		data["afiliado"] = new Object();	
		data.afiliado["id"] = getAfiliadoId();		

		var method = $("#" + this.formId + " #accion-form").val();
		var urlPostfijo = '';
		if (method=='PUT'){
			urlPostfijo   = '/' + data["id"];
		}else if  (method=='DELETE'){
			urlPostfijo   = '/' + data["id"] + '?version=' + data["version"];
		}

		var _this = this;
		var url = _path + this.apiUrl + urlPostfijo;
		processAddUpdateOrDelete(method, url, data,
			function(){
				_this.fnCloseModal();
				_this.fnLoadData();
				modalSuccess("Operación realizada correctamente.");
			});
	}
}

// Relaciones
var RELACIONES_DATA = {
		
	name: 'RELACIONES_DATA',
	
	// Selectors/Ids
	selectedId: 'relaciones_selected_id',
	tabId: 'tabRelaciones',
	tableId: 'tableRelaciones',
	modalId: 'modalRelacion',
	formId: 'frmRelacion',
	
	// API
	apiUrl: 'api/relaciones',
	loadUrl: function (){
		return this.apiUrl + '?fetchs=persona&filters=' + encodeURIComponent('[{"field":"afiliado.id","op":"eq","data":"' + afiliadoId + '"}]') + '';
	}, 
	
	// Grid Data
	titles: ['Id', 'Apellido', 'Nombre', 'Tipo de Relación', 'Nro. Afiliado', 'Acciones'],
	fields: ['id', 'persona.apellido', 'persona.nombre', 'tipoRelacionDescripcion', 'nroAfiliadoAdherente'],
	
	// Functions
	fnDraw: function(loadData){
		
		// Html de la grilla
		table_draw(this.tabId, this.tableId, this.titles);
		
		// Propiedades generales
		var columnDefs = [	
			{ "visible": false, "targets": 0 }
			];
		var order = [[4, 'asc']];
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
		$("#" + this.formId)[0].reset();
		$("#" + this.formId).validator('destroy').validator();
		
		//limpia campos
		$("#" + this.formId + " #accion-form").val('POST').hide();
		$("#" + this.formId + " #txtId").val("").attr('readonly', 'readonly');
		$("#" + this.formId + " #txtNroAdherenteInt").val("0").attr('readonly', 'readonly');
		$("#" + this.formId + " #divNroAdherente").hide();
		$("#" + this.modalId + " #txtVersion").val("");
		$("#" + this.modalId + " #modal-entidad-title").html('Agregar Relación');
		$("#" + this.modalId + " #btnProcesar").html('Guardar');
		
		$("#" + this.formId + " #txtNroAdherente").val("").attr('readonly', 'readonly').attr('disabled', 'disabled');
		$("#" + this.formId + " #cmbTipoRelaciones").val("").attr('readonly', false);
		$("#" + this.formId + " #cmbTipoRelaciones").val("").attr('disabled', false);
		$("#" + this.formId + " #cmbPersonas").val("").attr('readonly', false);
		$("#" + this.formId + " #cmbPersonas").val("").attr('disabled', false);
	}, 
	fnLoadEntityData: function(id, accion){	
		
		this.fnCleanModal();
		
		$("#" + this.modalId + "#form-group-id").show();
		$("#" + this.modalId + " #txtId").val("").attr('readonly', 'readonly').hide();
		$("#" + this.modalId + " #txtVersion").val("").attr('readonly', 'readonly').hide();
		$("#" + this.formId + " #divNroAdherente").show();
		
		if(accion=='DELETE'){
			$("#" + this.modalId + " #modal-entidad-title").html('Eliminar relación');
			$("#" + this.modalId + " #btnProcesar").html('Eliminar');
			$("#" + this.formId + " #cmbTipoRelaciones").attr('disabled', 'disabled');
			$("#" + this.formId + " #cmbPersonas").attr('disabled', 'disabled');
			
			//Se quitan validaciones en acción de eliminar.
			$("#" + this.formId).validator('destroy');
					
		}else if(accion=='PUT'){	
			$("#" + this.modalId + " #modal-entidad-title").html('Editar relación');
			$("#" + this.modalId + " #btnProcesar").html('Guardar');

			this.fnValidatorCreate.bind(this);
		}
		
		var _this = this;
		$.ajax({
		    type: "GET",
		    url: _path + this.apiUrl + "/"+id + "?fetchs=persona,afiliado",
			beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
		}).done( function(data){
			$("#" + _this.formId + " #accion-form").val(accion);
			$("#" + _this.formId + " #txtId").val(data.id);
			$("#" + _this.formId + " #txtVersion").val(data.version);
			$("#" + _this.formId + " #txtNroAdherenteInt").val(data.nroAdherente);
			
			$("#" + _this.formId + " #txtNroAdherente").val(data.nroAfiliadoAdherente);
			combo_FilterByValue($("#" + _this.formId + " #cmbTipoRelaciones"), $('#cmbTipoRelaciones option'), data.tipoRelacion);
			combo_FilterByValue($("#" + _this.formId + " #cmbPersonas"), $('#cmbPersonas option'), data.persona.id);
		});
		this.fnShowModal();
	},
	fnValidatorCreate: function() {

		var _this = this;
		
		$("#" + this.formId).validator().on('submit', function (e) {
			if (e.isDefaultPrevented()) {
				return false;
			} else if ($("#" + _this.modalId + " #btnProcesar").hasClass("disabled")){
				return false;
			} else {
				e.preventDefault(e);
				_this.fnAfterAddEditOrRemoveRow();
			}
		});
		
	},
	fnLoadCombos: function(){
		loadComboTipoRelaciones();
		loadComboPersonas();
	},
	
	fnShowModal: function(){
		$('#' + this.modalId).modal('show');
	},
	fnCloseModal: function(){
		$('#' + this.modalId).modal('hide');
	}, 
	
	fnAfterAddEditOrRemoveRow: function(){
		var data ={};
		data["id"] = $("#" + this.formId + " #txtId").val() || "";
		data["nroAdherente"] = $("#" + this.formId + " #txtNroAdherenteInt").val();
		data["version"] = $("#" + this.formId + " #txtVersion").val();	
		
		data["tipoRelacion"] = $("#" + this.formId + " #cmbTipoRelaciones").val();		
		
		data["persona"] = new Object();	
		data.persona["id"] = $("#" + this.formId + " #cmbPersonas").val();		
		
		data["afiliado"] = new Object();	
		data.afiliado["id"] = getAfiliadoId();		

		var method = $("#" + this.formId + " #accion-form").val();
		var urlPostfijo = '';
		if (method=='PUT'){
			urlPostfijo   = '/' + data["id"];
		}else if  (method=='DELETE'){
			urlPostfijo   = '/' + data["id"] + '?version=' + data["version"];
		}

		var _this = this;
		var url = _path + this.apiUrl + urlPostfijo;
		processAddUpdateOrDelete(method, url, data,
			function(){
				_this.fnCloseModal();
				_this.fnLoadData();
				modalSuccess("Operación realizada correctamente.");
			});
	}
}

$(document).ready(function(){

	// Dibuja grillas
	CUENTA_CORRIENTE_DATA.fnDraw(false);
	SUSCRIPTORES_DATA.fnDraw(true);
	CUENTAS_BANCARIAS_DATA.fnDraw(true);
	RELACIONES_DATA.fnDraw(true);
	
	// Genera validadores
	SUSCRIPTORES_DATA.fnValidatorCreate.apply(SUSCRIPTORES_DATA);
	CUENTAS_BANCARIAS_DATA.fnValidatorCreate.apply(CUENTAS_BANCARIAS_DATA);
	RELACIONES_DATA.fnValidatorCreate.apply(RELACIONES_DATA);
	
	// Carga de combos
	SUSCRIPTORES_DATA.fnLoadCombos();
	CUENTAS_BANCARIAS_DATA.fnLoadCombos();
	RELACIONES_DATA.fnLoadCombos();
	
	$('#editarAfiliado').click(function() {
		  alert("Edicion." );
		  /*
		   * Habilitar los campos de texto
		   * Hacer desaparecer los botones Editar Afiliado y Dar de Baja Afiliado
		   * Hacer aparecer los botones Aceptar y Cancelar
		   * 
		   * */
	});

	$('#eliminarAfiliado').click(function() {
		  confirm( "¿Está seguro que quiere dar de baja al afiliado?." );
		  /* TODO la baja del afiliado debería forzar a tener la cuenta corriente en CERO, 
		   * Es decir, si el afiliado tiene algún cargo, la mutual debería estar forzada a realizar una acción extra como ser 
		   * la condonación de la deuda */
	});

	$('#editarPersona').click(function() {
		  alert( "Edicion persona" );
		  /*
		   * Habilitar los campos de texto
		   * Hacer desaparecer los botones Editar Persona e Informar Defunción
		   * Hacer aparecer los botones Aceptar y Cancelar
		   * 
		   * */
	});
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
		        for(i=0;i<data.rows.length;i++){
		        	
		        	var row = [];
		        	entityFields.forEach(function(field) {
		        		var fieldValue = locate(data, "rows["+i+"]." + field)
		        		row.push(fieldValue); 
		        	});
		        	
		        	// Acciones al final
		        	row.push(getEditDiv(data.rows[i].id, editCallback, deleteCallback));
		        	
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

function loadComboServicios(){
	loadCombo(_path + "api/servicios?sidx=descripcion&sord=asc", 'cmbServicios', 'id', 'descripcion');
}	


function loadComboTipoRelaciones(){
	loadComboFromMap(_path + "api/relaciones/tipos", 'cmbTipoRelaciones');
}	

function loadComboPersonas(){
	loadCombo(_path + "api/personas", 'cmbPersonas', 'id', 'nombreApellidoDni');
}	


function loadCombo(url, comboId, idFieldName, descripFieldName){
	
	$.ajax({
	    type: "GET",
	    url: url,
		beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
	}).done( function(data){
		
		$('#' + comboId).empty();
		
		for(i=0; i<data.rows.length;i++){
		    var id = data.rows[i][idFieldName] ;
		    var descrip = data.rows[i][descripFieldName];
		    $('#' + comboId).append('<option value="' + id  + '">' + descrip  + '</option>');
		}
		
		$('#' + comboId).val("");
	});
}	

function loadComboFromArray(url, comboId){
	
	$.ajax({
		type: "GET",
		url: url,
		beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
	}).done( function(data){
		
		$('#' + comboId).empty();
		
		for(i=0; i<data.length;i++){
			var id =i ;
		    var descrip =data[i];
			$('#' + comboId).append('<option value="' + descrip  + '">' + descrip  + '</option>');
		}
		
		$('#' + comboId).val("");
	});
}	

function loadComboFromMap(url, comboId){
	
	$.ajax({
		type: "GET",
		url: url,
		beforeSend: function(xhr){xhr.setRequestHeader('X-CSRF-TOKEN', _csrf );	}
	}).done( function(data){
		
		$('#' + comboId).empty();
		
		for (var key in data){
			var id = key ;
		    var descrip =data[key];
			$('#' + comboId).append('<option value="' + key  + '">' + descrip  + '</option>');
		}
		
		$('#' + comboId).val("");
	});
}	
function locate(obj, path) {

  path = path.split('.');
  var arrayPattern = /(.+)\[(\d+)\]/;
  for (var i = 0; i < path.length; i++) {
    var match = arrayPattern.exec(path[i]);
    if (match) {
      obj = obj[match[1]][parseInt(match[2])];
    } else {
      obj = obj[path[i]];
    }
  }

  return obj;
}