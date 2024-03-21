const express = require("express");
const path = require("path");
//start the server
const http = require("http");
const cors = require("cors");

// connect to mongo db
require("./db/mongoConnect");
// start routes
const {routesInit} = require("./routes/configRoutes")

const app = express();

app.use(cors())

// post and update
app.use(express.json());
// directory for static files and open to the public
app.use(express.static(path.join(__dirname,"public")));

// start app for routes
routesInit(app);

// start server
const server = http.createServer(app);
server.listen(3001);
