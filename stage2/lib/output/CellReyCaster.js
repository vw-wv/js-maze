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

Cell.prototype.rcFullRay = function (data) {
	// Этот код может показаться обфусцированным, я понимаю.
	// Но на самом деле достаточно посмотреть на рисунок
	var w, L, x; // aim
	var next, nb = null;

	var sh = dirShift('bottom', data.wall);
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
		throw 'WrongKLengthException : ' + k;
	} // - Counting w, L, x

	if (corner) {
		next = [
			dirShift (data.wall, (2 + w    )),
			dirShift (data.wall, (2 + w + 1))
		];
		if (!this.hasCorner(next[0], next[1])) {
			nb = this
				.getNeighbour(next[0])
				.getNeighbour(next[1]);
		}
	} else {
		next = dirShift (data.wall, (2 + w));
		if (!this.walls[next]) {
			nb = this.getNeighbour(next);
		}
	}

	if (nb) {
		L += nb.rcFullRay({
			wall  : dirShift(data.wall, w),
			angle : data.angle,
			size  : x
		}).length;
	}

	return {
		length : L,
		angle  : a
	};
}

Cell.prototype.rcWallRay = function (angle, dir) {
	var result = this.rcFullRay({
		wall  : dirShift(dir, 2),
		angle : angle,
		size  : 0.5
	});
	
	return result.length * result.angle.cos();
}

Cell.prototype.rcCenterRay = function (angle) {
	// todo this
	return L;
}