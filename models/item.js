import { DataTypes } from "sequelize";
import sequelize from "../db.js";

const Item = sequelize.define(
  "Item",
  {
    IID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    NAME: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    PRICE: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    STOCK: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false, 
  }
);

export default Item;
