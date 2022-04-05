"use strict";
exports.__esModule = true;
var express = require("express");
var morgan = require("morgan");
var cors = require("cors");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var dotenv = require("dotenv");
var passport = require("passport");
var hpp = require("hpp");
// import * as passportLocal from "passport-local";
dotenv.config();
var app = express();
var prod = process.env.NODE_ENV === "production";
//port 변수 설정
app.set("port", prod ? process.env.PORT : 3065);
if (prod) {
    app.use(hpp());
    //app.use(helmet());
    app.use(morgan("combined"));
    app.use(cors({
        origin: /nodebird\.com$/,
        credentials: true
    }));
}
else {
    app.use(morgan("dev"));
    app.use(cors({
        origin: true,
        credentials: true
    }));
}
app.use("/", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
        domain: prod ? ".nodebird.com" : undefined
    },
    name: "ybcha"
}));
app.use(passport.initialize());
app.use(passport.session());
app.get("/", function (req, res, next) {
    res.send("react nodebird server...");
});
// 개발용 port
app.listen(app.get("port"), function () {
    console.log("server running on ".concat(app.get("port")));
});
