import { sequelize, User, Product } from "./models";

async function resetDatabase() {
  try {
    await sequelize.sync({ force: true });

    await User.bulkCreate([
      { username: "alice", email: "alice@example.com" },
      { username: "bob", email: "bob@example.com" },
    ]);

    await Product.bulkCreate([
      { name: "Laptop", price: 15000000, stock: 10 },
      { name: "Mouse", price: 150000, stock: 50 },
    ]);

    console.log("Database reset & seeded 🚀");
  } catch (err) {
    console.error(err);
  } finally {
    await sequelize.close();
  }
}

resetDatabase();
