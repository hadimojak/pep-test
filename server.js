const { consola } = require("consola");
const express = require("express");
const Port = 3000;
const app = express();
const server = require("http").createServer(app);
const { Sequelize, DataTypes, Model, Op } = require("sequelize");
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
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    y: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: Sequelize.NOW,
    },
  },
  {
    sequelize: sequelize,
    freezeTableName: true,
    modelName: "square",
    timestamps: false,
  }
);

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.post("/", async (req, res) => {
  let count = 0;
  const { main: mainSquare, input } = req.body;
  const squareWidth = [+mainSquare.x, +mainSquare.x + +mainSquare.width];
  const squareHeight = [+mainSquare.y, +mainSquare.y + +mainSquare.height];

  const validSquareArray = input.filter((val) => {
    if (val.x > squareWidth[1] || val.y > squareHeight[1]) return false;
    if (val.x < squareWidth[1] && val.x > squareWidth[0]) return true;
    if (val.y < squareHeight[1] && val.y > squareHeight[0]) return true;
    if (val.x < squareWidth[0] && val.width > squareWidth[0]) return true;
    if (val.y < squareHeight[0] && val.height > squareHeight[0]) return true;
    if (val.x < squareWidth[0] && val.width < squareWidth[0]) return false;
    if (val.y < squareHeight[0] && val.height < squareHeight[0]) return false;
  });

  if (validSquareArray.length) {
    for (const item of validSquareArray) {
      await Square.create({ x: item.x, y: item.y, width: item.width, height: item.height }).then(() => {
        count = count + 1;
      });
    }
  }
  return res.send(`${count} number of square added to db`);
});
app.get("/", async (req, res) => {
  const squares = await Square.findAll();
  return res.send(
    squares.map(function (item) {
      return item["dataValues"];
    })
  );
});

//connect to db
sequelize
  .sync({ alter: true })
  .then(() => {
    console.log("db connected");
  })
  .then(() => {
    server.listen(Port, () => {
      consola.success({ message: `server is starting on http://localhost:${Port}`, badge: true });
    });
  })
  .catch((err) => {
    console.log(err);
  });
