const jsonServer = require("json-server");
const cors = require("cors");
const path = require("path");
const fs = require("fs");
const os = require("os");

fs.copyFile("db.json", os.tmpdir() + "/db.json", function (err) {
  if (err) console.log(err);
  else console.log("copy file succeed to" + os.tmpdir());
});

const server = jsonServer.create();
const middlewares = jsonServer.defaults({
  static: "./build",
  noCors: true,
});
const router = jsonServer.router(path.resolve(os.tmpdir() + "/db.json"));
const port = process.env.PORT || 5000;

server.use(cors());
server.use(middlewares);
server.use(
  jsonServer.rewriter({
    "/api/*": "/$1",
  })
);

server.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "*");
  next();
});

server.use(router);
server.listen(port, () => {
  console.log(`Server is running on ${port}`);
});

module.exports = server;
