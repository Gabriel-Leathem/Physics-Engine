"use strict";
// Setup Canvas
let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;


// variables
let mouse = {
	x: innerWidth / 2,
	y: innerHeight / 2 
};

let colors = [
	'#9E2159',
	'#EBDC60',
	'#EB4992',
	'#31CFEB',
 	'#298D9E'
];

let darkerColors = [
  '#5e1335',
  '#a49a43',
  '#a43366',
  '#2290a4',
  '#1c626e'
]

let wind = 0;
let gravity = 0.16;
let friction = 0.99;
let ballCount = 10;
let iterations = 8;


// Event Listeners
addEventListener("resize", function() {
	canvas.width = innerWidth;	
	canvas.height = innerHeight;
  init();
});

document.getElementById("simulation").addEventListener("click", function(event) {
	animate();
});

document.getElementById("start-restart").addEventListener("click", function(event) {
	init();
});

document.getElementById("dark-mode").addEventListener("click", function(event) {
	darkModeToggle();
});

function show(id) {
    document.getElementById(id).style.display = "block";
}

function hide(id) {
    document.getElementById(id).style.display = "none";
}

show("webpage-state-always");
hide("webpage-state-how-it-works");
hide("webpage-state-simulation");
hide("webpage-state-about");

document.getElementById("how-it-works").addEventListener('click', function() {
    show("webpage-state-how-it-works");
    hide("webpage-state-home");
    hide("webpage-state-about");
    hide("webpage-state-simulation");
});

document.getElementById("home").addEventListener('click', function() {
    show("webpage-state-home");
    hide("webpage-state-how-it-works");
    hide("webpage-state-simulation");
    hide("webpage-state-about");
});

document.getElementById("home-button").addEventListener('click', function() {
    show("webpage-state-always");
    show("webpage-state-home");
    hide("webpage-state-how-it-works");
    hide("webpage-state-simulation");
    hide("webpage-state-about");
});

document.getElementById("about").addEventListener('click', function() {
    show("webpage-state-about");
    hide("webpage-state-how-it-works");
    hide("webpage-state-simulation");
    hide("webpage-state-home");
});

document.getElementById("simulation").addEventListener('click', function() {
    show("webpage-state-simulation");
    hide("webpage-state-how-it-works");
    hide("webpage-state-home");
    hide("webpage-state-about");
    hide("webpage-state-always")
});

// Util Functions
function randomIntFromRange(min,max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomColor(colors) {
	return colors[Math.floor(Math.random() * colors.length)];
}

function rotate(dx, dy, angle) {
    const rotatedVelocities = {
        x: dx * Math.cos(angle) - dy * Math.sin(angle),
        y: dx * Math.sin(angle) + dy * Math.cos(angle)
    };
    return rotatedVelocities;
};

function dist(x1, y1, x2, y2) {
            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
        }

function direction(x1, y1, x2, y2) {
	return Math.atan2(x1 - x2, y1 - y2);
}

function darkModeToggle() {
  let element = document.body;
  element.classList.toggle("dark-mode");
}

function map(num, numMin, numMax, mapMin, mapMax) {
			return mapMin + ((mapMax - mapMin) / (numMax - numMin)) * (num - numMin);
		};

function openNav(sidenav) {
  document.getElementById(sidenav).style.width = "20vw";
}

function closeNav(sidenav) {
  document.getElementById(sidenav).style.width = "0";
}

// Objects
function Ball(x, y, dx, dy, radius, color, darkerColor) {
	this.x = x;
	this.y = y;
	this.dx = dx;
	this.dy = dy;
	this.radius = radius;
	this.color = color;
	this.darkerColor = darkerColor;

	this.update = function() {
		if (this.y + this.radius + this.dy / iterations > canvas.height) {
			this.dy = -this.dy * 0.9;
			this.dy = this.dy * friction;
			this.dx = this.dx * friction;
			this.y = canvas.height - this.radius;
			// this.x = canvas.height - this.radius;
		}

		if (this.x + this.radius + this.dx / iterations > canvas.width) {
			this.dx = -this.dx * 0.9;
			this.dy = this.dy * friction;
			this.dx = this.dx * friction;
			this.x = canvas.width - this.radius;
		}

		if (this.x - this.radius + this.dx / iterations < 0) {
			this.dx = -this.dx * 0.9;
			this.dy = this.dy * friction;
			this.dx = this.dx * friction;
			this.x = this.radius;
		}

		if (this.y - this.radius + this.dy / iterations < canvas.height * 0.06) {
			this.dy = -this.dy * 0.9;
			this.dy = this.dy * friction;
			this.dx = this.dx * friction;
			this.y = this.radius + canvas.height * 0.06;
		}


		this.dy += gravity / iterations;
		this.dx += wind / iterations;
		this.x += this.dx / iterations;
		this.y += this.dy / iterations;
	};

	this.draw = function() {
		ctx.beginPath();
		ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);	
    	ctx.fillStyle = this.color;
		ctx.strokeStyle = this.darkerColor;
		ctx.lineWidth = 8;
		ctx.stroke();
    	ctx.fill();
		ctx.closePath();
	};
}


// Implementation
let ballArray = [];

function init() {
	ballArray = [];

	for (let i = 0; i < ballCount; i++) {
		let radius = randomIntFromRange(30, 60);
		let random = randomIntFromRange(0, colors.length - 1);
		let x = randomIntFromRange(radius, canvas.width - radius);
		let y = randomIntFromRange(3, canvas.height - radius);
		let dx = randomIntFromRange(-3, 3)
		let dy = randomIntFromRange(-2, 2)
	    ballArray.push(new Ball(x, y, dx, dy, radius, colors[random], darkerColors[random]));
	}
}

function resolveImpulses(object, otherObject) {
	let angle = direction(object.x, object.y, otherObject.x, otherObject.y);
	let distance = (dist(object.x, object.y, otherObject.x, otherObject.y) - object.radius - otherObject.radius);
	let impulseX = Math.sin(angle) * distance / 2;
	let impulseY = Math.cos(angle) * distance / 2;
	object.dx -= impulseX;
	object.dy -= impulseY;
	object.x -= impulseX;
	object.y -= impulseY;
	otherObject.dx += impulseX;
	otherObject.dy += impulseY;
	otherObject.x += impulseX;
	otherObject.y += impulseY;
}

// Swaps out two colliding objects' x and y velocities after running through
// an elastic collision reaction equation
function resolveCollision(object, otherObject) {
    const xVelocityDiff = object.dx - otherObject.dx;
    const yVelocityDiff = object.dy - otherObject.dy;
    const xDist = otherObject.x - object.x;
    const yDist = otherObject.y - object.y;
    // Prevent accidental overlap of objects
    if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) {
        // Grab angle between the two colliding objects
        const angle = -Math.atan2(otherObject.y - object.y, otherObject.x - object.x);
        // Store mass in letiable for better readability in collision equation
        const m1 = object.radius ** 2;
        const m2 = otherObject.radius ** 2;
        // Velocity before equation
        const u1 = rotate(object.dx, object.dy, angle);
        const u2 = rotate(otherObject.dx, otherObject.dy, angle);
        // Velocity after 1d collision equation
        const v1 = {x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2), y: u1.y};
        const v2 = {x: u2.x * (m1 - m2) / (m1 + m2) + u1.x * 2 * m2 / (m1 + m2), y: u2.y};
        // Final velocity after rotating axis back to original location
        const vFinal1 = rotate(v1.x, v1.y, -angle);
        const vFinal2 = rotate(v2.x, v2.y, -angle);
        // Swap object velocities for realistic bounce effect
        object.dx = (vFinal1.x * 0.9);
        object.dy = (vFinal1.y * 0.9);
        otherObject.dx = (vFinal2.x * 0.9);
        otherObject.dy = (vFinal2.y * 0.9);
    }
};

// Animation Loop
function animate() {
	requestAnimationFrame(animate);

	ctx.clearRect(0, 0, canvas.width, canvas.height);

	for (let k = 0; k < iterations; k++) {
		for (let i = 0; i < ballArray.length; i++) {
		ballArray[i].update();
	} 
	for (let i = 0; i < ballArray.length; i++) {
	  for (let j = i; j < ballArray.length; j++) {
	      if (i === j) continue;
	      let ball1 = ballArray[i];
	      let ball2 = ballArray[j];
	      let distance = dist(ball1.x, ball1.y, ball2.x, ball2.y);
	      if (distance < ball1.radius + ball2.radius) {
	        // resolve colllisions
	        resolveImpulses(ball1, ball2);
	        resolveCollision(ball1, ball2);
	      }
	  }
	}
	}
	for (let i = 0; i < ballArray.length; i++) {
		ballArray[i].draw();
	} 
}

init();

document.getElementById("ballCount").addEventListener("input", function(event) {
	ballCount = parseInt(this.value);
	document.getElementById("ballCount-text").textContent = "Balls: " + parseInt(this.value);
});

document.getElementById("gravity").addEventListener("input", function(event) {
	gravity = parseInt(this.value) / 100;
	document.getElementById("gravity-text").textContent = "Gravity: " + parseInt(this.value) + "%";
});

document.getElementById("wind").addEventListener("input", function(event) {
	wind = parseInt(this.value) / 100;
	document.getElementById("wind-text").textContent = "Wind: " + parseInt(this.value) + "%";
});

document.getElementById("iterations").addEventListener("input", function(event) {
	iterations = parseInt(this.value);
	document.getElementById("iterations-text").textContent = "iterations: " + parseInt(this.value);
});

document.getElementById("friction").addEventListener("input", function(event) {
	friction = parseInt(this.value) / 100;
	document.getElementById("friction-text").textContent = "Friction: " + parseInt(this.value) + "%";
});

let sliders = document.getElementsByClassName("slider");
	for (let i = 0; i < sliders.length; i++) {
		sliders[i].addEventListener("input", function() {
			this.style.background = "linear-gradient(to right, #FF1D00 0%, #FF1D00 " + map(this.value, this.min, this.max, 0, 100) + "%, #7F0E00 " + map(this.value, this.min, this.max, 0, 100) + "%, #7F0E00 100%)";
		});
		sliders[i].dispatchEvent(new CustomEvent("input"));
	}