var Start = Start || {};

Start.standartMaze = function (str) {
	var sw = new StopWatch;
	var maze = (new Maze)
		.fromString(str)
		.mapOutput();

	var unit = (new Unit (maze))
		.toStart()
		.mapOutput();
	var rayCast = function () {
		var shift = 90 * dirShift('top', unit.dir);
		var cell  = unit.getCell();
		var rays  = {};
		for (var i = -30, c = 0; i <= 30; i+=1, c++) {
			rays[i] = cell.rcWallRay(unit.dir, (i + shift).degree());
		}
		maze.rayCast(rays, c);
	}
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
			unit.rotate(dir).mapOutput();
			rayCast();
		})
		.keyboard('[aup|adown]', function (e) {
			sw.start();
			unit.move(arrows[e[0].keyCode] == "bottom").mapOutput();
			checkFinish();
			rayCast();
		})
		.keyboard('shift+(arrows)', function (e) {
			sw.start();
			unit.move(arrows[e[1].keyCode]).mapOutput();
			checkFinish();
			rayCast();
		})
		.keyboard('e', function () {
			moveTo('editor', maze.getCode());
		});
}