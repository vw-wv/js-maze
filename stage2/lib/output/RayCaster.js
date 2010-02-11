Maze.prototype.rayCast = function (rays, count) {
	var width  = 768;
	var height = 480;

	if (!$('body > .rayCast')[0]) {
		$('<div class="rayCast">').prependTo('body').css({
			'background-color' : 'black',
			'height'   : height + 'px',
			'width'    : width  + 'px',
			'margin'   : '2px',
			'overflow' : 'hidden'
		});
	}
	var div = $('body > .rayCast');
	var html = '';
	var rayWidth = Math.floor(width / count * 75) / 75; /*
	for (var i in rays) {
		var rayHeight = 480 / (1 + rays[i]);
		var rayMarg   = (480 - rayHeight) / 2;
		var color = Math.round(255 - (rays[i] > 10 ? 250 : rays[i] * 250 / 10)).decToHex();
		color = "#" + color + color + color;
		html += "<div" +
			" style='float:left;" +
			" margin:" + rayMarg + "px 0;" +
			" height: " + rayHeight + "px;" +
			" background: " + color + ";" +
			" width:" + rayWidth + "px;'></div>";
	} */
	var i = 0;
	for (var i in rays) {
		var rayHeight = height * 0.8 / rays[i];
		var rayMarg   = (height - rayHeight) / 2;
		var opacity   = rays[i] > 10 ? 0 : (10 - rays[i]) / 10;
		var bgPos     = -rayWidth * i++;
		html += "<div" +
			" style='float:left;" +
			" margin:" + rayMarg + "px 0;" +
			" height: " + rayHeight + "px;" +
			" background: url(t.jpg) " + bgPos + "px 50% repeat;" +
			" opacity: " + opacity +  ";" +
			" width:" + rayWidth + "px;'></div>";
	}
	div.html(html);
}