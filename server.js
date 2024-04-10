const {consola} = require("consola");
const express = require("express");
const Port = 3000;
const app = express();
const server = require("http").createServer(app);

const fs = require("fs");

const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post("/", (req, res) => {
  console.log("create");
  return res.send(["a", "n"]);
});

app.get("/", (req, res) => {
  console.log("inquery");
  return res.send("OK");
});

server.listen(Port, (req, res) => {
    consola.success({ message: `server is starting on http://localhost:${Port}/graphql`, badge: true });
});
