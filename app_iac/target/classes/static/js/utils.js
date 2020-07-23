function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}

function formatXml(xml) {
    var formatted = '';
    var reg = /(>)(<)(\/*)/g;
    xml = xml.replace(reg, '$1\r\n$2$3');
    var pad = 0;
    jQuery.each(xml.split('\r\n'), function(index, node) {
        var indent = 0;
        if (node.match( /.+<\/\w[^>]*>$/ )) {
            indent = 0;
        } else if (node.match( /^<\/\w/ )) {
            if (pad != 0) {
                pad -= 1;
            }
        } else if (node.match( /^<\w[^>]*[^\/]>.*$/ )) {
            indent = 1;
        } else {
            indent = 0;
        }

        var padding = '';
        for (var i = 0; i < pad; i++) {
            padding += '  ';
        }

        formatted += padding + node + '\r\n';
        pad += indent;
    });

    return formatted;
}

function combo_FilterByString(select, options, texto) {
	var search = $.trim(texto);
	$.each(options, function(i) {
		var option = options[i];
		if (option.text == search) {
			select.val(option.value);
		}
	});
}


function combo_FilterByValue(select, options, value) {
	var search = $.trim(value);
	$.each(options, function(i) {
		var option = options[i];
		if (option.value == search) {
			select.val(option.value);
		}
	});
}


function modalSuccess(mensaje){
	modalWaitHide();
	$("#modal-success-message").empty().text(mensaje);
	setTimeout(function() {
		$("#modal-success").modal();
	  }, 500);

}

function modalWarning(mensaje){
	modalWaitHide();
	$("#modal-warning-message").empty().text(mensaje);
	setTimeout(function() {
		$("#modal-warning").modal();
	}, 500);
}

function modalError(mensaje, data){
	modalWaitHide();
	$('#modal-error-body').empty();
	$('#modal-error-title').empty();
	if(data && data.responseJSON && data.responseJSON.error){
		var a = data.responseJSON;
		var error = a.error;
		if(error.status=="901"){
			window.location = _login_page;
		}
		if(error.business_error){
			$('#modal-error-title').append('<i class="icon fa fa-ban"></i> ERROR');
			$('#modal-error-body').append('<p id="modal-error-message">'+error.user_message+'</p>');
		} else {
			$('#modal-error-title').append('<i class="icon fa fa-ban"></i> ERROR INESPERADO');
			var subject =  error.system_id + '%20' + error.error_id;
			$('#modal-error-body').append('<p>Ha ocurrido un error inesperado. Si el problema persiste, comuníquese por mail a <a href="mailto:fenix_soporte@genomasoft.com.ar?Subject=' + subject +'" target="_top">fenix_soporte@genomasoft.com.ar</a> proporcionando los siguientes datos:</p>');
			$('#modal-error-body').append('<p>Identificador del error: <b>' + error.error_id +'</b><br /> ' +
											  'Fecha: <b>' + error.timestamp +'</b><br />' +
											  'Sistema: <b>' + error.system_id +'</b>'+
										  '</p>');
		}
	} else {
		$('#modal-error-title').append('<i class="icon fa fa-ban"></i> ERROR');
		if(mensaje==undefined || mensaje==null || mensaje=="")
			mensaje = "Ha ocurrido un error.";
		$('#modal-error-body').append('<p id="modal-error-message">'+mensaje+'</p>');
	}
	setTimeout(function() {
		$("#modal-error").modal();
	  }, 500);


}

function modalWaitShow(){
	$('#wait-modal').modal({backdrop: 'static', keyboard: false})
}

function modalWaitHide(){
	$('#wait-modal').modal('hide');
}

function getDateFromTimestamp(ts){
	var date = new Date(ts); 
	return date.getDate()+'/' + (date.getMonth()+1) + '/' + date.getFullYear();
}

function getURLParameter(sParam){
    var sPageURL = window.location.search.substring(1);
    var sURLVariables = sPageURL.split('&');
    for (var i = 0; i < sURLVariables.length; i++){
        var sParameterName = sURLVariables[i].split('=');
        if (sParameterName[0] == sParam)
            return sParameterName[1];
    }
}