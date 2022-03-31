import * as express from "express";
import { Request, Response, NextFunction, Application } from "express";
import * as morgan from "morgan";
import * as cors from "cors";
import * as cookieParser from "cookie-parser";
import * as expressSession from "express-session";
import * as dotenv from "dotenv";
import * as passport from "passport";
import * as hpp from "hpp";
import * as helmet from "helmet";
// import * as passportLocal from "passport-local";

dotenv.config();
const app = express();
const prod: boolean = process.env.NODE_ENV === "production";

//port 변수 설정
app.set("port", prod ? process.env.PORT : 3065);

if (prod) {
  app.use(hpp());
  //app.use(helmet());
  app.use(morgan("combined"));
  app.use(
    cors({
      origin: /nodebird\.com$/,
      credentials: true,
    })
  );
} else {
  app.use(morgan("dev"));
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );
}

app.use("/", express.static("uploads"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(
  expressSession({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET!,
    cookie: {
      httpOnly: true,
      secure: false,
      domain: prod ? ".nodebird.com" : undefined, //false 대신 undefined
    },
    name: "ybcha",
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res, next) => {
  res.send("react nodebird server...");
});

// 개발용 port
app.listen(app.get("port"), () => {
  console.log(`server running on ${app.get("port")}`);
});
