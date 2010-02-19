Maze = function () {
	this.container = [];
	this.size = {
		height : 0,
		width  : 0
	};
	this.diff = {
		startCoord  : {
			x : 0,
			y : 0
		},
		finishCoord : {
			x : 0,
			y : 0
		},
		start  : null,
		finish : null
	};
	this.cfg = {
		angle   : 100,
		width   : 1200,
		height  : 500,
		texture : false,
		quality : 250,
		fps     : 50,
		moveFrames   : 6,
		rotateFrames : 7
	};
}
Maze.prototype = {
	addCell : function () {
		var y = this.container   .length - 1;
		var x = this.container[y].length;
		if (x == this.size.width) {
			throw 'MazeLineTooLong.' + y;
		} else {
			var cell = new Cell(this, x + 1, y + 1);
			this.checkCellCoords(cell);
			this.container[y].push(cell);
		}
		return cell;
	},
	checkCellCoords : function (cell) {
		var sc = this.diff.startCoord;
		var fc = this.diff.finishCoord;
		if (cell.coord.x == sc.x && cell.coord.y == sc.y) {
			cell.diff.isStart = true;
			this.diff.start   = cell;
		}
		if (cell.coord.x == fc.x && cell.coord.y == fc.y) {
			cell.diff.isFinish = true;
			this.diff.finish   = cell;
		}
	},
	getCell : function (x, y) {
		var c = this.container;
		x--; y--;
		var cell = c[y] && c[y][x] ? c[y][x] : null;
		return cell;
	},
	newLine : function () {
		var lines = this.container.length;
		var y = lines - 1;
		if (lines && this.container[y].length < this.size.width) {
			throw 'MazeLineTooShort.' + y;
		} else if (lines == this.size.height) {
			throw 'MazeTooTall';
		} else {
			this.container.push([]);
		}
	},
	complete : function () {
		if (this.container.length < this.size.height) {
			throw 'MazeTooShort';
		}
	},
	createUnit : function (x, y) {
		if (x === undefined) {
			x = this.diff.startCoord.x;
			y = this.diff.startCoord.y;
		}
		return new Unit (this, x, y);
	}
};