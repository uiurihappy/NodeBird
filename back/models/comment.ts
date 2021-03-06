import { DataTypes, Model } from "sequelize";
import { sequelize } from "./sequelize";
import { dbType } from "./index";

class Comment extends Model {
  public readonly id!: number;
  public comment!: string;
  public readonly createAt!: Date;
  public readonly updateAt!: Date;
}
Comment.init(
  {
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: "Comment",
    tableName: "comment",
    charset: "utf8",
    collate: "utf8_general_ci",
  }
);

export const associate = (db: dbType) => {};
export default Comment;
