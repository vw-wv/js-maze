Cell = function (maze, x, y) {
	this.maze = maze,
	this.coord = {
		x : x,
		y : y
	};
	this.walls = {
		top    : false,
		right  : false,
		bottom : false,
		left   : false
	};
	this.diff = {
		isStart  : false,
		isFinish : false
	};
};
Cell.prototype = {
	isExtreme : function (dir) {
		var isExtreme =
			dir == 'top'    ? this.coord.y == 1 :
			dir == 'right'  ? this.coord.x == this.maze.size.width :
			dir == 'bottom' ? this.coord.y == this.maze.size.height :
			dir == 'left'   ? this.coord.x == 1 :
				null;
		if (isExtreme === null) {
			throw 'UnknownDir'
		} else {
			return isExtreme;
		}
	},
	getNeighbour : function (dir, checkWall) {
		if (this.isExtreme(dir)) {
			return null
		}
		var x = this.coord.x, y = this.coord.y;
		dir == 'top'    ? y-- :
		dir == 'right'  ? x++ :
		dir == 'bottom' ? y++ :
		dir == 'left'   ? x-- :
			null;
		return this.maze.getCell(x, y);
	},
	setWall : function (dir, value) {
		this.walls[dir] = this.isExtreme(dir) ? true : value;
		return this;
	}
}