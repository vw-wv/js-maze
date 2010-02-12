Maze.prototype.rcRenderRays = function (rays, cfg) {
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
	var rayWidth = Math.floor(width / rays.length * 75) / 75;
	var k = 0;
	for (var i = 0; i < rays.length; i++) {
		var L = rays[i].length;
		var rayHeight = height / L;
		var rayMarg   = (height - rayHeight) / 2;

		if (cfg.texture) {
			var opacity   = (L > 4 ? 1 : (5 - L))/5;
			var bgPos     = -rayWidth * k++;
			html += "<div" +
				" style='float:left;" +
				" margin:" + rayMarg + "px 0;" +
				" height: " + rayHeight + "px;" +
				" background: url(t.jpg) " + bgPos + "px 50% repeat;" +
				" opacity: " + opacity.toFixed(2) +  ";" +
				" width:" + rayWidth + "px;'></div>";
		} else {
			var color = (L < 0.5 ? 200 : 200/(L+0.5)).toColor();
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

Unit.prototype.rcRotate = function (dir, cfg) {
	var unit  = this;
	var angle = dirShift(unit.dir) * (90).degree();
	var step  = (dir == 'right' ? 1 : -1) * (90).degree() / cfg.rotateFrames;
	var frame = 1;

	if (unit.rcRotateInterval) {
		clearInterval(unit.rcRotateInterval);
	}
	var light = $.extend(cfg);
	light.quality/=2;
	unit.rcRotateInterval = setInterval(function () {
		unit.maze.rcRenderRays(unit.rcGetRays({
			angle : angle+(step*frame),
			x     : 0.5,
			y     : 0.5
		}, frame == cfg.rotateFrames ? cfg : light), cfg)
		if (++frame > cfg.rotateFrames) {
			clearInterval(unit.rcRotateInterval);
		}
	}, 1000/cfg.fps);
	unit.rotate(dir);
	return this;
}

Unit.prototype.rcGetRays = function (data, cfg) {
		var rays  = [];

		for (var i = -cfg.angle/2; i < cfg.angle/2; i+=(50/cfg.quality)) {
			rays.push(this.getCell().rcRay({
				removeFish : data.angle,
				angle : (i).degree() + data.angle,
				x     : data.x,
				y     : data.y
			}));
		}
		return rays;
}