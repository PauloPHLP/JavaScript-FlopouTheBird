// Select Canvas
const cvs = document.getElementById('main-canvas');
const ctx = cvs.getContext('2d');

// Game variables and constants
let frames = 0;

//Game state.
const state = {
	current: 0,
	getReady: 0,
	game: 1,
	over: 2,
};

// Loads sprite image.
const sprite = new Image();
sprite.src = 'images/sprite.png';

// Controls the game.
cvs.addEventListener('click', function (event) {
	switch (state.current) {
		case state.getReady:
			state.current = state.game;
			break;

		case state.game:
			bird.flap();
			break;

		case state.over:
			state.current = state.getReady;
			break;
	}
});

// Background images.
const background = {
	sX: 0,
	sY: 0,
	w: 275,
	h: 226,
	x: 0,
	y: cvs.height - 226,

	draw: function () {
		ctx.drawImage(
			sprite,
			this.sX,
			this.sY,
			this.w,
			this.h,
			this.x,
			this.y,
			this.w,
			this.h
		);

		ctx.drawImage(
			sprite,
			this.sX,
			this.sY,
			this.w,
			this.h,
			this.x + this.w,
			this.y,
			this.w,
			this.h
		);
	},
};

// Foreground images.
const foreground = {
	sX: 276,
	sY: 0,
	w: 224,
	h: 112,
	x: 0,
	y: cvs.height - 112,

	draw: function () {
		ctx.drawImage(
			sprite,
			this.sX,
			this.sY,
			this.w,
			this.h,
			this.x,
			this.y,
			this.w,
			this.h
		);

		ctx.drawImage(
			sprite,
			this.sX,
			this.sY,
			this.w,
			this.h,
			this.x + this.w,
			this.y,
			this.w,
			this.h
		);
	},
};

// Bird image.
const bird = {
	animation: [
		{ sX: 276, sY: 112 },
		{ sX: 276, sY: 139 },
		{ sX: 276, sY: 164 },
		{ sX: 276, sY: 139 },
	],

	x: 50,
	y: 150,
	w: 34,
	h: 26,

	frame: 0,

	draw: function () {
		let bird = this.animation[this.frame];

		ctx.drawImage(
			sprite,
			bird.sX,
			bird.sY,
			this.w,
			this.h,
			this.x - this.w / 2,
			this.y - this.h / 2,
			this.w,
			this.h
		);
	},

	flap: function () {},
};

// Get "Get Ready" message.
const getReady = {
	sX: 0,
	sY: 228,
	w: 173,
	h: 152,
	x: cvs.width / 2 - 173 / 2,
	y: 80,

	draw: function () {
		if (state.current === state.getReady) {
			ctx.drawImage(
				sprite,
				this.sX,
				this.sY,
				this.w,
				this.h,
				this.x,
				this.y,
				this.w,
				this.h
			);
		}
	},
};

// Get "Game Over" message.
const gameOver = {
	sX: 175,
	sY: 228,
	w: 225,
	h: 202,
	x: cvs.width / 2 - 225 / 2,
	y: 90,

	draw: function () {
		if (state.current === state.over) {
			ctx.drawImage(
				sprite,
				this.sX,
				this.sY,
				this.w,
				this.h,
				this.x,
				this.y,
				this.w,
				this.h
			);
		}
	},
};

// Draw elements on the Canvas.
function draw() {
	ctx.fillStyle = '#70c5ce';
	ctx.fillRect(0, 0, cvs.clientWidth, cvs.height);

	background.draw();
	foreground.draw();
	bird.draw();
	getReady.draw();
	gameOver.draw();
}

// Update elements positions on the Canvas.
function update() {}

// Calls all funcitions in loop.
function loop() {
	update();
	draw();

	frames++;

	requestAnimationFrame(loop);
}

loop();
