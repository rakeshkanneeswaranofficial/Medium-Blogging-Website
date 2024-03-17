"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hono_1 = require("hono");
var user_1 = require("./route/user");
var blog_1 = require("./route/blog");
var cors_1 = require("hono/cors");
var app = new hono_1.Hono();
app.use('/*', (0, cors_1.cors)());
//all reqeuests comming to /api/v1/user will go to userRouter
app.route("/api/v1/user", user_1.userRouter);
// //all reqeuests comming to /api/v1/blog will go to blogRoute
app.route("/api/v1/blog", blog_1.blogRouter);
exports.default = app;
