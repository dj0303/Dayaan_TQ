import { DataTypes } from "sequelize";
import User from "./user.js"
import Item from "./item.js"
import sequelize from "../db.js";

const Transaction = sequelize.define(
  "Transaction",
  {
    TID: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    UID: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "Users",
        key: "UID",
      },
    },
    IID: {
      type: DataTypes.INTEGER,
      references: {
        model: "Items",
        key: "IID",
      },
    },
    AMOUNT: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    QUANTITY: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  },
  {
    timestamps: false, 
  }
);


User.hasMany(Transaction, { foreignKey: "UID" });
Transaction.belongsTo(User, { foreignKey: "UID" });

Item.hasMany(Transaction, { foreignKey: "IID" });
Transaction.belongsTo(Item, { foreignKey: "IID" });

export default Transaction