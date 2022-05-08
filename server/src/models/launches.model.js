const launchesData = require("./launches.mongo");
// const launches = new Map();

const defaultLaunch = [
  {
    flightNumber: 100,
    mission: "kepler Exploration X",
    rocket: "Explorer IS1",
    launchDate: new Date("september 30,2025"),
    target: "Kepler-452 b",
    customers: ["you", "me"],
    upcoming: true,
    success: true,
  },
  {
    flightNumber: 101,
    mission: "kepler Exploration Y",
    rocket: "Explorer IS3",
    launchDate: new Date("October 30,2035"),
    target: "Kepler-296 A",
    customers: ["you", "me"],
    upcoming: true,
    success: true,
  },
];

insertLaches(defaultLaunch);

// launches.set(lastFlightNumber, launch);

async function existsLaunchWithId(launchId) {
  return await launchesData.findOne({
    flightNumber: launchId,
  });
}

async function getAllLaunches() {
  return await launchesData.find({}, "-_id -__v");
}

async function insertLaches(newLaunch) {
  try {
    let newMission = 0;
    for await (let launch of newLaunch) {
      const response = await launchesData.updateOne(
        { flightNumber: launch.flightNumber },
        launch,
        { upsert: true }
      );
      if (response.upsertedCount !== 0 || response.modifiedCount !== 0) {
        newMission++;
      }
    }
    newMission
      ? console.log(`updated ${newMission} mission`)
      : console.log("no mission updated");
  } catch (err) {
    console.error(err);
  }
}

async function findTheLastFlightNum() {
  const response = await launchesData.findOne().sort({ flightNumber: "desc" });
  return response.flightNumber;
}

async function createNewLaunches(launch) {
  let lastFlightNumber = await findTheLastFlightNum();
  // return launches.set(
  //   lastFlightNumber,
  //   Object.assign(launch, {
  //     flightNumber: lastFlightNumber,
  //     customers: ["you", "me"],
  //     upcoming: true,
  //     success: true,
  //   })
  // );

  const newLaunch = new launchesData(launch);
  newLaunch.set({
    flightNumber: lastFlightNumber + 1,
    customers: ["you", "me"],
    upcoming: true,
    success: true,
  });
  return await newLaunch.save();
}

async function abortLaunchById(launchId) {
  const abortMission = await launchesData
    .findOneAndUpdate(
      { flightNumber: launchId },
      { upcoming: false, success: false },
      { new: true }
    )
    .select({ __v: 0, _id: 0 });
  return abortMission;
}

module.exports = {
  getAllLaunches,
  createNewLaunches,
  abortLaunchById,
  existsLaunchWithId,
};
