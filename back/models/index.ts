import User, { associate as associateUser } from "./user";

export * from "./sequelize";
//git test
const db = {
  User,
};

export type dbType = typeof db;
