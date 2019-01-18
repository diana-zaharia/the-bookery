window.onload = function() {
	var el = document.getElementById('refresh');
	el.getAttribute('value') === 'yes' ? location.reload(true) : el.value = 'yes';
};
