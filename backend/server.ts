import { log } from "console";
import { Request, Response } from "express";
import { connect } from "http2";
import mysql, { ConnectionOptions } from 'mysql2'

const express = require("express");
const app = express();
const cors = require("cors");
require('dotenv').config()

//middleware
app.use(cors())
app.use(express.json())

//connect to mySQL server
const access: ConnectionOptions = {
  host: `${process.env.host_DB}`,
  user: `${process.env.user_DB}`,
  password: `${process.env.password}`,
  database: `${process.env.DB_name}`,
};

const conn = mysql.createPool(access)
conn.getConnection((err,con) => {
  if ( err ){
    console.log(err);
  } else {
    console.log(`connect to ${access.database} susessfully`);
  }
})

module.exports = conn


// app.get("/", (req: Request, res: Response) => {
//   res.send("Hello world");
// });

//route
const routeURL = require("../backend/routes/route")
app.use("/api", routeURL)

//server port
const port = process.env.PORT|| 8080;
app.listen(port, () => {
  console.log(`Server is running at port:${port}`);
});