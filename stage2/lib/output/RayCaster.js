Maze.prototype.rayCast = function (rays, cfg) {
	var width  = cfg.width;
	var height = cfg.height;

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
	var rayWidth = Math.floor(width / cfg.lines * 75) / 75;
	var k = 0;
	for (var i in rays) {
		var rayHeight = height * 0.8 / rays[i];
		var rayMarg   = (height - rayHeight) / 2;

		if (cfg.texture) {
			var opacity   = rays[i] > 10 ? 0 : (10 - rays[i]) / 10;
			var bgPos     = -rayWidth * k++;
			html += "<div" +
				" style='float:left;" +
				" margin:" + rayMarg + "px 0;" +
				" height: " + rayHeight + "px;" +
				" background: url(t.jpg) " + bgPos + "px 50% repeat;" +
				" opacity: " + opacity +  ";" +
				" width:" + rayWidth + "px;'></div>";
		} else {
			var color = Math.round(255 - (rays[i] > 10 ? 250 : rays[i] * 250 / 10)).decToHex();
			color = "#" + color + color + color;
			html += "<div" +
				" style='float:left;" +
				" margin:" + rayMarg + "px 0;" +
				" height: " + rayHeight + "px;" +
				" background: " + color + ";" +
				" width:" + rayWidth + "px;'></div>";
		}
	}
	div.html(html);
}