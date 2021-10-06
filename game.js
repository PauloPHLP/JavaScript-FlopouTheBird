// Select Canvas
const cvs = document.getElementById('main-canvas');
const ctx = cvs.getContext('2d');

// Game variables and constants
let frames = 0;
const DEGREE = Math.PI / 180;

// Loading sounds.
const SCORE = new Audio();
SCORE.src = 'audio/audio_sfx_point.wav';

const FLAP = new Audio();
FLAP.src = 'audio/audio_sfx_flap.wav';

const HIT = new Audio();
HIT.src = 'audio/audio_sfx_hit.wav';

const SWOOSHING = new Audio();
SWOOSHING.src = 'audio/audio_sfx_swooshing.wav';

const DIE = new Audio();
DIE.src = 'audio/audio_sfx_die.wav';

// Game state.
const state = {
	current: 0,
	getReady: 0,
	game: 1,
	over: 2,
};

// Start button coordinates.
const startBtn = {
	x: 120,
	y: 263,
	w: 83,
	h: 29,
};

// Loads sprite image.
const sprite = new Image();
sprite.src = 'images/sprite.png';

// Controls the game.
cvs.addEventListener('click', function (event) {
	switch (state.current) {
		case state.getReady:
			state.current = state.game;
			SWOOSHING.play();
			break;

		case state.game:
			bird.flap();
			FLAP.play();
			break;

		case state.over:
			let rect = cvs.getBoundingClientRect();
			let clickX = event.clientX - rect.left;
			let clickY = event.clientY - rect.top;

			// Check if Start button was clicked.
			if (
				clickX >= startBtn.x &&
				clickX < startBtn.x + startBtn.w &&
				clickY >= startBtn.y &&
				clickY <= startBtn.y + startBtn.h
			) {
				pipes.reset();
				bird.speedReset();
				score.reset();

				state.current = state.getReady;
			}

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

	dx: 2,

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

	update: function () {
		if (state.current === state.game) {
			this.x = (this.x - this.dx) % (this.w / 2);
		}
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

	radius: 12,

	frame: 0,

	gravity: 0.25,
	jump: 4.6,
	speed: 0,
	rotation: 0,

	draw: function () {
		let bird = this.animation[this.frame];

		ctx.save();
		ctx.translate(this.x, this.y);
		ctx.rotate(this.rotation);

		ctx.drawImage(
			sprite,
			bird.sX,
			bird.sY,
			this.w,
			this.h,
			-this.w / 2,
			-this.h / 2,
			this.w,
			this.h
		);

		ctx.restore();
	},

	flap: function () {
		this.speed = -this.jump;
	},

	update: function () {
		// If the game state is Get Ready, the bird must flap slowly.
		this.period = state.current === state.getReady ? 10 : 5;

		// Increment the frame by one each period.
		this.frame += frames % this.period === 0 ? 1 : 0;

		// Frame goes from 0 to 4, then again to 0.
		this.frame = this.frame % this.animation.length;

		if (state.current === state.getReady) {
			// Reset position of the bird after the game is over.
			this.y = 150;

			this.rotation = 0 * DEGREE;
		} else {
			this.speed += this.gravity;
			this.y += this.speed;

			if (this.y + this.h / 2 >= cvs.height - foreground.h) {
				this.y = cvs.height - foreground.h - this.h / 2;

				if (state.current === state.game) {
					state.current = state.over;
					DIE.play();
				}
			}

			// If the speed is greater than the jump, means that the bird is falling down.
			if (this.speed >= this.jump) {
				this.rotation = 90 * DEGREE;
				this.frame = 1;
			} else {
				this.rotation = -25 * DEGREE;
			}
		}
	},

	speedReset: function () {
		this.speed = 0;
	},
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

// Pipes
const pipes = {
	position: [],
	top: {
		sX: 553,
		sY: 0,
	},
	bottom: {
		sX: 502,
		sY: 0,
	},
	w: 53,
	h: 400,
	gap: 85,
	maxYPos: -150,
	dx: 2,

	draw: function () {
		for (let i = 0; i < this.position.length; i++) {
			let p = this.position[i];

			let topYPos = p.y;
			let bottomYPos = p.y + this.h + this.gap;

			// Top pipe
			ctx.drawImage(
				sprite,
				this.top.sX,
				this.top.sY,
				this.w,
				this.h,
				p.x,
				topYPos,
				this.w,
				this.h
			);

			// Bottom pipe
			ctx.drawImage(
				sprite,
				this.bottom.sX,
				this.bottom.sY,
				this.w,
				this.h,
				p.x,
				bottomYPos,
				this.w,
				this.h
			);
		}
	},

	update: function () {
		if (state.current !== state.game) return;

		if (frames % 100 === 0) {
			this.position.push({
				x: cvs.width,
				y: this.maxYPos * (Math.random() + 1),
			});
		}

		for (let i = 0; i < this.position.length; i++) {
			let p = this.position[i];

			let bottomPipeYPos = p.y + this.h + this.gap;

			// Collision detection for the top pipe.
			if (
				bird.x + bird.radius > p.x &&
				bird.x - bird.radius < p.x + this.w &&
				bird.y + bird.radius > p.y &&
				bird.y - bird.radius < p.y + this.h
			) {
				state.current = state.over;
				HIT.play();
			}

			// Collision detection for the bottom pipe.
			if (
				bird.x + bird.radius > p.x &&
				bird.x - bird.radius < p.x + this.w &&
				bird.y + bird.radius > bottomPipeYPos &&
				bird.y - bird.radius < bottomPipeYPos + this.h
			) {
				state.current = state.over;
				HIT.play();
			}

			// Move the pipes to the left.
			p.x -= this.dx;

			// If pipes goes beyond the canvas, delete it from the positions list.
			if (p.x + this.w <= 0) {
				this.position.shift();
				score.value += 1;

				score.best = Math.max(score.value, score.best);
				localStorage.setItem('best', score.best);

				SCORE.play();
			}
		}
	},

	reset: function () {
		this.position = [];
	},
};

// Score.
const score = {
	best: parseInt(localStorage.getItem('best')) || 0,
	value: 0,

	draw: function () {
		ctx.fillStyle = '#ffffff';
		ctx.strokeStyle = '#000000';

		if (state.current === state.game) {
			ctx.lineWidth = 2;
			ctx.font = '35px Teko';

			ctx.fillText(this.value, cvs.width / 2, 50);
			ctx.strokeText(this.value, cvs.width / 2, 50);
		} else if (state.current === state.over) {
			// Score value.
			ctx.font = '25px Teko';

			ctx.fillText(this.value, 225, 186);
			ctx.strokeText(this.value, 225, 186);

			// Best score.
			ctx.fillText(this.best, 225, 228);
			ctx.strokeText(this.best, 225, 228);
		}
	},

	reset: function () {
		this.value = 0;
	},
};

// Draw elements on the Canvas.
function draw() {
	ctx.fillStyle = '#70c5ce';
	ctx.fillRect(0, 0, cvs.clientWidth, cvs.height);

	background.draw();
	pipes.draw();
	foreground.draw();
	bird.draw();
	getReady.draw();
	gameOver.draw();
	score.draw();
}

// Update elements positions on the Canvas.
function update() {
	bird.update();
	foreground.update();
	pipes.update();
}

// Calls all funcitions in loop.
function loop() {
	update();
	draw();

	frames++;

	requestAnimationFrame(loop);
}

loop();
