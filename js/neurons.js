var drawThing = function() {

	// Variables
	var canvas = document.getElementById('c');
	var context = canvas.getContext('2d');
	var lines = [];
	var maxPoints = 50;
	var maxLines = 250;
	var numChildren = 4;
	var mouse = {
		x : 0,
		y : 0
	};

	function init() {

		lines = [
			{
				color : 'rgb(0,0,0)',
				width: 10,
		 		start : {
		 			x : document.body.clientWidth / 2,
		 			y : document.body.clientHeight / 2
		 		},
		 		time : 0,
		 		speed : 15,
		 		generation : 0,
		 		points : [
		 			{
		 				x : document.body.clientWidth / 2,
		 				y: document.body.clientHeight / 2,
		 				ctrlx : document.body.clientWidth / 2,
		 				ctrly : document.body.clientHeight / 2
		 			}
		 		]
			}
		];

		setHeight();
		tick(0);
	}

	this.init = init;
	window.onmousemove = handleMouseMove;

	function tick(time) {

		//context.globalCompositeOperation = 'multiply';

		context.fillStyle = '#FFFFFF';
		context.fillRect(0, 0, canvas.width, canvas.height);
		//setHeight();
		//context.clearRect(0, 0, canvas.width, canvas.height);

		var newLines = [];

		for(var i = 0; i < lines.length; i++) {
			
			var line = lines[i];

			if(line.time++ <= maxPoints) {

				var newx = line.points[line.points.length-1].x + flip(Math.random() * line.speed);
				var newy = line.points[line.points.length-1].y + flip(Math.random() * line.speed);

				line.points.push({
					x : newx,
					y : newy,
					ctrlx : newx + flip(Math.random() * line.speed),
					ctrly : newy + flip(Math.random() * line.speed)
				});
			}

			context.beginPath();

			context.strokeStyle = line.color;
			context.lineWidth = line.width;
			
			context.moveTo(line.start.x, line.start.y);

			line.lastx = newx;
			line.lasty = newy;

			for(var z = 1; z < line.points.length; z++) {
				
				var point = line.points[z];
				var lastPoint = line.points[z-1];

				var aug = {
					x : lastPoint.x, // ,
					y : lastPoint.y, // + flip(Math.random() * line.generation),
					ctrlx : point.ctrlx + (mouse.x / 100 * (line.generation + 1)) + flip(Math.random() * (line.generation + 1) / 5), // + flip(Math.random() * line.generation),
					ctrly : point.ctrly + (mouse.y / 100 * (line.generation + 1)) + flip(Math.random() * (line.generation + 1) / 5), // + flip(Math.random() * line.generation),
					newx : point.x + (mouse.x / 100 * line.generation),
					newy : point.y + (mouse.y / 100 * line.generation)
				}

				context.moveTo(lastPoint.x + (mouse.x / 100 * line.generation), lastPoint.y + (mouse.y / 100 * line.generation));
				context.bezierCurveTo(aug.x + (mouse.x / 100 * line.generation), aug.y + (mouse.y / 100 * line.generation), aug.ctrlx, aug.ctrly, aug.newx, aug.newy);

			}
			context.lineCap = 'round';
			context.lineJoin = 'round';
			context.stroke();
			context.closePath();

			if(line.time == maxPoints) {
				if(lines.length <= maxLines) {
					newline(newLines, line, Math.floor(Math.random() * numChildren) + 1);
				}
			}
		}

		lines = newLines.concat(lines);

		//if(lines.length <= maxLines) {
			requestAnimationFrame(tick);
		//}
	}

	function newline(lines, parent, count) {
		for(var i = 0; i < count; i++) {
			lines.push({
				color : 'rgb(' + ((parent.generation + 1) * 32) + ',' + ((parent.generation + 1) * 32) + ',' + ((parent.generation + 1) * 32) + ')',
				width : parent.width / 2,
		 		start : {
		 			x : parent.points[parent.points.length-1].x,
		 			y : parent.points[parent.points.length-1].y
		 		},
				time : 0,
				speed : parent.speed + 2,
				generation : parent.generation + 1,
		 		points : [
		 			{
		 				x : parent.points[parent.points.length-1].x,
		 				y : parent.points[parent.points.length-1].y,
		 				ctrlx : parent.points[parent.points.length-1].x,
		 				ctrly : parent.points[parent.points.length-1].y
		 			}
		 		]
			});
		}
	}

	function handleMouseMove(event) {
		mouse = {
			x : event.clientX,
			y : event.clientY
		}
	}

	function setHeight() {
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;
	}

	function flip(num) {
		return num * (Math.round(Math.random())? -1 : 1);
	}

	init();

}