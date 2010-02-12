/* data {
 *		wall
 *		angle
 *		size
 * }
 */

Cell.prototype.hasCorner = function (dir1, dir2) {
	return (
		this.walls[dir1] ||
		this.walls[dir2] ||
		this.getNeighbour(dir1).walls[dir2] ||
		this.getNeighbour(dir2).walls[dir1]
	);
}

Cell.prototype.getCornerNeighbour = function (dir1, dir2) {
	return this.hasCorner(dir1, dir2) ? null : 
		this.getNeighbour(dir1).getNeighbour(dir2);
}

Cell.prototype.rcFullRay = function (data) {
	// Этот код может показаться обфусцированным, я понимаю.
	// Но на самом деле достаточно посмотреть на рисунок
	var w, L, x, nb = null; // aim

	var sh = (data.wall + 2) % 4;
	var a  = (data.angle - (90 * sh).degree()).degreeSingle();
	var b  = (360).degree() - a;
	var k  = data.size;
	var j  = 1 - k;
	var n = a.tan().abs();
	var corner = false;

	
	if (k < 1) { // + Counting w, L, x
		if (a.round(8) == 0) { // p1
			w = 0;
			L = 1;
			x = k;
		} else if (a < (90).degree()) { // p2, p3, p4
			if (n > k) { // p4
				w = 1;
				L = k / a.sin();
				x = k / a.tan();
			} else { // p2, p3
				corner = (n == k);
				w = 0;
				L = (1 + n*n).sqrt();
				x = corner ? 1 : k - n;
			}
		} else if (a > (270).degree()) { // p5, p6, p7
			if (n > j) { // p5
				w = 3;
				L =       j / b.sin();
				x = 1 - ( j / b.tan() );
			} else {
				corner = (n == k);
				w = corner ? 3 : 0;
				L = (1 + n*n).sqrt();
				x = corner ? 1 : k + n;
			}
		} else {
			throw 'WrongAngleException : ' + a .getDegree();
		}
	} else if (k == 1) { // p8, p9, p10
		if (a == (45).degree()) { // p9
			corner = true;
			w = 0;
			L = (2).sqrt();
			x = 1;
		} else if (a > (45).degree()) { // p10
			w = 1;
			L = 1 / a.sin();
			x = 1 / a.tan();
		} else if (a < (45).degree()) { // p8
			w = 0;
			L = 1 / a.cos();
			x = 1 - a.tan();
		} else {
			throw 'WrongCornerAngleException : ' + a .getDegree();
		}
	} else {
		throw 'Wrong_K_LengthException : ' + k;
	} // - Counting w, L, x

	nb = corner ?
		this.getCornerNeighbour(
			dirShift (data.wall + 2 + w),
			dirShift (data.wall + 3 + w)
		) : this.getNeighbour( dirShift (data.wall + 2 + w), true);

	if (nb) {
		var result = nb.rcFullRay({
			wall  : data.wall + w,
			angle : data.angle,
			size  : x
		});
		L += result.length;
	}

	return {
		length : L,
		angle  : a,
		last   : result ? result.last : this
	};
}

Cell.prototype.rcWallRay = function (data) {
	var result = this.rcFullRay({
		wall  : data.dir+2,
		angle : data.angle,
		size  : data.size
	});
	
	return {
		last   : result.last,
		length : result.length * result.angle.cos()
	};
}

Cell.prototype.rcRay = function (data) {
	// TODO : from walls
	var x, L, cell;
	var j, k, m, index, w, a, result;
	var angle = data.angle.degreeSingle().getDegree().round(8);

	var tmp =
		(angle.between(  0,  90, 'L')) ? [  data.x,   data.y, 0] :
		(angle.between( 90, 180, 'L')) ? [  data.y, 1-data.x, 1] :
		(angle.between(180, 270, 'L')) ? [1-data.x, 1-data.y, 2] :
		(angle.between(270, 360, 'L')) ? [1-data.y,   data.x, 3] : null;
	
	if (tmp) {
		j     = tmp[0];
		k     = tmp[1];
		index = tmp[2];
	} else {
		throw 'WrongRayAngleException : ' + angle;
	}
	
	a = (angle % 90).degree();
	
	x = 1 - j - k * a.tan();

	if (a == 0) {
		w = 0;
		L = k;
		x = 1 - j;
	} else {
		if (x < 0) {
		w = 1;
		L = (1-j) / a.sin();
		x = (1-k) + (1-j) / a.tan();
		} else {
			w = 0;
			L = k / a.cos();
		}
	}

	cell = this.getNeighbour(dirShift(w + index), true);
	if (cell) {
		result = cell.rcFullRay({
			wall  : w + index + 2,
			angle : data.angle,
			size  : x
		});
		L += result.length;
	}

	if (!isNaN(data.removeFish)) {
		var diff = (data.angle - data.removeFish).abs();
		L *= diff.cos();
	}

	return {
		last   : result ? result.last : this,
		length : L.round(5)
	};
}









Cell.prototype.rcRay1 = function (data) {
	var x, L, cell;
	var j, k, m, index, w, a, result;
	var angle = data.angle.degreeSingle().getDegree();

	       if (angle.between(  0,  90, 'L')) {
		j = data.x;
		k = data.y;
		index = 0;
	} else if (angle.between( 90, 180, 'L')) {
		j = data.y;
		k = 1 - data.x;
		index = 1;
	} else if (angle.between(180, 270, 'L')) {
		j = 1 - data.x;
		k = 1 - data.y;
		index = 2;
	} else if (angle.between(270, 360, 'L')) {
		j = 1 - data.y;
		k = data.x;
		index = 3;
	} else {
		throw 'WrongRayAngleException';
	}
	
	if ([0, 1].has(k, j)) {
		if ([0, 1].has(k) && [0, 1].has(j)) {
			throw 'DotInCornerException';
		} else if (k == 0 || j == 1) {
			L = 0;
			w = (j == 1) ? 1 : 0;
			x = (j == 1) ? 1 - k : 1 - j;
			cell = this.getNeighbour(
				(j == 1) ? 'right' : 'top', true
			);
		} else {
			var dir  = (j == 0) ? 'right' : 'top';
			var size = (j == 0) ? k : j;
			return (this.rcWallRay({
				dir   : dir,
				angle : data.angle,
				size  : size
			}));
		}
	} else {
		a  = data.angle.degreeSingle() % (90).degree();

		if (a == 0) {
			w = index + 2;
			L = k;
			x = 1 - j;
			cell = this.getNeighbour(dirShift(index), true);

		} else {
			m = j + k * a.tan();
			if (m > 1) {
				w = 1;
				L = (1 - j) / a.sin();
				x = (1 - k) + (1 - j)/a.tan();
				cell = this.getNeighbour(dirShift(index + 1), true);
			} else {
				L = k / a.cos();
				if (m == 1) {
					w = 2;
					x = 1;
					cell = this.getCornerNeighbour(dirShift(index), dirShift(index + 1));
				} else {
					w = 0;
					x = 1 - j - a.tan();
					cell = this.getNeighbour(dirShift(index), true);
				}
			}
		}
		result = {
			angle : a
		};
		
		if (cell) {
			result = cell.rcFullRay({
				wall  : dirShift(index + w + 2),
				angle : data.angle,
				size  : x
			});
			L += result.length;
		}
		L *= result.angle.cos();
	}
	return {
		length : L
	};
}