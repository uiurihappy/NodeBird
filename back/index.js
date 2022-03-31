"use strict";
exports.__esModule = true;
var express = require("express");
var app = express();
var prod = process.env.NODE_ENV === "production";
//port 변수 설정
app.set("port", prod ? process.env.PORT : 3065);
app.get("/", function (req, res, next) {
    res.send("react nodebird server...");
});
// 개발용 port
app.listen(app.get("port"), function () {
    console.log("server running on ".concat(app.get("port")));
});
