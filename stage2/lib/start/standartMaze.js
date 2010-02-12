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
		width   : 1600,
		height  : 700,
		texture : false,
		quality : 160,
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
		40 : 'bottom',
		87 : 'w',
		83 : 's',
		65 : 'a',
		68 : 'd'
	};
	var checkFinish = function () {
		if (unit.getCell().diff.isFinish) {
			alert('Ура, пройдено за ' + sw.pause().getString() + '!');
			$_GET['code'] ? alert ("Ссылка для друзей:\n" + window.location) :
				moveTo('lab', parseInt($_GET['lab'] || 0) + 1);
		}
	}
	$
		.keyboard('[aleft|aright|a|d]', function (e) {
			sw.start();
			var dir = ['left', 'a'].has(arrows[e[0].keyCode]) ? 'left' : 'right';
			unit.rcRotate(dir, cfg).mapOutput();
			// rayCast();
		})
		.keyboard('[aup|adown|w|s]', function (e) {
			sw.start();
			unit.move(['bottom', 's'].has(arrows[e[0].keyCode])).mapOutput();
			checkFinish();
			rayCast();
		})
		.keyboard('e', function () {
			moveTo('editor', maze.getCode());
		});
}