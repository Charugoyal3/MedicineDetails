var express = require("express");
var mongoose = require("mongoose");
var app = express();
var User = require("./models/user");
var passport = require("passport");
var bodyParser = require("body-parser");
var LocalStrategy = require("passport-local");
var passportLocalMongoose = require("passport-local-mongoose");
mongoose.connect("mongodb://localhost/medalife");

app.use(
    require("express-session")({
        secret: "medaShare seceret page",
        resave: false,
        saveUninitialized: false
    })
);

app.set("view engine", "ejs");
// To initialize a passport
app.use(passport.initialize());
app.use(passport.session());

app.use(
    bodyParser.urlencoded({
        extended: true
    })
);

passport.use(new LocalStrategy(User.authenticate()));

//encoded and decoded
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ROUTES
//===========================
//Index route
app.get("/", function (req, res) {

    res.render("home");
});

//Secret route
app.get("/secret", isLoggedIn, function (req, res) {

    res.render("secret");
});

//Auth route
app.get("/signup", function (req, res) {
    res.render("signup");
});

app.post("/signup", function (req, res) {
    req.body.username;
    req.body.password;
    User.register(
        new User({
            username: req.body.username
        }),
        req.body.password,
        function (err, user) {
            if (err) {
                console.log(err);
                return res.render("signup");
            }
            passport.authenticate("local")(req, res, function () {
                res.redirect("/secret");
            });
        }
    );
});

//login routes

app.get("/login", function (req, res) {

    res.render("login");
});

//middleware

app.post(
    "/login/create-session",
    passport.authenticate("local", {
        successRedirect: "/secret",
        failureRedirect: "/login"
    }),
    function (req, res) {

    }
);

//logout
app.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});

//Secret page dont open anytime

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/login");
}

app.listen(8000, function () {
    console.log("Server has started");
});