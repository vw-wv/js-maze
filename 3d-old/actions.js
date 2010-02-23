var $lab_code = new Array(
        "1,5,6,1,6,5 15c 958 068 a8c 880",
        "4,4,4,18,7,21 0514 2288 2aa8 2ae8 2d78 155c 0558 15c5 05a0 2268 2978 254c 2598 215c 2854 2e15 2a54 2a98 2a28 2ae8 0820",
        "2,2,17,11,18,12 055161614 b11ca1e85 8c5fa8794 a856ae51c 9d5e94c58 505a6aa1c 2a2966718 aab5aa1e8 9f85ea878 857177c5c 856555d5c 808000000",
        "4,3,22,12,24,16 155455155554 815557855558 a95581e56568 a507a5a15578 869635e55568 9a5e11551578 aa17a955a15c ab65e585e888 a5a156956aa5 96a11a55eb54 87aa6955a558 a1eaa562d5a8 a97a95a9c5e8 a55e95a555e8 955656d5557c 000200000000",
        "6,5,28,18,36,24 855585555558555560 a161d45c585d5855a8 5c755d5629587a16ac 17188557a56a1e6a95 83aa9545d5ae4daa14 a1e785855a8986aa58 a8a1e1d56aa7aaa158 7aa57855aa95e9e85c 97a55c5dea55787a15 58585e1579472a1e84 1e294a8875a1e787a0 8aa6a3a9567896d7a8 aaaa7aa7195e5e15b8 aa9d4e61c5478a855c 7a5561e5a1d5e9a555 1c55a855f855a79554 8956aa157a62955558 a53a9e5569aa57685c a1ce15556a9e95aa18 75331551ea87159aa8 164c55685e95c56aa5 873155a9565571e785 a59561e559555c95d4 8000a0002000020000"
        );

var allImageUrls = ["imgs/far_center1.jpg", "imgs/far_far_center0.jpg", "imgs/far_far_center1.jpg", "imgs/far_far_left0.jpg", "imgs/far_far_left1.jpg", "imgs/far_far_right0.jpg", "imgs/far_far_right1.jpg", "imgs/far_left0.jpg", "imgs/far_left1.jpg", "imgs/far_left2.jpg", "imgs/far_right0.jpg", "imgs/far_right1.jpg", "imgs/far_right2.jpg", "imgs/floor.jpg", "imgs/left0.jpg", "imgs/left1.jpg", "imgs/middle1.jpg", "imgs/right0.jpg", "imgs/right1.jpg", "imgs/roof.jpg", "imgs/navigator/compass.png", "imgs/navigator/directions.png", "imgs/navigator/navigator.png"];
var allImageObjects = [];
for (var iKey in allImageUrls) {
	var image = new Image;
	image.src = allImageUrls[iKey];
	allImageObjects.push(image);
}

var $cage = new Map();
var menu_opened = false;
var menu = new Menu();
var keyboard = new Keyboard();
var pip_boy = new Navigator();
keyboard.set_first();
var lab_num;
var cheater = false;

var move_left;
var move_front;
var move_right;
var move_back;
var map_open;
var menu_open;
var put_paw;

if ($_GET('a')) lab_num = $_GET('a');
else lab_num = 0;

var $lab = new Labyrinth($lab_code[lab_num]);
var player1 = new player();

function return_arrow(a)
{
    if (a == 1) return 'u';
    if (a == 2) return 'r';
    if (a == 3) return 'd';
    if (a == 4) return 'l';
    return false;
}

function parse_lab(lab_code) {
    lab_code = lab_code.split(" ");
    var lab = lab_code[0].split(",");

    if (lab.length != 6) return false;

    for (var a = 0; a < 6; a++) {
        if (lab[a] < 1) lab[a] = 1;
        else if (lab[a] > 99) lab[a] = 99;
        else lab[a] = parseInt(lab[a])
    }

    var lab_start = lab[0] + "." + lab[1];
    var lab_finish = lab[2] + "." + lab[3];

    var lab_width = parseInt(lab[4]);
    var lab_height = parseInt(lab[5]);

    return [lab_start, lab_finish, lab_width, lab_height];
}

function Labyrinth(lab_code)
{
    var data = parse_lab(lab_code);

    // Вернуть значение определенной переменной
    this.value = function(a) {
        if (a == 'start') return data[0];
        else if (a == 'finish') return data[1];
        else if (a == 'width') return data[2];
        else if (a == 'height') return data[3];
        else if (a == 'code') return lab_code;
        else return data;
    }
}

function gen_cages()
{
    var lab_code = $lab_code[lab_num];
    lab_code = lab_code.split(" ");
    var y, lab_height = $lab.value('height');
    var x, lab_width = $lab.value('width');
    var start = $lab.value('start');
    var finish = $lab.value('finish');
    var top_wall, right_wall, bottom_wall, left_wall;
    var wall, wb, wr, coord, prev_coord, cage_class, values;

    for (y = 1; y <= lab_height; y++)
    {
        var sc = Hex2Bin(lab_code[y]);
        while (sc.length < lab_width * 2) sc = "0" + sc;
        sc = sc.split("");
        for (x = 1; x <= lab_width; x++)
        {
            coord = x + '.' + y;

            wb = x * 2 - 1;
            wr = wb - 1;

            if (x == 1) left_wall = 1;
            else {
                prev_coord = (x - 1) + "." + y;
                wall = $cage.get(prev_coord);
                left_wall = wall[2];
            }

            if (y == 1) top_wall = 1;
            else {
                prev_coord = x + "." + (y - 1);
                wall = $cage.get(prev_coord);
                top_wall = wall[3];
            }

            if (x == lab_width) right_wall = 1;
            else right_wall = parseInt(sc[wr]);

            if (y == lab_height) bottom_wall = 1;
            else bottom_wall = parseInt(sc[wb]);

            if (coord == start) cage_class = 'start';
            else if (coord == finish) cage_class = 'finish';
            else cage_class = null;

            var steps = 0;
            var paw = false;

            values = [cage_class, top_wall, right_wall, bottom_wall, left_wall, steps, paw];
            $cage.put(coord, values);
        }
    }
}

function border_value(b)
{
    if (b == 1) return " #000";
    else return " #fff";
}

function gen_lab()
{
    var y, lab_height = $lab.value('height');
    var x, lab_width = $lab.value('width');
    var html = "<table class='lab'>";
    for (y = 1; y <= lab_height; y++)
    {
        html += "<tr>";
        for (x = 1; x <= lab_width; x++)
        {
            var coord, value, border, className = "";
            coord = x + '.' + y;
            value = $cage.get(coord);
            if (value[0]) className = " class='" + value[0] + "'";
            border = border_value(value[1]) + border_value(value[2]) + border_value(value[3]) + border_value(value[4]);
            html += "<td><div id='c." + coord + "' style='border-color:" + border + "'" + className + "></div></td>"
        }
        html += "</tr>";
    }
    html += "</table>";
    document.getElementById('all').innerHTML = html;
    return true;
}

function Navigator(){
    var screen1 = document.getElementById('screen1');
    var screen2 = document.getElementById('screen2');
    var screen3 = document.getElementById('screen3');
    var navigator_arrow = document.getElementById('navigator_arrow');

    this.count_hypotenuse_distance = function(){
        var cur_loc = player1.location();
        var end_loc = $lab.value('finish');
        end_loc = end_loc.split('.');
        var y = (end_loc[1] - cur_loc[1]);
        var x = (end_loc[0] - cur_loc[0]);
        var distance =  Math.sqrt((x*x)+(y*y));
        distance = distance.toFixed(4);
        screen2.innerHTML = distance;
        return true;
    }

    this.count_cathetus_distance = function(){
        var cur_loc = player1.location();
        var end_loc = $lab.value('finish');
        end_loc = end_loc.split('.');
        var y = (end_loc[1] - cur_loc[1]);
        var x = (end_loc[0] - cur_loc[0]);
        if(x<0) x *= -1;
        if(y<0) y *= -1;
        screen1.innerHTML = "X:" + x + " Y:" + y;
        return true;
    }

    this.count_corner_degree = function(){
        var dir = player1.location(true);
        var cur_loc = player1.location();
        var end_loc = $lab.value('finish');
        end_loc = end_loc.split('.');
        var y = (end_loc[1] - cur_loc[1]);
        var x = (end_loc[0] - cur_loc[0]);
        if(x && y){
            if(x<0) x = x * (-1);
            if(y<0) y = y * (-1);
            var corner = 0; corner = Math.atan(y/x);
            corner = (180/Math.PI) * corner;
            if(corner%15>7) corner = corner + 15 - corner%15;
            else corner = corner - corner%15;
            corner = corner.toFixed(0);

            end_loc[0] = Math.round(end_loc[0]);
            end_loc[1] = Math.round(end_loc[1]);
            cur_loc[0] = Math.round(cur_loc[0]);
            cur_loc[1] = Math.round(cur_loc[1]);
            
            if((cur_loc[0] <= end_loc[0]) && (cur_loc[1] > end_loc[1])) corner = 90 - corner;            // Право-верх
            else if((cur_loc[0] <= end_loc[0]) && (cur_loc[1] < end_loc[1])) corner = 90 + 1*corner;     // Право-низ
            else if((cur_loc[0] > end_loc[0]) && (cur_loc[1] <= end_loc[1])) corner = 270 - corner;      // Лево-низ
            else if((cur_loc[0] >= end_loc[0]) && (cur_loc[1] > end_loc[1])) corner = 270 + 1*corner;    // Лево-верх
        }
        else if(x==0){
            if(y>0) corner = 180;
            if(y<0) corner = 0;
        }
        else if(y==0){
            if(x>0) corner = 90;
            if(x<0) corner = 270;
        }

        if(dir == 2) {
            corner = 270 + 1*corner;
        }
        if(dir == 3) {
            corner = 180 + 1*corner;
        }
        if(dir == 4) {
            corner =  90 + 1*corner;
        }
        
        corner = corner - 1 + 1;
        while(corner>=360) corner -= 360;
        navigator_arrow.className = 'd' + corner;
        // screen3.innerHTML = navigator_arrow.className;
        //screen3.innerHTML += dir + " " + corner;
    }

    this.count_all = function(){
        this.count_corner_degree();
        this.count_cathetus_distance();
        this.count_hypotenuse_distance();
    }
}

function player(id)
{
    if (!id) id = 'player';
    var player = document.getElementById(id);
    var dir = 1, cage;
    var dirs = [null, 'top', 'right', 'bottom', 'left'];
    var player_html = "<span class='" + dirs[dir] + "' id='" + id + "'></span>";
    var started = null, first_step = true;
    var cur_loc = "";
    var time;

    this.finish = function() {
        var a = 1 + (lab_num * 1);
        time.pause();
        time = time.value();
        if (a < $lab_code.length) {
            alert("Поздравляем, вы прошли уровень " + a + " за " + time + " секунд!");
            window.location = "index.php?a=" + a;
        }
        else {
            alert("Поздравляем, вы прошли последний уровень " + a + " за " + time + " секунд!");
        }
    }

    this.start = function() {
        var start = $lab.value('start');
        cur_loc = start.split('.');
        start = "c." + start;
        if (player) player.parentNode.innerHTML = "";
        document.getElementById(start).innerHTML = player_html;
        started = true;
        time = new StopWatch();
        pip_boy.count_all();
        this.screen();
    }

    this.player_html = function() {
        return "<span class='" + dirs[dir] + "' id='" + id + "'></span>";
    }

    this.screen = function() {
        var left = dir - 1, right = dir + 1;
        if (dir == 1) left = 4;
        else if (dir == 4) right = 1;
        cage = $cage.get(cur_loc[0] + '.' + cur_loc[1]);

        var middle = document.getElementById("middle");
        // var top = document.getElementById("top");
        var ext = ".jpg";
        document.getElementById("left").style.backgroundImage = "url(imgs/left" + cage[left] + ext + ")";
        middle.style.backgroundImage = "url(imgs/middle" + cage[dir] + ext + ")";
        var compass = document.getElementById('compass_arrow');
        // for(var i=0; i < cage[5]; i++) top.innerHTML += "+";
        document.getElementById("right").style.backgroundImage = "url(imgs/right" + cage[right] + ext + ")";

        if (cage[0] == 'finish') this.finish();
        if (cage[6]) document.getElementById('paw').style.display = 'block';
        else document.getElementById('paw').style.display = 'none';
        var far_center = document.getElementById("far_center");
        var far_far_center = document.getElementById("far_far_center");
        var north;

        if (dir == 1) north = 1;
        if (dir == 2) north = 4;
        if (dir == 3) north = 3;
        if (dir == 4) north = 2;

        north = return_arrow(north);
        compass.className = north;

        if (cage[dir] == 0) {
            var far_loc = new Array();
            var far_far_loc = new Array();
            var far_left_loc = new Array();
            var far_right_loc = new Array();

            far_loc[1] = cur_loc[1];
            far_loc[0] = cur_loc[0];
            if (dir == 1) far_loc[1]--;
            if (dir == 2) far_loc[0]++;
            if (dir == 3) far_loc[1]++;
            if (dir == 4) far_loc[0]--;

            var far_cage = $cage.get(far_loc[0] + '.' + far_loc[1]);

            var gl = far_cage[left], gr = far_cage[right];

            if (far_cage[left] != 1) {
                far_left_loc[1] = far_loc[1];
                far_left_loc[0] = far_loc[0];
                if (dir == 1) far_left_loc[0]--;
                if (dir == 2) far_left_loc[1]--;
                if (dir == 3) far_left_loc[0]++;
                if (dir == 4) far_left_loc[1]++;
                var far_left_cage = $cage.get(far_left_loc[0] + "." + far_left_loc[1]);
                if (!far_left_cage[dir]) gl = 2;
            }

            if (far_cage[right] != 1) {
                far_right_loc[1] = far_loc[1];
                far_right_loc[0] = far_loc[0];
                if (dir == 1) far_right_loc[0]++;
                if (dir == 2) far_right_loc[1]++;
                if (dir == 3) far_right_loc[0]--;
                if (dir == 4) far_right_loc[1]--;
                var far_right_cage = $cage.get(far_right_loc[0] + "." + far_right_loc[1]);
                if (!far_right_cage[dir]) gr = 2;
            }

            far_far_loc[1] = far_loc[1];
            far_far_loc[0] = far_loc[0];
            if (dir == 1) far_far_loc[1]--;
            if (dir == 2) far_far_loc[0]++;
            if (dir == 3) far_far_loc[1]++;
            if (dir == 4) far_far_loc[0]--;

            ext = ".jpg";
            document.getElementById("far_left").style.backgroundImage = "url(imgs/far_left" + gl + ext + ")";
            far_center.style.backgroundImage = "url(imgs/far_center" + far_cage[dir] + ext + ")";
            document.getElementById("far_right").style.backgroundImage = "url(imgs/far_right" + gr + ext + ")";

            if (far_cage[dir] != 1)
            {
                var far_far_cage = $cage.get(far_far_loc[0] + '.' + far_far_loc[1]);
                ext = ".jpg";
                document.getElementById("far_far_left").style.backgroundImage = "url(imgs/far_far_left" + far_far_cage[left] + ext + ")";
                far_far_center.style.backgroundImage = "url(imgs/far_far_center" + far_far_cage[dir] + ext + ")";
                document.getElementById("far_far_right").style.backgroundImage = "url(imgs/far_far_right" + far_far_cage[right] + ext + ")";
            }
            else {
                document.getElementById("far_far_left").style.background = 'none';
                far_far_center.style.background = 'none';
                document.getElementById("far_far_right").style.background = 'none';
            }
        }
        else {
            document.getElementById("far_far_left").style.background = 'none';
            far_far_center.style.background = 'none';
            document.getElementById("far_far_right").style.background = 'none';
            document.getElementById("far_left").style.background = 'none';
            far_center.style.background = 'none';
            document.getElementById("far_right").style.background = 'none';
        }
        return true;
    }

    this.rotate = function(d) {
        if (d == 'l') {
            if (dir-- == 1) dir = 4;
        }
        else if (d == 'r') {
            if (dir++ == 4) dir = 1;
        }
        document.getElementById("c." + cur_loc[0] + "." + cur_loc[1]).innerHTML = this.player_html();
        this.screen();
        if (!cheater) this.map();

        pip_boy.count_all();

        return true;
    }

    this.map = function(d) {
        var map = document.getElementById('all');
        if(cheater){
            if (d && map.style.display != 'block') map.style.display = 'block';
            else map.style.display = 'none';            
        }
    }

    this.paw = function() {
        document.getElementById('paw').style.display = 'block';
        cage = $cage.get(cur_loc[0] + '.' + cur_loc[1]);
        cage[6] = true;
        $cage.put(cur_loc[0] + '.' + cur_loc[1], cage);
    }

    this.move = function(d) {
        if (first_step) {
            first_step = false;
            time.start();
        }

        cage = $cage.get(cur_loc[0] + '.' + cur_loc[1]);
        if (!d) d = dir;
        else {
            if (dir == 1) d = 3;
            if (dir == 2) d = 4;
            if (dir == 3) d = 1;
            if (dir == 4) d = 2;
        }

        if (cage[d] == 0) {
            document.getElementById("c." + cur_loc[0] + "." + cur_loc[1]).innerHTML = "";
            if (d == 1) cur_loc[1]--;
            if (d == 2) cur_loc[0]++;
            if (d == 3) cur_loc[1]++;
            if (d == 4) cur_loc[0]--;
            document.getElementById("c." + cur_loc[0] + "." + cur_loc[1]).innerHTML = this.player_html();
        }
        else {
            return false;
        }
        cage = $cage.get(cur_loc[0] + '.' + cur_loc[1]);
        this.screen();
        if (!cheater) this.map();
        if (cage[5] < 5) {
            cage[5]++;
            $cage.put(cur_loc[0] + '.' + cur_loc[1], cage);
        }

        pip_boy.count_all();

        return true;
    }

    this.location = function(d){
        if(d) return dir;
        return cur_loc;
    }
}

function return_menu_list_main(menu_main_text_cheater, menu_main_text_hand) {
    var menu_list_main = "<ul>";
    menu_list_main += "<li id=\"menu_option_cheater\" onclick=\"menu.options('cheater_mode')\">" + menu_main_text_cheater + "</li>";
    menu_list_main += "<li onclick=\"menu.show_list('control')\">Настроить управление</li>";
    menu_list_main += "<li id=\"menu_option_hand\" onclick=\"menu.options('hand_disable')\">" + menu_main_text_hand + "</li>";
    menu_list_main += "<li onclick=\"menu.oc()\">Закрыть меню</li>";
    menu_list_main += "</ul>";
    return menu_list_main;
}

function return_key_value(value) {
    if ((value >= 48 && value <= 57) || (value >= 65 && value <= 90)) {
        return "&#" + value + ";";
    }

    if (value == 37) return "&larr;";
    if (value == 38) return "&uarr;";
    if (value == 39) return "&rarr;";
    if (value == 40) return "&darr;";

    if (value == 13) return "[enter]";
    if (value == 16) return "[shift]";
    if (value == 17) return "[ctrl]";
    if (value == 18) return "[alt]";
    if (value == 32) return "[space]";

    return false;
}

function return_menu_list_control() {
    var menu_list_control = "<ul>";
    menu_list_control += "<li class='key' onclick='keyboard.set(this,\"front\")'>Вперед - " + return_key_value(move_front) + "</li>";
    menu_list_control += "<li class='key' onclick='keyboard.set(this,\"back\")'>Назад - " + return_key_value(move_back) + "</li>";
    menu_list_control += "<li class='key' onclick='keyboard.set(this,\"left\")'>Влево - " + return_key_value(move_left) + "</li>";
    menu_list_control += "<li class='key' onclick='keyboard.set(this,\"right\")'>Вправо - " + return_key_value(move_right) + "</li>";
    menu_list_control += "<li class='key' onclick='keyboard.set(this,\"map\")'>Карта - " + return_key_value(map_open) + "</li>";
    menu_list_control += "<li style='color: #666;' class='key' onclick='keyboard.set(this,\"menu\")'>Меню - " + return_key_value(menu_open) + "</li>";
    menu_list_control += "<li class='key' onclick='keyboard.set(this,\"paw\")'>Лапа - " + return_key_value(put_paw) + "</li>";
    menu_list_control += "<li onclick='keyboard.set_default()'>Настройки по умолчанию</li>";
    menu_list_control += "<li onclick=\"menu.show_list('main')\">Вернуться в главное меню</li>";
    menu_list_control += "</ul>";
    return menu_list_control;
}

function Menu()
{
    var menu_bg = document.getElementById('menu_bg');
    var game_menu = document.getElementById('game_menu');

    var hand_disable = false;
    var cheater_first = false;

    var menu_main_text_cheater = 'Активировать "Читер-мод"';
    var menu_main_text_hand = 'Спрятать руку';


    this.oc = function() {
        if (menu_opened) {
            menu_bg.style.display = 'none';
            game_menu.style.display = 'none';
            menu_opened = false;
        }
        else {
            menu_bg.style.display = 'block';
            game_menu.style.display = 'block';
            this.show_list('main');
            menu_opened = true;
        }
    }

    this.show_list = function(list) {
        if (list == 'main') {
            game_menu.innerHTML = return_menu_list_main(menu_main_text_cheater, menu_main_text_hand);
        }
        if (list == 'control') {
            game_menu.innerHTML = return_menu_list_control(menu_main_text_cheater, menu_main_text_hand);
        }
    }

    this.options = function(option) {
        var hand = document.getElementById('compass');
        var menu_hand = document.getElementById('menu_option_hand');
        var menu_cheater = document.getElementById('menu_option_cheater');

        if (option == 'hand_disable') {
            if (hand_disable) {
                hand.style.display = 'block';
                menu_main_text_hand = 'Спрятать навигатор';
                menu_hand.innerHTML = menu_main_text_hand;
                hand_disable = false;
            }
            else {
                hand.style.display = 'none';
                menu_main_text_hand = 'Показать навигатор';
                menu_hand.innerHTML = menu_main_text_hand;
                hand_disable = true;
            }
        }

        if (option == 'cheater_mode') {
            if (!cheater) {
                if (!cheater_first)
                {
                    if (!confirm('Вы уверены, что хотите активировать "Читер мод"?')) return false;
                    if(window.prompt('Нужен пароль') != 1) return false;
                    document.getElementById('open_menu').style.background = '#cc0000';
                    document.getElementById('menu_bg').style.background = '#440000';
                    document.getElementById('game_menu').style.background = '#880000';
                    document.getElementById('game_menu').style.borderColor = '#440000';
                    document.getElementById('game_menu').childNodes[0].style.borderColor = '#660000';

                    document.getElementById('screen3').innerHTML = 'Cheater!';
                    cheater_first = true;
                }
                menu_cheater.innerHTML = 'Деактивировать "Читер-мод"';
                menu_main_text_cheater = 'Деактивировать "Читер-мод"';
                cheater = true;
            }
            else {
                menu_cheater.innerHTML = 'Активировать "Читер-мод"';
                menu_main_text_cheater = 'Активировать "Читер-мод"';
                cheater = false;
            }
        }
    }
}


function Keyboard()
{
    var move_left_default = 37;
    var move_front_default = 38;
    var move_right_default = 39;
    var move_back_default = 40;
    var map_open_default = 77;
    var menu_open_default = 78;
    var put_paw_default = 80;


    var button = null;
    var obj = null;

    this.set_default = function() {
        if (!confirm('Вы уверены, что хотите востановить настройки по-умолчанию?')) return false;
        move_left = move_left_default;
        move_front = move_front_default;
        move_right = move_right_default;
        move_back = move_back_default;
        map_open = map_open_default;
        menu_open = menu_open_default;
        put_paw = put_paw_default;
        menu.show_list('control')
    }

    this.set_first = function() {
        if (!(move_left = getCookie('move_left'))) move_left = move_left_default;
        if (!(move_front = getCookie('move_front'))) move_front = move_front_default;
        if (!(move_right = getCookie('move_right'))) move_right = move_right_default;
        if (!(move_back = getCookie('move_back'))) move_back = move_back_default;
        if (!(map_open = getCookie('map_open'))) map_open = map_open_default;
        if (!(menu_open = getCookie('menu_open'))) menu_open = menu_open_default;
        if (!(put_paw = getCookie('put_paw'))) put_paw = put_paw_default;
    }

    this.body = function(value) {
        if (!menu_opened)
        {
            if (value == move_left) player1.rotate("l"); // Влево
            if (value == move_front) player1.move(); // Вверх
            if (value == move_right) player1.rotate("r"); // Вправо
            if (value == move_back) player1.move(true); // Вниз

        }
        if (value == menu_open) menu.oc();
        if (value == map_open) player1.map(true);
        if (value == put_paw) player1.paw();
        if (button) {
            if (this.set_value(button, value)) {
                menu.show_list('control')
            }
            obj.style.background = null;
            obj = null;
            button = null;
        }
        return true;
    }

    this.set = function(t, b) {
        button = b;
        t.style.background = "#888";
        obj = t;
    }

    this.set_value = function(button, value) {
        if (!(value == 13 || (value > 15 && value < 19) || value == 32 || (value > 36 && value < 41) || (value >= 48 && value <= 57) || (value >= 65 && value <= 90) )) return false;
        if (value == move_left || value == move_front || value == move_right || value == move_back || value == map_open || value == menu_open) return false;
        if (button == 'left') {
            move_left = value;
            setCookie('move_left', value);
        }
        if (button == 'front') {
            move_front = value;
            setCookie('move_front', value);
        }
        if (button == 'right') {
            move_right = value;
            setCookie('move_right', value);
        }
        if (button == 'back') {
            move_back = value;
            setCookie('move_back', value);
        }
        if (button == 'map') {
            map_open = value;
            setCookie('map_open', value);
        }
        if (button == 'menu') {
            menu_open = value;
            setCookie('menu_open', value);
        }
        if (button == 'paw') {
            put_paw = value;
            setCookie('put_paw', value);
        }

        return true;
    }
}
// 13 -ентер, 16 -шифт, 17 -контрол, 18 -альт, 32 -пробел
// 048 - 057 - цифры
// 065 - 090 - буквы