import * as express from "express";
import { Request, Response, NextFunction, Application } from "express";

const app = express();
const prod: boolean = process.env.NODE_ENV === "production";

//port 변수 설정
app.set("port", prod ? process.env.PORT : 3065);

app.get("/", (req, res, next) => {
  res.send("react nodebird server...");
});

// 개발용 port
app.listen(app.get("port"), () => {
  console.log(`server running on ${app.get("port")}`);
});
