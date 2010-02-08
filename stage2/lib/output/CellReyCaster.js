/* data {
 *		wall
 *		angle
 *		size
 * }
 */
Cell.prototype.rcFullRay = function (data) {
	var shift = dirShift("top", data.wall);
	var checkAngle = Math.degreeSingle(
		data.angle - (Math.degree(90) * shift)- Math.degree(90)
	);

	var next = null, next1, next2, dir1, dir2, size, lenght;
	var isRight = (checkAngle == Math.degree(90)); // pict 1.1
	var y = isRight ? null : data.size * Math.tan(checkAngle);

	if (isRight || Math.abs(y) > 1) { // pict 1.4
		dir1 = dirShift(data.wall, 2);
		lenght = isRight ? 1 : 1/Math.sin(checkAngle);
		if (!this.walls[dir1]) {
			next   = this.getNeighbour(dir1);
			size   = isRight ? data.size : y;
		}
	} else if (Math.abs(y) < 1) { // pict 1.2
		dir1 = dirShift(data.wall, y > 0 ? 1 : -1);
		lenght = Math.sqrt(data.size*data.size + y*y);
		if (!this.walls[dir1]) {
			next   = this.getNeighbour(dir1);
			size   = y;
		}
	} else { //  if (Math.abs(y) == 1) // pict 1.3
		dir1 = dirShift(data.wall, y > 1 ? 1 : 2);
		dir2 = dirShift(data.wall, y > 1 ? 2 : 3);
		lenght = Math.sqrt(1*1 + y*y);
		if (!this.walls[dir1] && !this.walls[dir2]) {
			next1 = this.getNeighbour(dir1);
			next2 = this.getNeighbour(dir2);
			if (!next1.walls[dir2] && !next2.walls[dir1]) {
				next = next1.getNeighbour(dir2);
			}
		}
	}
	if (next) {
		lenght += next.rcFullRay({
			wall  :dirShift(dir1, 2),
			angle : data.angle,
			size  : size
		});
	}
	return lenght;
}


Cell.prototype.rcCenterRay = function (angle) {
	var next, lenght, dir, size;
	var a = Math.degreeSingle(Math.degree(angle));
	if (!(a % Math.degree(45)) && (a % Math.degree(90))) {
		dir = [
			['top'   , 'right' ],
			['right' , 'bottom'],
			['bottom', 'left'  ],
			['left'  , 'top'   ]
		][(a - Math.degree(45)) / Math.degree(90)];
		lenght = Math.sqrt(2)/2;
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
		dir = ['top', 'right', 'bottom', 'left'][
			Math.floor((a + Math.degree(45)) / Math.degree(90)) % 4
		];
		size = 0.5 * Math.tan(a % Math.degree(45));
		lenght = Math.sqrt(0.5*0.5 + size*size);
		if (!this.walls[dir]) {
			next = this.getNeighbour(dir);
			if (a % Math.degree(90) < Math.degree(45)) {
				size += 0.5;
			}
		}
	}
	if (next) {
		lenght += next.rcFullRay({
			wall  : dirShift(dir, 2),
			angle : Math.degree(angle),
			size  : size
		});
	}
	return lenght;
}