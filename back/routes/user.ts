import * as express from "express";
import { isLoggedIn, isNotLoggedIn } from "./middleware";
import User from "../models/user";
import * as bcrypt from "bcrypt";
import * as passport from "passport";
import Post from "../models/post";
const router = express.Router();

router.get("/", isLoggedIn, (req, res) => {
  const user = req.user!.toJSON() as User;
  delete user.password;
  return res.json(user);
});

router.post("/", async (req, res, next) => {
  try {
    const exUser = await User.findOne({
      where: {
        userId: req.body.userId,
      },
    });
    // 중복 아이디 검증
    if (exUser) {
      return res.status(403).send("이미 사용중인 아이디입니다.");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12);
    const newUser = await User.create({
      nickname: req.body.nickname,
      userId: req.body.userId,
      password: req.body.password,
    });
    return res.status(200).json(newUser);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

router.post("/login", isNotLoggedIn, (req, res, next) => {
  passport.authenticate(
    "local",
    (err: Error, user: User, info: { message: string }) => {
      if (err) {
        console.error(err);
        return next(err);
      }
      if (info) {
        return res.status(401).send(info.message);
      }
      return req.login(user, async (loginErr: Error) => {
        try {
          if (loginErr) {
            return next(loginErr);
          }
          const fullUser = await User.findOne({
            where: { id: user.id },
            include: [
              {
                model: Post,
                as: "Posts",
                attributes: ["id"],
              },
              {
                model: User,
                as: "Followings",
                attributes: ["id"],
              },
              {
                model: User,
                as: "Followers",
                attributes: ["id"],
              },
            ],
            attributes: {
              exclude: ["password"],
            },
          });
          return res.json(fullUser);
        } catch (err) {
          console.error(err);
          return next(err);
        }
      });
    }
  )(req, res, next);
});

router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session!.destroy(() => {
    res.send("로그아웃 성공");
  });
});
