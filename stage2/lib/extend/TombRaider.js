var TombRaider = function (maze, x, y) {
	this.maze  = maze;
	this.dir   = 'top';
	this.cells = [];
	this.coord = {
		x : x,
		y : y
	};
}

TombRaider.prototype = new Unit;

TombRaider.prototype.next = function () {
	var cell = this.searchUnvisited();
	this.getCell().trStone = true;
	if (cell) {
		this.cells.push(this.getCell());
		this.move(cell);
		return true;
	} else {
		cell = this.cells.pop();
		if (cell) {
			this.move(cell);
		}
		return true;
	}
	return false;
}

TombRaider.prototype.searchUnvisited = function () {
	var dirs = ['top', 'right', 'bottom', 'left'];
	var cell = this.getCell();
	for (var i = 0; i < dirs.length; i++) {
		var d = dirs[i];
		if (cell.walls[d]) {
			continue;
		}
		var nb = cell.getNeighbour(d);
		if (nb && !nb.trStone) {
			return nb;
		}
	}
	return null;
}

TombRaider.prototype.highlight = function () {
	for (var i = 0; i < this.cells.length; i++ ) {
		this.cells[i].getHtmlElem().css({'background':'#eef'});
	}
}