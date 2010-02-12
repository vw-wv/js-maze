var Start = Start || {};

Start.standartMaze = function (str) {
	var sw = new StopWatch;
	var maze = (new Maze)
		.fromString(str)
		.mapOutput();
	var unit = (new Unit (maze))
		.toStart()
		.mapOutput();
	var cfg  = {
		angle   : 100,
		width   : 1000,
		height  : 500,
		texture : false,
		quality : 100,
		fps     : 50,
		moveFrames   : 10,
		rotateFrames : 9
	}
	var rayCast = function () {
		maze.rcRenderRays(
			unit.rcGetRays({
				angle : (90 * dirShift(unit.dir)).degree(),
				x : 0.5,
				y : 0.5
			}, cfg)
		, cfg);
	};
	rayCast();

	var arrows = {
		37 : 'left' ,
		38 : 'top'  ,
		39 : 'right',
		40 : 'bottom'
	};
	var checkFinish = function () {
		if (unit.getCell().diff.isFinish) {
			alert('Ура, пройдено за ' + sw.pause().getString() + '!');
			$_GET['code'] ? alert ("Ссылка для друзей:\n" + window.location) :
				moveTo('lab', parseInt($_GET['lab'] || 0) + 1);
		}
	}
	$
		.keyboard('[aleft|aright]', function (e) {
			sw.start();
			var dir = arrows[e[0].keyCode];
			unit.rcRotate(dir, cfg).mapOutput();
			// rayCast();
		})
		.keyboard('[aup|adown]', function (e) {
			sw.start();
			unit.move(arrows[e[0].keyCode] == "bottom").mapOutput();
			checkFinish();
			rayCast();
		})
		.keyboard('e', function () {
			moveTo('editor', maze.getCode());
		});
}