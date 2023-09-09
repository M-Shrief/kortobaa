import "reflect-metadata";
import App from "./app";
// Databases
import "./db";
import "./redis";
// Routes
import { UserRoute } from "./components/user/user.route";
import { ProductRoute } from "./components/product/product.route";

const app = new App([new UserRoute(), new ProductRoute()]);

export default app.listen();
