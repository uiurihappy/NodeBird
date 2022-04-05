import { Sequelize } from "sequelize";
import config from "../config/config";

//개발 환경 설정
const env =
  (process.env.NODE_ENV as "production" | "test" | "development") ||
  "development";
const { database, username, password } = config[env];
const sequelize = new Sequelize(database, username, password, config[env]);

export { sequelize };
//export default sequelize;
