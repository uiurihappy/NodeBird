import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import expressSession from "express-session";
import dotenv from "dotenv";
import passport from "passport";
import hpp from "hpp";
import helmet from "helmet";
import swaggerOptions from "./swagger";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import { sequelize } from "./models";
import userRouter from "./routes/user";
import postRouter from "./routes/post";

// import postsRouter from "./routes/posts";
// import hashtagRouter from "./routes/hashtag";

dotenv.config();
const app = express();
const prod: boolean = process.env.NODE_ENV === "production";
const specs = swaggerJsDoc(swaggerOptions);

sequelize
  .sync({ force: false })
  .then(() => {
    console.log("데이터베이스 연결 성공");
  })
  .catch((err: Error) => {
    console.error(err);
  });

app.set("port", prod ? process.env.PORT : 3065);

app.use("/api", swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

if (prod) {
  app.use(hpp());
  app.use(helmet());
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
      secure: false, // https -> true
      domain: prod ? ".nodebird.com" : undefined,
    },
    name: "ybcha",
  })
);

app.use(passport.initialize());
app.use(passport.session());
app.use("/user", userRouter);
app.use("/post", postRouter);

// app.use("/posts", postsRouter);
// app.use("/hashtag", hashtagRouter);

app.get("/", (req, res, next) => {
  res.send("react nodebird 백엔드 정상 동작!");
});

app.listen(app.get("port"), () => {
  console.log(`server is running on ${app.get("port")}`);
});
