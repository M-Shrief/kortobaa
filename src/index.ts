import "reflect-metadata";
import App from "./app";
import { container } from "tsyringe";
// Databases
import "./db";
import "./redis";
// Routes
import { UserRoute } from "./components/user/user.route";
import { ProductRoute } from "./components/product/product.route";

const app = new App([
    container.resolve(UserRoute),
    container.resolve(ProductRoute)
]);

export default app.listen();
