"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var mysql2_1 = require("mysql2");
var express = require("express");
var app = express();
var cors = require("cors");
require('dotenv').config();
//middleware
app.use(cors());
app.use(express.json());
//connect to mySQL server
var access = {
    host: "".concat(process.env.host_DB),
    user: "".concat(process.env.user_DB),
    password: "".concat(process.env.password),
    database: "".concat(process.env.DB_name),
};
var conn = mysql2_1.default.createPool(access);
conn.getConnection(function (err, con) {
    if (err) {
        console.log(err);
    }
    else {
        console.log("connect to ".concat(access.database, " susessfully"));
    }
});
module.exports = conn;
// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello world");
// });
//route
var routeURL = require("../routes/route");
app.use("/api", routeURL);
//server port
var port = process.env.PORT || 8080;
app.listen(port, function () {
    console.log("Server is running at port:".concat(port));
});
