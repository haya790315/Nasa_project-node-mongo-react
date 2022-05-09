const {
  getAllLaunches,
  createNewLaunches,
  existsLaunchWithId,
  abortLaunchById,
} = require("../../models/launches.model");

async function httpGetAllLaunches(req, res) {
  const {page=1,limit=10} = req.query
  const skip = (Math.abs(page)-1) * Math.abs(limit)
  return res.status(200).json(await getAllLaunches(skip,limit));
}

function httpCreateNewLaunches(req, res) {
  const newLaunch = req.body;
  if (
    !(
      newLaunch.mission &&
      newLaunch.rocket &&
      newLaunch.launchDate &&
      newLaunch.target
    )
  ) {
    return res.status(400).json({ success: false, message: "invalid mission" });
  }

  newLaunch.launchDate = new Date(newLaunch.launchDate);
  if (isNaN(newLaunch.launchDate)) {
    return res.status(400).json({ success: false, message: "invalid date" });
  }

  createNewLaunches(newLaunch);
  return res.status(201).json(newLaunch);
}

async function httpAbortLaunch(req, res) {
  const launchId = +req.params.id;

  if ((await existsLaunchWithId(launchId)) === null) {
    return res.status(404).json({
      error: "Launch not found",
    });
  }

  const aborted = await abortLaunchById(launchId);

  return res.status(200).json(aborted);
}

module.exports = { httpGetAllLaunches, httpCreateNewLaunches, httpAbortLaunch };
