import "reflect-metadata";
import App from "./app";
// Databases
import "./db";
import "./redis";
// Routes
import { UserRoute } from "./components/user/user.route";

const app = new App([new UserRoute()]);

export default app.listen();
