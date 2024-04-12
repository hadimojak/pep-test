const { consola } = require("consola");
const express = require("express");
const Port = 3000;
const app = express();
const server = require("http").createServer(app);
const { Sequelize, DataTypes, Model, Op } = require("sequelize");

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

const connection = {
  host: "localhost",
  dialect: "mysql",
  dialectOptions: {
    supportBigNumbers: true,
    bigNumberStrings: true,
    dateStrings: true,
    typeCast: true,
  },
};

const sequelize = new Sequelize("pep-test", "root", "1234", connection);

//define model
const Square = sequelize.define(
  "Square",
  {
    x: {
      type: DataTypes.NUMBER,
      allowNull: false,
    },
    y: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    width: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    height: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    createdAt: Sequelize.DATE,
    updatedAt: Sequelize.DATE,
  },
  {
    sequelize: sequelize,
    freezeTableName: true,
    modelName: "square",
  }
);

//connect to db
sequelize
  .sync({ alter: false })
  .then(() => {
    console.log("db connected");
  })
  .then(() => {
    server.listen(Port, () => {
      consola.success({ message: `server is starting on http://localhost:${Port}/graphql`, badge: true });
    });
  })
  .catch((err) => {
    console.log(err);
  });
