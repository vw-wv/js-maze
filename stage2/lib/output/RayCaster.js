Maze.prototype.rayCast = function (rays, count) {
	if (!$('body > .rayCast')[0]) {
		$('<div class="rayCast">').prependTo('body').css({
			'background-color' : 'black',
			'height'   : '480px',
			'width'    : '640px',
			'margin'   : '2px',
			'overflow' : 'hidden'
		});
	}
	var div = $('body > .rayCast');
	var html = '';
	var rayWidth = Math.floor(640 / count * 75) / 75;
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
	}
	div.html(html);
}