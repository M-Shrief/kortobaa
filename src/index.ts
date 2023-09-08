import "reflect-metadata";
import App from "./app";
// Databases
import "./db";
import "./redis";
// Routes
import { PoetRoute } from "./components/poet/poet.route";
import { PoemRoute } from "./components/poem/poem.route";
import { PartnerRoute } from "./components/partner/partner.route";

const app = new App([new PoetRoute(), new PoemRoute(), new PartnerRoute()]);

export default app.listen();
