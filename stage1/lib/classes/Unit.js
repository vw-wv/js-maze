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
		var cell = this.getCell();
		if (typeof dir == 'string') {
			this.dir = dir;
		} else {
			dir = dir ? dirShift(this.dir, 2) : this.dir;
		}
		if (!cell.walls[dir]) {
			this.coord = cell.getNeighbour(dir).coord;
		}
		return this;
	},
	rotate : function (dir) {
		this.dir = dirShift(this.dir, dir == 'right' ? 1 : -1);
		return this;
	},
	getCell : function () {
		return this.maze.getCell(this.coord.x, this.coord.y);
	}
}
