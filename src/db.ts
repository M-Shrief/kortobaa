import { DataSource } from "typeorm";
// Config
import { DB } from "./config";
// Entities
import { User } from "./components/user/user.entity";
import { Product } from "./components/product/product.entity";
// Utils
import { logger } from "./utils/logger";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: DB.host,
  port: Number(DB.port),
  username: DB.user,
  password: DB.password,
  database: DB.name,
  ssl: DB.ca
    ? {
        rejectUnauthorized: false,
        ca: DB.ca,
      }
    : false,
  synchronize: true,
  logging: true,
  entities: [User, Product],
  migrations: [],
  subscribers: [],
});

const connectDB = async () => {
  try {
    await AppDataSource.initialize();
    logger.info(`Connected To MySQL database correctly, Host: ${DB.host}`);
  } catch (error) {
    logger.error("Failed to connect to database. \n",  error);
    process.exit(1);
  }
};

connectDB();

// If the Node process ends, close the Mongoose connection
process.on("SIGINT", async () => {
  await AppDataSource.destroy().catch((err) => logger.error(`${err}`));
  logger.info(
    "MySQL default connection disconnected through app termination",
  );

  process.exit(0);
});
