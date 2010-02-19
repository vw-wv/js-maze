Unit.prototype.rcCanvasRaysTexture = function (rays) {
	var unit = this;
	unit.rcCanvasRaysInit(function (images) {
		var ctx    = unit.canvas.getContext();
		var cfg    = unit.maze.cfg;
		var width  = cfg.width;
		var height = cfg.height;
		var stripWidth = getStripWidth(unit.maze, rays);

		ctx.fillStyle = "#000000";
		ctx.fillRect(0, 0, width, height);
		for (var i = 0; i < rays.length; i++) {
			var x = rays[i].dist;
			var L = rays[i].length;
			var texture = rays[i].last.diff.isStart  ? 'startWall' :
						  rays[i].last.diff.isFinish ? 'finishWall' :
										  'mainWall';
			var im = images[texture];
			var ih = iw = (height / L).round();
			var top  = ((height - ih) / 2).round();
			var texX = (x*im.width).round();

			while (texX > im.width-stripWidth) {
				texX -= im.width-stripWidth;
			}
			var texW = (stripWidth*im.width/ih).round();
			ctx.drawImage(im, texX, 0, texW, im.width, i*stripWidth, top, stripWidth, ih);
		}
	});
	return this;
};

Unit.prototype.rcCanvasRaysInit = function (fn) {
	var unit = this;
	if (unit.rcCanvasRaysImages) {
		fn(unit.rcCanvasRaysImages);
	} else {
		unit.rcCanvasLines = {};
		ImagePreloader({
			'mainWall'   : 'img/wall.png',
			'startWall'  : 'img/wall-green.png',
			'finishWall' : 'img/wall-red.png'
		}, function (images) {
			unit.rcCanvasRaysImages = images;
			fn(images);
		});
	}
};

Unit.prototype.rcCanvasRaysPlain = function (rays) {
	var unit = this;
	unit.rcCanvasRaysInit(function (images) {
		var ctx    = unit.canvas.getContext();
		var cfg    = unit.maze.cfg;
		var width  = cfg.width;
		var height = cfg.height;
		var stripWidth = getStripWidth(unit.maze, rays);
		for (var i = 0; i < rays.length; i++) {
			var L = rays[i].length;
			var last = rays[i].last;
			var color = L < 0.5 ? 200 : 200/(L+0.5);
			color += dirShift(unit.dir, rays[i].wall) % 2 ? 0 : 30;
			color  = last.diff.isStart  ? (color/2).toColor('green') :
					 last.diff.isFinish ? color.toColor('red') :
										  color.toColor();
			if (!unit.rcCanvasLines[i]) {
				unit.rcCanvasLines = {
					L : L,
					color : color
				};
			} else {
				var rcl = unit.rcCanvasLines;
				if (rcl.L == L && rcl.color == color) {
					continue;
				}
			}
			var stripHeight = height / L;
			var stripTop    = (height - stripHeight) / 2;
			ctx.fillStyle = "black";
			ctx.fillRect(i*stripWidth, 0, stripWidth, height);
			ctx.fillStyle = color;
			ctx.fillRect(i*stripWidth, stripTop, stripWidth, stripHeight);
		}
	});
	return this;
};