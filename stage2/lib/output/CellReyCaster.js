/* data {
 *		wall
 *		angle
 *		size
 * }
 */

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
			dirShift (data.wall, (2 + w + 1)),
		];
		if (!this.walls[next[0]] && !this.walls[next[1]]) {
			nb = [
				this.getNeighbour(next[0]),
				this.getNeighbour(next[1])
			];
			if (!nb[0].walls[next[1]] && !nb[1].walls[next[0]]) {
				nb = nb[0].getNeighbour(next[1]);
			}
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
		});
	}

	return L;
}

Cell.prototype.rcWallRay = function (dir, angle) {
	var sh = dirShift('top', dir);
	var a = (angle - (90 * sh).degree()).degreeSingle();
	
	return this.rcFullRay({
		wall  : dirShift(dir, 2),
		angle : angle,
		size  : 0.5
	}) * a.cos();
}

Cell.prototype.rcCenterRay = function (angle) {
	var next, length, dir, size;
	var a = angle.degreeSingle();
	if (!(a % (45).degree()) && (a % (90).degree())) {
		dir = [
			['top'   , 'right' ],
			['right' , 'bottom'],
			['bottom', 'left'  ],
			['left'  , 'top'   ]
		][(a - (45).degree()) / (90).degree()];
		length = (2).sqrt()/2;
		if (!this.walls[dir[0]] && !this.walls[dir[1]]) {
			var next1 = this.getNeighbour(dir[1]);
			var next2 = this.getNeighbour(dir[0]);
			if (!next1.walls[dir[0]] && !next2.walls[dir[1]]) {
				next = next1.getNeighbour(dir[1]);
				dir  = dir[0];
				size = 0;
			}
		}
	} else {
		var shift = Math.floor((a + (45).degree()) / (90).degree()) % 4;
		dir = ['top', 'right', 'bottom', 'left'][shift];
		var curA = a % Math.degree(90);
		if (curA > (45).degree()) {
			size = 0.5 * ((90).degree() - curA).tan();
		} else {
			size = 0.5 * curA.tan();
		}
		length = (0.5*0.5 + size*size).sqrt();
		if (!this.walls[dir]) {
			next = this.getNeighbour(dir);
			if (a % (90).degree() < (45).degree()) {
				size += 0.5;
			}
		}
	}
	if (next) {
		length += next.rcFullRay({
			wall  : dirShift(dir, 2),
			angle : angle,
			size  : size
		});
	}


	var sh = dirShift('top', dir);
	a = (angle - (90 * sh).degree()).degreeSingle();

	return length * a.cos();
}