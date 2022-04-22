const express = require("express");
const appRoutes = express();

const allRoutes=require("../src/core_app/routes")


appRoutes.use("/v1", allRoutes)

module.exports = appRoutes;
