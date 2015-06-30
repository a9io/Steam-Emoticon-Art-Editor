var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 360;
canvas.height = 360;

var ui = {
	addingEmote: false,
	adder: document.getElementById("adder"),
	setbg: document.getElementById("setbg"),
	done: document.getElementById("done"),
	clear: document.getElementById("clear"),
	size: document.getElementById("size")
};
var emotes = [];
var pic = makeArray(20, 20, -1);
var selectedEmote = "";
var mousedown = false;
var prevvalue = -1;
var error = false;

var render = function(){
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.fillStyle = "#101214";
	ctx.fillRect(0, 0, canvas.width, canvas.height);
	ctx.strokeStyle = "#4e4e4e";
	ctx.lineWidth = 1;
	for(var i=0; i<pic[0].length; i++){
		ctx.beginPath();
		ctx.moveTo(i*18, 0);
		ctx.lineTo(i*18, pic.length*18);
		ctx.stroke();
	}
	for(var i=0; i<pic.length; i++){
		ctx.beginPath();
		ctx.moveTo(0, i*18);
		ctx.lineTo(pic[0].length*18, i*18);
		ctx.stroke();
	}
	ctx.beginPath();
	ctx.moveTo(pic[0].length*18, 0);
	ctx.lineTo(pic[0].length*18, pic.length*18);
	ctx.stroke();
	ctx.beginPath();
	ctx.moveTo(0, pic.length*18);
	ctx.lineTo(pic[0].length*18, pic.length*18);
	ctx.stroke();

	for(var y=0; y<pic.length; y++){
		for(var x=0; x<pic[y].length; x++){
			if(pic[y][x] > -1){
				var Img = new Image();
				Img.src = "http://cdn.steamcommunity.com/economy/emoticon/" + emotes[pic[y][x]];
				ctx.drawImage(Img, x*18, y*18);
			}
		}
	}

	requestAnimationFrame(render);
};

function detectemote(e){
	var value = document.getElementById("emotein").value.replace(/:/g,'');
	if(e.keyCode == 13){
		if (emotes.indexOf(value) == -1) emotes.push(value);
		document.getElementById("emotein").parentNode.removeChild(document.getElementById("emotein"));
		ui.addingEmote = false;
		var el = new paintElem(value);
		el.img.onload = function(){
			document.getElementById("paints-container").appendChild(el.el);
		};
		el.img.onerror = function(){
			ui.adder.style.color = "red";
		};
	}
}

function detectbg(e){
	var value = document.getElementById("emotein").value.replace(/:/g,'');
	if(e.keyCode == 13){
		emotes.push(value);
		document.getElementById("emotein").parentNode.removeChild(document.getElementById("emotein"));
		ui.setbg.innerHTML = "background";
		ui.addingEmote = false;
		var img = new Image();
		img.src = "http://cdn.steamcommunity.com/economy/emoticon/" + value;
		img.onload = function(){
			for(var y=0; y<pic.length; y++){
				for(var x=0; x<pic[y].length; x++){
					if(pic[y][x] == prevvalue){
						pic[y][x] = emotes.indexOf(value);
					}
				}
			}
			prevvalue = emotes.indexOf(value);
		};
	}
}

function detectsize(e){
	var w = document.getElementById("w").value;
	var h = document.getElementById("h").value;
	if(e.keyCode == 13){
		if(w <= 33 && h <= 40){
			pic = makeArray(w, h, prevvalue);
			canvas.width = pic[0].length*18;
			canvas.height = pic.length*18;
			ui.size.innerHTML = "size";
		}
		ui.addingEmote = false;
	}
}

var paintElem = function(e){
	error = false;
	this.el = document.createElement("li");
	this.sub = document.createElement("a");
	this.sub.href = "#";
	this.sub.id = e;
	this.sub.onclick = function(){
		select(e);
	};
	this.sub.oncontextmenu = function(){
		document.getElementById(e).parentNode.removeChild(document.getElementById(e));
		return false;
	};
	this.img = new Image();
	this.img.src = "http://cdn.steamcommunity.com/economy/emoticon/" + e;
	this.sub.appendChild(this.img);
	this.el.appendChild(this.sub);
};

ui.adder.onclick = function(){
	if(!ui.addingEmote){
		ui.adder.childNodes[0].innerHTML+= "<input type='text' id='emotein' placeholder='emoticon code' onkeypress='return detectemote(event)' autofocus>";
		ui.addingEmote = true;
	}
};
ui.setbg.onclick = function(){
	if(!ui.addingEmote){
		ui.setbg.innerHTML= "<input type='text' id='emotein' placeholder='emoticon code' onkeypress='return detectbg(event)' autofocus>";
		ui.addingEmote = true;
	}
};

ui.clear.onclick = function(){
	pic = makeArray(pic[0].length, pic.length, -1);
	emotes = [];
	prevvalue = -1;
	while (document.getElementById("paints-container").childNodes.length > 3) {
			document.getElementById("paints-container").removeChild(document.getElementById("paints-container").lastChild);
	}
};

ui.size.onclick = function(){
	if(!ui.addingEmote){
		ui.size.innerHTML = "<input type='text' id='w' class='dimensionin' placeholder='w' onkeypress='return detectsize(event)' value='" + pic[0].length + "' autofocus> <input type='text' id='h' class='dimensionin' placeholder='h' onkeypress='return detectsize(event)' value='" + pic.length + "'>";
		ui.addingEmote = true;
	}
};

ui.done.onclick = function(){
	if(checkedIfEmpty(pic)){
		var output = "";
		for(var y=0; y<pic.length; y++){
			for(var x=0; x<pic[y].length; x++){
				if(pic[y][x] > -1){
					output += ":" + emotes[pic[y][x]] + ":";
				}
				else {
					output += " ";
				}
			}
			output += "\n";
		}
		document.getElementById("output").style.display = "inline";
		document.getElementById("output").value = output;
		document.getElementById("output").select();
	}
	else {
		ui.setbg.style.color = "red";
	}
};

var checkedIfEmpty = function(arr){
	var found = true;
	for(var y=0; y<arr.length; y++){
		for(var x=0; x<arr[y].length; x++){
			if(arr[y][x] == -1) found = false;
		}
	}
	return found;
};

canvas.onmousedown = function(){
		var event = event || window.event,
		x = event.pageX - canvas.offsetLeft,
		y = event.pageY - canvas.offsetTop,
		arrX = 	Math.floor(x/18),
	arrY = Math.floor(y/18);
	if(validCoord(pic, arrX, arrY)) pic[arrY][arrX] = emotes.indexOf(selectedEmote);
	mousedown = true;
};

canvas.onmousemove = function(){
	if(mousedown){
<<<<<<< HEAD
    	var event = event || window.event,
    	x = event.pageX - canvas.offsetLeft,
    	y = event.pageY - canvas.offsetTop,
    	arrX = 	Math.floor(x/18),
=======
			var event = event || window.event,
			x = event.pageX - canvas.offsetLeft,
			y = event.pageY - canvas.offsetTop,
			arrX = 	Math.floor(x/18),
>>>>>>> master
		arrY = Math.floor(y/18);
		if(validCoord(pic, arrX, arrY)) pic[arrY][arrX] = emotes.indexOf(selectedEmote);
	}
};

window.onmouseup = function(){
	mousedown = false;
};

canvas.oncontextmenu = function(){
	mousedown = false;
		var event = event || window.event,
		x = event.pageX - canvas.offsetLeft,
		y = event.pageY - canvas.offsetTop,
		arrX = 	Math.floor(x/18),
	arrY = Math.floor(y/18);
	pic[arrY][arrX] = prevvalue;
	return false;
};

function validCoord(arr, x, y){
	if(x < arr[0].length && y < arr.length){
		return true;
	}
}

function select(e){
	if(emotes.indexOf(e) > -1){
		curs = document.getElementsByClassName("selected");
		if (curs.length > 0) curs[0].className = "";
		document.getElementById(e).className = "selected";
		selectedEmote = e;
	}
}

window.requestAnimationFrame = (function(){
	return  window.requestAnimationFrame       ||
					window.webkitRequestAnimationFrame ||
					window.mozRequestAnimationFrame    ||
					function( callback ){
						window.setTimeout(callback, 1000 / 60);
					};
})();

function makeArray(w, h, val) {
		var arr = [];
		for(i = 0; i < h; i++) {
				arr[i] = [];
				for(j = 0; j < w; j++) {
						arr[i][j] = val;
				}
		}
		return arr;
}

render();
