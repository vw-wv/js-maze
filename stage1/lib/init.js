$.keyboard({
	preventDefault : true
});

$(function () {
	var mazes = [
		"6.5.1.5.6.1 15c 958 068 a8c 880",
		"7.21.4.4.4.18 0514 2288 2aa8 2ae8 2d78 155c 0558 15c5 05a0 2268 2978 254c 2598 215c 2854 2e15 2a54 2a98 2a28 2ae8 0820",
		"18.12.2.2.17.11 055161614 b11ca1e85 8c5fa8794 a856ae51c 9d5e94c58 505a6aa1c 2a2966718 aab5aa1e8 9f85ea878 857177c5c 856555d5c 808000000",
		"24.16.4.3.22.12 155455155554 815557855558 a95581e56568 a507a5a15578 869635e55568 9a5e11551578 aa17a955a15c ab65e585e888 a5a156956aa5 96a11a55eb54 87aa6955a558 a1eaa562d5a8 a97a95a9c5e8 a55e95a555e8 955656d5557c 000200000000",
		"36.24.6.5.28.18 855585555558555560 a161d45c585d5855a8 5c755d5629587a16ac 17188557a56a1e6a95 83aa9545d5ae4daa14 a1e785855a8986aa58 a8a1e1d56aa7aaa158 7aa57855aa95e9e85c 97a55c5dea55787a15 58585e1579472a1e84 1e294a8875a1e787a0 8aa6a3a9567896d7a8 aaaa7aa7195e5e15b8 aa9d4e61c5478a855c 7a5561e5a1d5e9a555 1c55a855f855a79554 8956aa157a62955558 a53a9e5569aa57685c a1ce15556a9e95aa18 75331551ea87159aa8 164c55685e95c56aa5 873155a9565571e785 a59561e559555c95d4 8000a0002000020000"
	];
	if ($_GET['editor']) {
		mapEditor($_GET['editor']);
	} else if ($_GET['code']) {
		standartMaze($_GET['code']);
	} else {
		var index = $_GET['lab'] * 1;
		standartMaze(mazes[index] || mazes[0]);
	}
	
});

var mapEditor = function (code) {
	var maze = new Maze;
	(typeof code == 'string') ? maze.fromString(code) :
		maze.mapEditor($_GET['w'] || 8, $_GET['h'] || 6);
	maze.mapOutput().getCell(1, 1).setActive();
	var arrows = {37:'left',38:'top',39:'right',40:'bottom'};
	$
		.keyboard('(arrows)', function (e) {
			var dir = arrows[e[0].keyCode];
			var nb  = maze.diff.active.getNeighbour(dir);
			if (nb) {
				nb.setActive();
			}
		})
		.keyboard('[a|w|d|s], shift+(arrows)', function (e, bind) {
			var dir = (bind.keys.group == 1) ? arrows[e[1].keyCode] :
				{65:'left',87:'top',68:'right',83:'bottom'}[e[0].keyCode];
			maze.diff.active.changeWall(dir);
		})
		.keyboard('z', function () {
			maze.diff.active.setDiff('start');
		})
		.keyboard('x', function () {
			maze.diff.active.setDiff('finish');
		})
		.keyboard('enter', function () {
			try {
				moveTo('code', maze.getCode());
			} catch (e) {
				alert({
					'EmptyStart'  : 'Вы не указали начало',
					'EmptyFinish' : 'Вы не указали конец',
					'StartFinishEquals' : 'Начало и конец совпадают'
				}[e] || e)
			}
		});
}

var standartMaze = function (str) {
	var sw = new StopWatch;
	var maze = (new Maze)
		.fromString(str)
		.mapOutput();
	var unit = maze
		.createUnit()
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
			unit.move(e[0].keyCode == 40).mapOutput();
			checkFinish();
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