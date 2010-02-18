var Start = Start || {};

Start.tombRaiderMaze = function (str) {
	var maze = (new Maze)
		.fromString(str)
		.mapOutput();
	var unit = (new TombRaider (maze))
		.toStart()
	//	.mapOutput();
	// unit.getCell().diff.isFinish
	var timer;
	if (timer == 'finished') {
		return;
	}
	$
		.keyboard('e', function () {
			moveTo('editor', maze.getCode());
		});
	/* timer = setInterval(function () {
		if (!unit.next() || unit.getCell().diff.isFinish) {
			clearInterval(timer);
			unit.highlight();
		}
		unit.mapOutput();
	} , 40); */

	while (unit.next()) {
		if (unit.finish()) {
			unit.highlight();
			break;
		}
	}
}