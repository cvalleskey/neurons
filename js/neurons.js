var drawThing = function() {

	// Variables
	var canvas = document.getElementById('c');
	var context = canvas.getContext('2d');
	var lines = [];
	var maxPoints = 20;
	var maxLines = 200;
	var numChildren = 3;
	var mouse = {
		x : 0,
		y : 0
	};

	function init() {

		lines = [
			{
				color : { r : 64, g : 64, b : 64 },
				width: 10,
		 		start : {
		 			x : mouse.x, //Math.random() * document.body.clientWidth,
		 			y : mouse.y //Math.random() * document.body.clientHeight
		 		},
		 		time : 0,
		 		speed : 5,
		 		generation : 0,
		 		points : [
		 			{
		 				x : mouse.x, //Math.random() * document.body.clientWidth,
		 				y: mouse.y, //Math.random() * document.body.clientHeight,
		 				ctrlx : mouse.x, //Math.random() * document.body.clientWidth,
		 				ctrly : mouse.y //Math.random() * document.body.clientHeight
		 			}
		 		]
			}
		];

		setHeight();
		tick(0);
	}

	this.init = init;
	window.onmousemove = handleMouseMove;
	window.onclick = handleClick;

	function tick(time) {

		//context.globalCompositeOperation = 'multiply';

		var grd = context.createRadialGradient(canvas.width / 2,canvas.height / 2,0,canvas.width / 2,canvas.height / 2,canvas.height);
		grd.addColorStop(0,"#fff");
		grd.addColorStop(1,"#ccc");

		context.fillStyle = grd; //'#FFFFFF';
		context.fillRect(0, 0, canvas.width, canvas.height);

		//setHeight();
		//context.clearRect(0, 0, canvas.width, canvas.height);

		var newLines = [];

		for(var i = 0; i < lines.length; i++) {
			
			var line = lines[i];

			if(line.time < maxPoints) {

				var newx = line.points[line.points.length-1].x + flip(Math.random() * line.speed);
				var newy = line.points[line.points.length-1].y + flip(Math.random() * line.speed);

				line.points.push({
					x : newx,
					y : newy,
					ctrlx : newx + flip(Math.random() * line.speed),
					ctrly : newy + flip(Math.random() * line.speed)
				});
			}
			if(i) {
				context.beginPath();
			}

			context.strokeStyle = 'rgb(' + line.color.r + ',' + line.color.g + ',' + line.color.b + ')';
			context.lineWidth = line.width * (line.time + 1) / maxPoints;
			
			context.moveTo(line.start.x + mouse.x / 200, line.start.y + mouse.y / 200);

			line.lastx = newx;
			line.lasty = newy;

			for(var z = 1; z < line.points.length; z++) {
				
				var point = line.points[z];
				var lastPoint = line.points[z-1];

				var aug = {
					x : lastPoint.x + (mouse.x / 200 * line.generation), // ,
					y : lastPoint.y + (mouse.y / 200 * line.generation), // + flip(Math.random() * line.generation),
					ctrlx : point.ctrlx + (mouse.x / 200 * (line.generation + 1)), //+ flip((line.generation + 1) / 5), // + flip(Math.random() * line.generation),
					ctrly : point.ctrly + (mouse.y / 200 * (line.generation + 1)), // + flip((line.generation + 1) / 5), // + flip(Math.random() * line.generation),
					newx : point.x + (mouse.x / 200 * line.generation),
					newy : point.y + (mouse.y / 200 * line.generation)
				}

				context.moveTo(aug.x, aug.y);
				context.bezierCurveTo(aug.x, aug.y, aug.ctrlx, aug.ctrly, aug.newx, aug.newy);

			}
			context.lineCap = 'round';
			context.lineJoin = 'round';
			context.stroke();
			context.closePath();

			// if(line.time + 1 == maxPoints) {
			// 	line.time = maxPoints;
			// 	if(lines.length <= maxLines) {
			// 		newline(newLines, line, Math.floor(Math.random() * numChildren) + 1);
			// 	}
			// } else {
			//  	line.time++;
			// }
			if(line.time++ == maxPoints) {
				if(lines.length <= maxLines) {
					newline(newLines, line, Math.floor(Math.random() * numChildren) + 1);
				}
			} else if(line.time > maxPoints) {
				line.time = maxPoints + 1;
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
				//color : 'rgb(' + ((parent.generation + 1) * 32) + ',' + ((parent.generation + 1) * 32) + ',' + ((parent.generation + 1) * 32) + ')',
				color : {
					r : parent.color.r + 16, //Math.round(Math.random() * 16),
					g : parent.color.g + 16, //Math.round(Math.random() * 16), // + Math.round(Math.random() * 16),
					b : parent.color.b + 16 //Math.round(Math.random() * 16) // + Math.round(Math.random() * 16)
				},
				width : parent.width / 1.5,
		 		start : {
		 			x : parent.points[parent.points.length-1].x,
		 			y : parent.points[parent.points.length-1].y
		 		},
				time : 0,
				speed : parent.speed + parent.generation * 2,
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

	function drawBackground() {

		var grd = context.createRadialGradient(canvas.width / 2,canvas.height / 2,0,canvas.width / 2,canvas.height / 2,canvas.height);
		grd.addColorStop(0,"#fff");
		grd.addColorStop(1,"#ccc");

		context.fillStyle = grd; //'#FFFFFF';
		context.fillRect(0, 0, canvas.width, canvas.height);

	}
	drawBackground();

	function handleMouseMove(event) {
		mouse = {
			x : event.clientX,
			y : event.clientY
		}
	}

	function handleClick(event) {
		mouse = {
			x : event.clientX,
			y : event.clientY
		}
		init();
	}

	function setHeight() {
		canvas.width = document.body.clientWidth;
		canvas.height = document.body.clientHeight;
	}

	function flip(num) {
		return num * (Math.round(Math.random())? -1 : 1);
	}

	//init();

}