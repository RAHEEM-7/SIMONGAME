const butCol = ["red", "blue", "green", "yellow"];
let gamePatt = [];
let userPatt = [];
let started = false;
let lvl = 1;
let i = 0;

$(document).keydown(function (e) {
	const code = e.keyCode;
	if (code == 13 && !started) {
		$("#level-title").text("Level " + lvl);
		setTimeout(function () {}, 200);
		nextSequence();
		started = true;
	}
	else if (started) {
		if (code == 87) {
			// w
			play("green");
		} else if (code == 68) {
			// d
			play("yellow");
		} else if (code == 79) {
			// o
			play("red");
		} else if (code == 75) {
			// k
			play("blue");
		}
	}
});

$(".bton").click(function () {
	if (started) {
		let userChosenColor = $(this).attr("id");
		play(userChosenColor);
	}
});

function play(userChosenColor) {
	userPatt.push(userChosenColor);
	playSound(userChosenColor);
	animateOnPress(userChosenColor);

	if (gamePatt.length === 0) {
		gameOver();
		return;
	}

	if (userPatt[i] === gamePatt[i]) {
		if (i === gamePatt.length - 1) {
			lvl++;
			userPatt = [];
			$("#level-title").text("Level " + lvl);
			setTimeout(function () {
				nextSequence();
			}, 1000);
			i = 0;
		} else i++;
	} else {
		gameOver();
	}
}

function nextSequence() {
	const randNum = Math.floor(4 * Math.random());
	const randCol = butCol[randNum];

	gamePatt.push(randCol);
	setTimeout(function () {}, 300);
	$("#" + randCol)
		.fadeIn(100)
		.fadeOut(100)
		.fadeIn(100);
	playSound(randCol);
}

function playSound(name) {
	const audio = new Audio("sounds/" + name + ".mp3");
	audio.play();
}

function animateOnPress(name) {
	$("#" + name).addClass("pressed");
	setTimeout(function () {
		$("#" + name).removeClass("pressed");
	}, 100);
}

function gameOver() {
	$("#level-title").text("Game Over, Press Enter Key to Start");
	$("body").addClass("game-over");
	playSound("wrong");
	setTimeout(function () {
		$("body").removeClass("game-over");
	}, 500);
	i = 0;
	started = false;
	gamePatt = [];
	userPatt = [];

	axios
		.post("/api/add", {
			score: lvl,
			date: new Date()
		})
		.then((response) => {
			console.log(response);
		})
		.catch((error) => {
			console.log(error);
		});

	lvl = 1;
}

// $('#reg').click( () => {
// 	const username = document.getElementById('user').value;
// 	const password = document.getElementById('pasw').value;
// 	axios
// 		.post("/register", {
// 			username: username,
// 			password: password
// 		})
// 		.then((response) => {
// 			console.log(response);
// 		})
// 		.catch((error) => {
// 			// if(error)
// 			//   document.getElementById('present').innerHTML = "Already Present";
// 		});
// });

const registerUser = () => {
	const username = document.getElementById('user').value;
	const password = document.getElementById('pasw').value;
	axios
		.post("/register", {
			username: username,
			password: password
		})
		.then((response) => {
			window.location.href = "/game";
		})
		.catch((error) => {
			document.getElementById('present').innerHTML = "Already Present";
		});
};