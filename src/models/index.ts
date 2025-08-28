import { sequelize } from "../config/db";
import { User } from "./users";



export {sequelize, User}

// // definisi User
// export const User = sequelize.define("User", {
//   username: { type: DataTypes.STRING, unique: true, allowNull: false },
//   email: { type: DataTypes.STRING, unique: true, allowNull: false },
// });

// // definisi Product
// export const Product = sequelize.define("Product", {
//   name: { type: DataTypes.STRING, allowNull: false },
//   price: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
//   stock: { type: DataTypes.INTEGER, defaultValue: 0 },
// });

