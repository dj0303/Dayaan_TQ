import { DataTypes } from "sequelize";
import sequelize from "../db.js";
import bcrypt from "bcrypt";

const User = sequelize.define(
  "User",
  {
    UID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    USERNAME: {
      type: DataTypes.STRING,
      unique: true,
      allowNull: false,
    },
    PASSWORD_HASH: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    WALLET_BAL: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
    },
  },
  {
    timestamps: false, 
    hooks: {
      beforeCreate: async (user) => {
        if (user.PASSWORD_HASH) {
          user.PASSWORD_HASH = await bcrypt.hash(user.PASSWORD_HASH, 10);
        }
      },
      beforeUpdate: async (user) => {
        if (user.changed("PASSWORD_HASH")) {
          user.PASSWORD_HASH = await bcrypt.hash(user.PASSWORD_HASH, 10);
        }
      },
    },
  }
);

User.prototype.validPassword = async function (password) {
  return await bcrypt.compare(password, this.PASSWORD_HASH);
};

export default User;
