import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize";
import { dbType } from "./index";

class Hashtag extends Model {
  public id!: number;
  public name!: string;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
}
Hashtag.init(
  {
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Hashtag",
    tableName: "hashtag",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);
export const associate = (db: dbType) => {};
export default Hashtag;
