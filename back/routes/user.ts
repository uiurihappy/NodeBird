import * as express from "express";
import { isLoggedIn, isNotLoggedIn } from "./middleware";
import User from "../models/user";
import * as bcrypt from "bcrypt";
import * as passport from "passport";
import Post from "../models/post";
import Image from "../models/image";
const router = express.Router();

// 로그인 여부
router.get("/", isLoggedIn, (req, res) => {
  const user = req.user!.toJSON() as User;
  delete user.password;
  return res.json(user);
});

// 회원가입
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

// 로그인
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

// 로그아웃
router.post("/logout", isLoggedIn, (req, res) => {
  req.logout();
  req.session!.destroy(() => {
    res.send("로그아웃 성공");
  });
});

interface IUser extends User {
  PostCount: number;
  FollowingCount: number;
  FollowerCount: number;
}

// 유저 조회
router.get("/:id", async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { id: parseInt(req.params.id, 10) },
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
      attributes: ["id", "nickname"],
    });
    if (!user) {
      return res.status(404).send("no user");
    }
    const jsonUser = user.toJSON() as IUser;
    jsonUser.PostCount = jsonUser.Posts ? jsonUser.Posts.length : 0;
    jsonUser.FollowingCount = jsonUser.Followings
      ? jsonUser.Followings.length
      : 0;
    jsonUser.FollowerCount = jsonUser.Followers ? jsonUser.Followers.length : 0;
    return res.json(jsonUser);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

// 팔로잉 조회
router.get<any, any, any, { limit: string; offset: string }>(
  "/:id/followers",
  isLoggedIn,
  async (req, res, next) => {
    try {
      const user = await User.findOne({
        where: {
          id: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
        },
      });
      if (!user) return res.status(404).send("no user");

      const followers = await user.getFollowers({
        attributes: ["id", "nickname"],
        limit: parseInt(req.query.limit, 10),
        offset: parseInt(req.query.offset, 10),
      });
      return res.json(followers);
    } catch (err) {
      console.error(err);
      return next(err);
    }
  }
);

router.post("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const me = await User.findOne({
      where: {
        id: req.user!.id,
      },
    });
    await me!.addFollowing(parseInt(req.params.id, 10));
    res.send(req.params.id);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.delete("/:id/follow", isLoggedIn, async (req, res, next) => {
  try {
    const me = await User.findOne({
      where: {
        id: req.user!.id,
      },
    });
    await me!.removeFollowing(parseInt(req.params.id, 10));
    res.send(req.params.id);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.get("/:id/posts", async (req, res, next) => {
  try {
    const posts = await Post.findOne({
      where: {
        Userid: parseInt(req.params.id, 10) || (req.user && req.user.id) || 0,
        RetweetId: null,
      },
      include: [
        {
          model: User,
          attributes: ["id", "nickname"],
        },
        {
          model: Image,
        },
        {
          model: User,
          as: "Likers",
          attributes: ["id"],
        },
      ],
    });
    return res.json(posts);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

router.patch("/nickname", isLoggedIn, async (req, res, next) => {
  try {
    await User.update(
      {
        nickname: req.body.nickname,
      },
      {
        where: { id: req.user!.id },
      }
    );
    res.send(req.body.nickname);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

export default router;
