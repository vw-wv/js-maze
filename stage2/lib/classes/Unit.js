Unit = function (maze, x, y) {
	this.maze = maze;
	this.dir  = 'top';
	this.coord = {
		x : x,
		y : y
	};
}
Unit.prototype = {
	move : function (dir) {
		var moveTo;
		if (dir instanceof Cell) {
			moveTo = dir;
		} else {
			var cell = this.getCell();
			if (typeof dir == 'string') {
				this.dir = dir;
			} else {
				dir = dir ? dirShift(this.dir, 2) : this.dir;
			}
			if (!cell.walls[dir]) {
				moveTo = cell.getNeighbour(dir);
			}
		}
		if (moveTo) {
			this.coord = moveTo.coord;
		}
		return this;
	},
	toStart : function () {
		this.move(this.maze.diff.start);
		return this;
	},
	finish : function () {
		return this.getCell().diff.isFinish;
	},
	rotate : function (dir) {
		this.dir = dirShift(this.dir, dir == 'right' ? 1 : -1);
		return this;
	},
	getCell : function () {
		return this.maze.getCell(this.coord.x, this.coord.y);
	}
}
