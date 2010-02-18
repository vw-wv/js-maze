var Start = Start || {};

Start.standartMaze = function (str) {
	var sw = new StopWatch;
	var maze = (new Maze)
		.fromString(str)
		.mapOutput();
	var unit = (new Unit (maze))
		.toStart()
		.rcRenderView()
		.mapOutput();
		
	var checkFinish = function () {
		if (unit.finish()) {
			alert('Ура, пройдено за ' + sw.pause().getString() + '!');
			$_GET['code'] ? alert ("Ссылка для друзей:\n" + window.location) :
				moveTo('lab', parseInt($_GET['lab'] || 0) + 1);
		}
	}
	$
		.keyboard('[aleft|aright|a|d]', function (e) {
			sw.start();
			var dir = e[0].is('aleft', 'a') ? 'left' : 'right';
			unit
				.rcRenderRotate(dir)
				.rotate(dir)
				.mapOutput();
		})
		.keyboard('[aup|adown|w|s]', function (e) {
			sw.start();
			var back = e[0].is('adown', 's');
			unit
				.rcRenderMove(back)
				.move(back)
				.mapOutput();
			checkFinish();
		})
		.keyboard('e', function () {
			moveTo('editor', maze.getCode());
		});
}