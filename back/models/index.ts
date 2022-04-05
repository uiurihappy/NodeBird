import User, { associate as associateUser } from "./user";
import Comment, { associate as associateComment } from "./comment";
import HashTag, { associate as associateHashTag } from "./comment";
import Image, { associate as associateImage } from "./comment";
import Post, { associate as associatePost } from "./comment";

export * from "./sequelize";
//git test
const db = {
  User,
  Comment,
  HashTag,
  Image,
  Post,
};

export type dbType = typeof db;

associateUser(db);
associateComment(db);
associateHashTag(db);
associateImage(db);
associatePost(db);
