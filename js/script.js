var drawer;

document.onready = function() {
	drawer = new drawThing();
}

document.onclick = function() {
	drawer.init();
}