Unit.prototype.rcRenderRays = function (rays) {
	this.rcRenderRaysTexture(rays);
	return this;
}

Unit.prototype.rcRenderRaysTexture = function (rays) {
	var cfg    = this.maze.cfg;
	var width  = cfg.width;
	var height = cfg.height;
	var strips = this.rcGetImageStrips(rays);
	var stripWidth = Math.floor(width / rays.length * 75) / 75;
	for (var i = 0; i < rays.length; i++) {
		var x = rays[i].dist;
		var L = rays[i].length;
		var stripHeight = height / L;
		var stripTop    = (height - stripHeight) / 2;
		var sw = stripHeight * stripWidth;
		var texX = -(x*sw).round()+3;
		if (texX.abs() > stripHeight * stripWidth) {
			texX += stripHeight * stripWidth;
		}
		if (texX > 0) {
			texX -= (stripHeight-1) * stripWidth;
		}

		strips[i].css({
			'top'    : stripTop,
			'height' : stripHeight,
			'background' : 'black'
		});

		strips[i].img.css({
			'height' : stripHeight,
			'width'  : stripHeight * stripWidth,
			'left'   : texX
		});
		if (!$.browser.msie) {
			var opacity = L < 0.5 ? 200 : 200/(L+0.5);
			opacity += dirShift(this.dir, rays[i].wall) % 2 ? 0 : 30;
			opacity /= 200;
			strips[i].img.css('opacity', opacity);
		}

	}
	return this;
}

Unit.prototype.rcGetScreen = function () {
	var cfg = this.maze.cfg;
	if (!this.rcScreen) {
		this.rcScreen = $('<div class="rayCast">')
			.prependTo('body')
			.css({
				'background-color' : 'black',
				'height'   : cfg.height,
				'width'    : cfg.width,
				'margin'   : 2,
				'overflow' : 'hidden',
				'position' : 'relative'
			});
	}
	return this.rcScreen;
}

Unit.prototype.rcGetImageStrips = function (rays) {
	if (!this.rcImageStrips) {
		this.rcImageStrips = [];

		var cfg    = this.maze.cfg;
		var width  = cfg.width;
		var stripWidth = Math.floor(width / rays.length * 75) / 75;

		var screen = this.rcGetScreen();

		for (var i=0; i<width; i+=stripWidth) {
			var strip = $('<div>').css({
				'position' : 'absolute',
				'left'     : i,
				'width'    : stripWidth,
				'height'   : 20,
				'overflow' : 'hidden'
			})

			var img = new Image();
			img.src = 'walls.png';
			strip.img = $(img).css({
				position : 'absolute',
				left     : 0
			}).appendTo(strip);

			this.rcImageStrips.push(strip);

			strip.appendTo(this.rcGetScreen());
		}
	}
	return this.rcImageStrips;
}

Unit.prototype.rcRenderRaysPlain = function (rays) {
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