const express = require('express')


const api = express();

const planets = require('./planets/planets.router')
const launches = require('./launches/launches.router')

api.use("/planets",planets);
api.use("/launches",launches);


module.exports = api;