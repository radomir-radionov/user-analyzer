"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./api/routes"));
/**
 * Create and configure an Express application.
 * @returns {Application} Configured Express application.
 */
const app = () => {
    const app = (0, express_1.default)();
    app.use(body_parser_1.default.json());
    app.get("/", (req, res) => {
        res.send("Hello, welcome to our server!");
    });
    app.use(routes_1.default);
    app.use((err, req, res, next) => {
        console.error(err.message);
        res.status(500).json({ error: "Internal Server Error" });
    });
    return app;
};
exports.default = app;
