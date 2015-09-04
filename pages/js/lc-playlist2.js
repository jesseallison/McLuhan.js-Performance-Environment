

var LCPlaylist = function(parentID, cb) {

	this.playlist = []

	this.lineIndex = 0;

	this.callback = cb;

	this.color = "black"

	this.limit = 10
	this.current = 0

	this.parentID = parentID

	this.container = document.createElement("div")
	this.container.className = "playlist"

	this.parent = document.getElementById(this.parentID)
	this.parent.appendChild(this.container)

	this.mover = {}

	this.nameIndex = 0

	this.nexttitle = false;

}

LCPlaylist.prototype.add = function(command, info, color) {

	this.color = color

	this.lineIndex++

	var piece = document.createElement("div")
	piece.className = "item"
	piece.style.color = this.color
	piece.id = "fragment"+this.lineIndex
	this.container.appendChild(piece)

	var text = document.createElement("div")
	text.innerHTML = this.lineIndex + " ~ " + command;
	text.className = "text"
	piece.appendChild(text)

	var vis = document.createElement("div")
	vis.className = "beatvis"
	vis.style.backgroundColor = color
	piece.appendChild(vis)

	var closer = document.createElement("div")
	closer.className = "close"
	closer.innerHTML = "&times;"
	piece.appendChild(closer)
	closer.addEventListener("mousedown",this.cut.bind(this,name,piece))

	var newline = {
		index: this.lineIndex,
		wall: color,
		command: command,
		code: info.code,
		duration: info.beat
	}
	newline.interval = interval(info.beat,function(newline) {
			//with (eval(newline.color)) {
				eval(newline.code) // distant, most likely....
			//}
			//console.log(this)
			this.ping(newline)
	}.bind(this,newline))
		//.bind(eval(color))

	this.playlist.push(newline)

	var self = this;

	$([this.container]).sortable({
	  containment: "parent",
	  start: function( event, ui ) {
	  	this.mover.start = ui.item.index()
	  }.bind(self),
	  update: function( event, ui ) {
	  	this.mover.end = ui.item.index()
	  	this.move(this.mover.start,this.mover.end)
	  }.bind(self)
	})

	var data = this.playlist[this.playlist.length-1]
	data.event = "add"

	if (this.playlist.length>=this.limit) {
		var index = this.playlist[0].name
		this.cut(index,document.getElementById("fragment"+index))
	}

	this.callback(data);

}

LCPlaylist.prototype.move = function(start,end) {
	this.playlist.splice(end, 0, this.playlist.splice(start, 1)[0])
}

LCPlaylist.prototype.tick = function() {

	var poemstring = ""
	var infinitycheck = 0;

	if (this.playlist.length==0) {
		return ""
	}
	this.current++;
	if (this.current>=this.playlist.length) {
		this.current = 0;
	}

	while (this.playlist[this.current].norepeat) {
		this.current++;
		if (this.current>=this.playlist.length) {
			this.current = 0;
		}
		infinitycheck++;
		if (infinitycheck >= this.limit) {
			return false;
		}
	}

	$(".item").css("font-weight", "normal")
	$(".item:eq("+this.current+")").css("font-weight", "bold")

	var data = this.playlist[this.current]
	data.event = "playback"

	this.callback(data);

}

LCPlaylist.prototype.cut = function(index,piece) {
	for (var i=0;i<this.playlist.length;i++) {
		if (this.playlist[i].name == index) {
			this.playlist.splice(i,1)
			this.container.removeChild(piece)
		}
	}
}

LCPlaylist.prototype.ping = function(line) {

	/*var linepiece = document.getElementById("fragment"+line.index))
	var vispiece = document.querySelector('#fragment'+line.index + ' .beatvis');
	
	vispiece.style.webkitTransition = "opacity 0s;"
  vispiece.style.transition = "opacity 0s;"
	vispiece.style.opacity = 1;
	vispiece.style.webkitTransition = "opacity 0.2s;"
  vispiece.style.transition = "opacity 0.2s;"
	vispiece.style.opacity = 0; */
	console.log(line)
	$("#fragment"+line.index+" .beatvis").css("opacity","1").animate({"opacity":0},line.duration)
	//console.log(vispiece)
}








var PoemVis = function(parent) {

	this.parent = document.getElementById(parent)

	// array of strings (no, have multiple of same string)
	// array of objects with nameIndex & command
	// or object list of index: commandString
	this.fragments = []

}

PoemVis.prototype.add = function(fragment) {


	var piece = document.createElement("span")
	piece.className = "poemvis-fragment"
	piece.id = "poemfragment"+fragment.name
	piece.innerHTML = fragment.command

	this.parent.appendChild(piece)

}


PoemVis.prototype.highlight = function(data) {

	$(".poemvis-fragment").css("opacity", "0.7")
	if (data) {
		$("#poemfragment"+data.name).css("opacity", "1")
	}

}




