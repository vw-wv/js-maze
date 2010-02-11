var dirShift = function (dir, shift) {
	if (isNaN(shift)) {
		if (dir == shift) {
			return 0;
		}
		var s = 0;
		var func = arguments.callee;
		while (true) {
			if (func(dir, ++s) == shift) {
				return s;
			}
			if (s > 3) {
				return false;
			}
		}
	} else {
		shift = (shift < 0) ? 4 - (Math.abs(shift)%4) : shift%4;
		var dirs    = ['top',     'right',     'bottom',     'left'    ];
		var indexes = {'top' : 0, 'right' : 1, 'bottom' : 2, 'left' : 3};
		var index = (shift+indexes[dir]) % 4;
		return dirs[index];
	}
};

var coordsEquals = function (a, b) {
	return (a.x == b.x && a.y == b.y);
}

var moveTo = function (key, value) {
	var uri = window.location.href.split('?')[0];
	window.location = uri + '?' + key + '=' + value;
}

var $_GET = (function() {
	var uri = decodeURIComponent(location.search), result = {};

	// Если не только знак вопроса
	if (uri.length > 1) {
		// Обрезаем знак вопроса и парсим
		uri = uri.substring(1).split("&");
		for (var i in uri) {
			var temp = uri[i].split("=");
			var qnm  = temp[0];
			// Если будет запрос вида ?query=x=y& , то "query" должен вернуть "x=y";
			if (temp[1]) {
				var value = temp.splice(1, temp.length - 1).join("=");
				if (!result[qnm] || result[qnm] === true) {
					// Просто присваиваем
					result[qnm] = value;
				} else if ($.isArray(result[qnm])) {
					// Если уже есть массив с таким именем
					result[qnm].push(value);
				} else {
					// Если уже есть такой елемент
					result[qnm] = [result[qnm], value]
				}
			} else if (qnm && !result[qnm]) {
				// Если будет запрос вида ?query& , то "query" должен вернуть true;
				// if(qnm) для того, чтобы && не считалось, как $_GET[""] = true;
				// Если данная переменная уже была ранее, то просто забить
				result[qnm] = true;
			}
		}
		return result;
	} else return {};
})();

String.prototype.binToHex = function () {
	if (this.match(/[^01]/)) {
		throw 'NotBin';
	}

	var str = this;
	while (str.length % 4) {
		str = '0' + str;
	}
	
	return str.match(/.{4}/g).map(function (i) {
		return {
			'0000' : '0', '0001' : '1', '0010' : '2', '0011' : '3',
			'0100' : '4', '0101' : '5', '0110' : '6', '0111' : '7',
			'1000' : '8', '1001' : '9', '1010' : 'a', '1011' : 'b',
			'1100' : 'c', '1101' : 'd', '1110' : 'e', '1111' : 'f'
		}[i];
	}).join('');
}

String.prototype.hexToBin = function () {
	var str = this.toLowerCase();
	if (str.match(/[^0-9a-f]/)) {
		throw 'NotHex';
	}

	return str.split('').map(function (i) {
		return {
			'0' : '0000', '1' : '0001', '2' : '0010', '3' : '0011',
			'4' : '0100', '5' : '0101', '6' : '0110', '7' : '0111',
			'8' : '1000', '9' : '1001', 'a' : '1010', 'b' : '1011',
			'c' : '1100', 'd' : '1101', 'e' : '1110', 'f' : '1111'
		}[i];
	}).join('');
}

String.prototype.hexToDec = function () {
	return parseInt(this, 16);
}

String.prototype.decToHex = function () {
	return Number(this).decToHex();
}

Number.prototype.decToHex = function () {
	return this.toString(16);
}

Array.prototype.map = function (fn) {
	for (var i = 0; i < this.length; i++) {
		this[i] = fn(this[i]);
	}
	return this;
}

Math.degree = function (degree) {
	var d = Math.PI / 180;
	return (isNaN(degree)) ? d : d * degree;
}

Math.degreeSingle = function (degree) {
	degree %= this.degree(360);
	return (degree < 0) ? this.degree(360) + degree : degree;
}

Math.getDegree = function (radian) {
	return radian / Math.PI * 180;
}

Number.prototype.between = function (n1, n2, strict) {
	return (this > n1 && this < n2) ||
		(!strict && (this == n1 || this == n2));
}

Number.prototype.round = function (digits) {
	return parseFloat(this.toFixed(digits * 1));
}

// "this.toFixed is not a function" without this string
Math.abs((0).round());

(function () {
	var funcs = ['tan', 'sin', 'cos', 'abs', 'degree', 'degreeSingle', 'getDegree', 'sqrt', 'ceil', 'floor'];

	for (var i = funcs.length; i--;) {
		var f = funcs[i];
		Number.prototype[f] = (function (f) {
			return function () {
				return Math[f](this);
			}
		})(f);
	}
})();