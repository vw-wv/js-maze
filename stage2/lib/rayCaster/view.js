Unit.prototype.rcRenderRays = function (rays) {
	var cfg    = this.maze.cfg;
	var width  = cfg.width;
	var height = cfg.height;

	if (!$('body > .rayCast')[0]) {
		$('<div class="rayCast">').prependTo('body').css({
			'background-color' : 'black',
			'height'   : height,
			'width'    : width,
			'margin'   : 2,
			'overflow' : 'hidden'
		});
	}
	var div = $('<div>');
	var rayWidth = Math.floor(width / rays.length * 75) / 75;
	for (var i = 0; i < rays.length; i++) {
		var last = rays[i].last;
		var L    = rays[i].length;
		var rayHeight = height / L;
		var rayMarg   = (height - rayHeight) / 2;

		var color = L < 0.5 ? 200 : 200/(L+0.5);
		color += dirShift(this.dir, rays[i].wall) % 2 ? 0 : 30;
		color  = last.diff.isStart  ? (color/2).toColor('green') :
		         last.diff.isFinish ? color.toColor('red') :
		                              color.toColor();
		div.append($('<div>').css({
			'background' : color,
			'float'  : 'left',
			'margin' : rayMarg + "px 0",
			'height' : rayHeight,
			'width'  : rayWidth
		}));
	}
	$('body .rayCast').empty().append(div);
	return this;
}