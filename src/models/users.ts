
import { FIND_USER_BY_EMAIL, INSERT_USER } from "../queries/users";
import { DataTypes } from "sequelize";
import {sequelize} from "../config/db";

export const User = sequelize.define("User", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  firstname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lastname: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, 
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  token: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otp: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  otp_expired: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  verify: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  role: {
     type: DataTypes.ENUM("admin", "super_admin", "user"), 
    allowNull: false,
    defaultValue: "user"
  },
   createdAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: sequelize.literal("CURRENT_TIMESTAMP"),
    allowNull: false,
  }
}, {
  tableName: "users",   // nama tabel
  timestamps: true,     // otomatis buat createdAt & updatedAt
});
