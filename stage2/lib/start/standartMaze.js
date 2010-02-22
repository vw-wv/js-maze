var Start = Start || {};

Start.standartMaze = function (str) {
	var sw = new StopWatch;
	var maze = (new Maze).fromString(str);
	var unit = (new Unit (maze))
		.toStart();
	if (maze.cfg.engine == 'Canvas') {
		unit.canvas =  new Canvas(maze, document.getElementById('canvas'));
	}
	unit.rcRenderView();
		
	$.keyboard('[aleft|aright|a|d]', function (e) {
			sw.start();
			var dir = e[0].is('aleft', 'a') ? 'left' : 'right';
			unit
				.rcRenderRotate(dir)
				.rotate(dir);
		})
	 .keyboard('[aup|adown|w|s]', function (e) {
		sw.start();
		var back = e[0].is('adown', 's');
		unit
			.rcRenderMove(back)
			.move(back);
		if (unit.finish()) {
			unit.noticeAboutFinish(sw);
		}
	});
};