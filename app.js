const {User} = require("./database");
const express = require("express");
const app = express();
const cors = require("cors");
const passport = require("passport");
const port = process.env.PORT || 3000;
const session = require("express-session");
require("dotenv").config();

app.set("view engine", "ejs");
// app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

// app.set("trust proxy", 1);
app.use(session({
  secret: process.env.SESSION_SECRET_KEY,
  resave: false,
  saveUninitialized: false,
	cookie: {
		// secure: true,
		maxAge: 1000 * 60 * 60 * 1 // 1 hour
	}
}));

app.use(passport.initialize());
app.use(passport.session());

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
  res.render("dashboard");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", (req, res) => {
	// Convenience method to register a new user instance with a given password. Checks if username is unique
	User.register({username: req.body.username}, req.body.password, (err, user) => {
		if(err) {
			console.log(err.message);
			// Tell the user that the username is already taken
			res.status(400).end();
		}
		else {
			passport.authenticate("local")(req, res, () => {
				res.send("Successfully registered");
			});
		}
	});
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", passport.authenticate("local", { failureRedirect: "/" }), (req, res) => {
	// console.log(req.user)
	res.redirect("/game");
});

app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

app.get("/game", (req, res) => {
	if(req.isAuthenticated()) {
		res.render("game");
	}
	else {
		res.redirect("/login");
	}
});

app.get("/rules", (req, res) => {
	if(req.isAuthenticated()) {
		res.render("rules");
	}
	else {
		res.redirect("/login");
	}
});

app.get("/lvl", (req, res) => {
	if(req.isAuthenticated()) {
		// Try a better method
		User.findByUsername(req.user.username, (err, user) => {
			// Get scores from database
			if(err) {
				console.log(err);
			}
			else {
				res.render("lvl", {
					scores: user.scores
				});
			}
		});
	}
	else {
		res.redirect("/login");
	}
});

app.get("/leaderboard", (req, res) => {
	if(req.isAuthenticated()) {
		const arr = [];
		User.find({}, (err, users) => {
			users.map(user => {
				let maxScore = 0;
				user.scores.map(scr => {
					if(scr.score > maxScore)
						maxScore = scr.score;
				});
				arr.push({mx: maxScore, usr: user.username});
			});
			arr.sort((a, b) => b.mx - a.mx); // Sort by max score in reverse order
			res.render("leaderboard", {data: arr});
		});
	}
	else {
		res.redirect("/login");
	}
});

app.get("/api/name", (req, res) => {
	if(req.isAuthenticated()) {
		res.json({username: req.user.username});
	}
	else {
		res.redirect("/login");
	}
});

app.post("/api/add", (req, res) => {
	if(req.isAuthenticated()) {
		// Add score to database
		const score = req.body.score;
		const date = req.body.date;
		User.findByUsername(req.user.username, (err, user) => {
			if(err) {
				console.log(err);
			}
			else {
				user.scores.push({score: score, date: date});
				user.save();
			}
		});
	}
	else {
		res.redirect("/login");
	}
});

app.listen(port, function(){
  console.log("Server started on port " + port);
});
