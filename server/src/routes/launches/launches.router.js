const express = require('express');
const {httpGetAllLaunches,httpCreateNewLaunches,httpAbortLaunch} = require('./launches.controller')

const launchesRouter = express.Router()


launchesRouter.get("/",httpGetAllLaunches)


launchesRouter.post('/', httpCreateNewLaunches);

launchesRouter.delete('/:id',httpAbortLaunch)


module.exports =launchesRouter
