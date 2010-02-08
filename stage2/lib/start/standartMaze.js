var Start = Start || {};

Start.standartMaze = function (str) {
	var sw = new StopWatch;
	var maze = (new Maze)
		.fromString(str)
		.mapOutput();
	var unit = (new Unit (maze))
		.toStart()
		.mapOutput();
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
		})
		.keyboard('[aup|adown]', function (e) {
			sw.start();
			unit.move(arrows[e[0].keyCode] == "bottom").mapOutput();
			checkFinish();
			var c = unit.getCell();
			var testData = {};
			for (var i = 0; i < 360; i++) {
				testData[i] = c.rcCenterRay(i);
			}
			console.log(testData);
		})
		.keyboard('shift+(arrows)', function (e) {
			sw.start();
			unit.move(arrows[e[1].keyCode]).mapOutput();
			checkFinish();
		})
		.keyboard('e', function () {
			moveTo('editor', maze.getCode());
		});
}