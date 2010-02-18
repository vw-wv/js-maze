function getCookie( name ) {
	var start = document.cookie.indexOf( name + '=' );
	var len = start + name.length + 1;
	if ( ( !start ) && ( name != document.cookie.
substring( 0, name.length ) ) ) {
		return null;
	}
	if ( start == -1 ) return null;
	var end = document.cookie.indexOf( ';', len );
	if ( end == -1 ) end = document.cookie.length;
	return unescape( document.cookie.substring( len, end ) );
}

function setCookie( name, value, expires, path, domain, secure ) {
	var today = new Date();
	today.setTime( today.getTime() );
	if ( expires ) {
		expires = expires * 1000 * 60 * 60 * 24;
	}
	var expires_date = new Date( today.getTime() + (expires) );
	document.cookie = name+'='+escape( value ) +
		( ( expires ) ? ';expires='
+expires_date.toGMTString() : '' ) +
//expires.toGMTString()
		( ( path ) ? ';path=' + path : '' ) +
		( ( domain ) ? ';domain=' + domain : '' ) +
		( ( secure ) ? ';secure' : '' );
}

function deleteCookie( name, path, domain ) {
	if ( getCookie( name ) ) document.cookie = name + '=' +
			( ( path ) ? ';path=' + path : '') +
			( ( domain ) ? ';domain=' + domain : '' ) +
			';expires=Thu, 01-Jan-1970 00:00:01 GMT';
}

function browser(b)
{
    var n = navigator.userAgent.toLowerCase();
    return (n.indexOf(b) > -1);
}
function $_GET(query)
{
    var url = location.search.substring(1);
    var get = url.split('&');
    for (var i = 0; i < get.length; i++)
    {
        get[i] = get[i].split('=');
        if (get[i][0] == query)
        {
            return get[i][1];
        }
    }
    return false;
}

function Hex2Bin(h, a) {
    // а - разделить, который будет ставится каждые 4 байта
    var b = '';
    h = h.toLowerCase();
    if (h.indexOf('0x') == 0) h = h.substr(2);
    h = h.split('');
    for (var i = 0; i < h.length; i++) {
        if (h[i] == '0') b += '0000';
        else if (h[i] == '1') b += '0001';
        else if (h[i] == '2') b += '0010';
        else if (h[i] == '3') b += '0011';
        else if (h[i] == '4') b += '0100';
        else if (h[i] == '5') b += '0101';
        else if (h[i] == '6') b += '0110';
        else if (h[i] == '7') b += '0111';
        else if (h[i] == '8') b += '1000';
        else if (h[i] == '9') b += '1001';
        else if (h[i] == 'a') b += '1010';
        else if (h[i] == 'b') b += '1011';
        else if (h[i] == 'c') b += '1100';
        else if (h[i] == 'd') b += '1101';
        else if (h[i] == 'e') b += '1110';
        else if (h[i] == 'f') b += '1111';
        else return false;

        if (a) b += a;
    }
    var x = false;
    while (!x)
    {
        if (b.indexOf('0') == 0) {
            b = b.substring(1);
        }
        else {
            x = true;
        }
    }
    return b;
}

function Bin2Hex(b, upper) {
    // Если Upper=true, то будет возвращено число с буквами в верхнем регистре
    var h = '', o, i;
    b = b.replace(/[^01]/g, '');
    if (b.length % 4) {
        o = b.length % 4;
        o = 4 - o;
    }
    else {
        o = 0;
    }
    for (i = 1; i <= o; i++) {
        b = '0' + b;
    }
    var a = 0, $i, $if, ba = new Array();
    for ($i = 0; $i < b.length; $i += 4) {
        $if = $i + 4;
        ba[a] = b.slice($i, $if)
        a++;
    }

    for (i = 0; i < ba.length; i++) {
        if (ba[i] == '0000') h += '0';
        else if (ba[i] == '0001') h += '1';
        else if (ba[i] == '0010') h += '2';
        else if (ba[i] == '0011') h += '3';
        else if (ba[i] == '0100') h += '4';
        else if (ba[i] == '0101') h += '5';
        else if (ba[i] == '0110') h += '6';
        else if (ba[i] == '0111') h += '7';
        else if (ba[i] == '1000') h += '8';
        else if (ba[i] == '1001') h += '9';
        else if (ba[i] == '1010') h += 'a';
        else if (ba[i] == '1011') h += 'b';
        else if (ba[i] == '1100') h += 'c';
        else if (ba[i] == '1101') h += 'd';
        else if (ba[i] == '1110') h += 'e';
        else if (ba[i] == '1111') h += 'f';
        else return false;
    }

    if (upper) h = h.toUpperCase();

    return h;
}

function isArray(x) {
    return(x.hasOwnProperty('length') && !(x instanceof String));
}

function isMap(x) {
    return(x.hasOwnProperty('isMap'));
}

function Map() {

    // Аналог класса HashMap на Java
    var $map = new Array;

    // Присвоить значение в Map.
    this.put = function(key, value) {
        var put = [key, value];
        for (var i = 0; i < $map.length; i++)
        {
            if ($map[i][0] == key) {
                $map[i][1] = value;
                return true;
            }
        }
        $map.push(put);
        return true;
    }

    // Присвоить значение в Map.
    this.putArray = function(key, value) {
        if (!isArray(key) && !isArray(value)) return false;

        for (var x = 0; x < key.length; x++)
        {
            var m = false;
            if (!value[x]) value[x] = null;
            var put = [key[x], value[x]];
            for (var i = 0; i < $map.length; i++)
            {
                if ($map[i][0] == key[x]) {
                    $map[i][1] = value[x];
                    m = true;
                }
            }
            if (!m) $map.push(put);
        }
        return true;
    }

    // Получить значение и (если del=true) удалить его
    this.get = function(key, del) {
        for (var i = 0; i < $map.length; i++)
        {
            if ($map[i][0] == key) {
                var result = $map[i][1];
                if (del) $map.splice(i, 1);
                return result;
            }
        }
        return false;
    }

    // Удалить ключ
    this.remove = function(key) {
        for (var i = 0; i < $map.length; i++)
        {
            if ($map[i][0] == key) {
                $map.splice(i, 1);
                return true;
            }
        }
        return false;
    }

    // Содержит ли данная карта такой ключ?
    this.containsKey = function(key) {
        for (var i = 0; i < $map.length; i++)
        {
            if ($map[i][0] == key) return true;
        }
        return false;
    }

    // Содержит ли данная карта такое значение?
    this.containsValue = function(value) {
        for (var i = 0; i < $map.length; i++)
        {
            if ($map[i][1] == value) return true;
        }
        return false;
    }
    
    // Вернуть понятную человеку версию карты
    this.printable = function(html) {
        var result = "", i;
        result += "Map size = " + $map.length + "\n";
        for (i = 0; i < $map.length; i++)
        {
            if (html) result += "<br/>"
            var key = $map[i][0];
            if (typeof(key) == 'object') {
                $map[i][0] = "<em>[Object]</em>"
                $map[i][1] = "<em>[Object]</em>"
            }
            else {
                $map[i][0] = $map[i][0].replace(/</g, '&#60;');
                $map[i][0] = $map[i][0].replace(/>/g, '&#62;');
                if ($map[i][1]) {
                    $map[i][1] = $map[i][1].replace(/</g, '&#60;');
                    $map[i][1] = $map[i][1].replace(/>/g, '&#62;');
                }
            }
            result += $map[i][0] + " : " + $map[i][1] + "\n";
        }
        if (html) result += "<br/>"
        return result;
    }

    // Для того, чтобы облегчить создание функции isMap
    this.isMap = function() {
        return true;
    }

    // Количество элементов в карте
    this.size = function() {
        return $map.length;
    }

    // Очистить карту
    this.clear = function() {
        $map = new Array(0);
    }
}

function StopWatch(id){
	// ID - id элемента, в котором будет отображаться секундомер. Может быть пустым
	// Start() - начать/продолжить отсчет
	// Pause() - остановить отсчет
	// Pause(Х) - остановить отсчет, но через Х секунд продолжить
	// Stop() - остановить отсчет и обнулить таймер
	// Value() - вернуть время в секундах
	// Value(true) - вернуть время в милисекундах

    var this_sw = this;
    if(id) var clock = document.getElementById(id);
    var milisec = 0, seconds = 0, minutes = 0;
    var doing = false;
    var a;
    
    this.set_time = function(){
        var time;

        if(minutes){
            time = minutes + ":" + seconds}
        else{
            var zero = "";
            time = seconds + "." + milisec + " c.";
        }
        if(id) clock.innerHTML = time;
    }

    this.go = function(){
        a = window.setTimeout(function(){ this_sw.go()},100);
        if(doing){
            if (seconds >= 59 && milisec >= 9)
            {
                seconds = 0;
                milisec = 0;
                minutes ++;
            }
            if (milisec >= 9)
            {
                milisec = 0;
                seconds ++;
            }
            else
            {
                milisec++;
            }

            this.set_time();
        }
    }

    this.start = function(){
        doing = true;
        this_sw.go();
    }

    this.pause = function(time){
		clearTimeout(a);
        doing = false;
        if(time){
            time = time*100;
            window.setTimeout(function(){ this_sw.start()},time);
        }
    }

    this.stop = function(){
		clearTimeout(a);
        doing = false;
        milisec = 0; seconds = 0; minutes = 0;
        this.set_time();
    }

    this.value = function(m){
        var time;
        time = minutes*60 + seconds;
        if(m){
            time = time*10 + milisec;
            time = time*100;
        }
        else{
            if(milisec>=5) time++;
        }
        return time;
    }
}