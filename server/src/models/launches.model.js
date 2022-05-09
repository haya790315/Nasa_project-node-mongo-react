const launchesData = require("./launches.mongo");
const axios = require("axios");
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

// insertLaunches(defaultLaunch);

// launches.set(lastFlightNumber, launch);

const SPACE_X_URL = "https://api.spacexdata.com/v4/launches/query";

async function checkDataUpdated() {
  const lastLaunch = await axios.get(
    "https://api.spacexdata.com/v4/launches/latest"
  );

  const lastLaunchNumber = lastLaunch.data["flight_number"];

  const lastDataIsUpdated = await launchesData.findOne({
    flightNumber: lastLaunchNumber,
  });
  return lastDataIsUpdated ? true : false;
}

async function loadLaunchData() {
  if (await checkDataUpdated())
    return console.log("No new launches data to update");
  try {
    const response = await axios.post(SPACE_X_URL, {
      query: {},
      options: {
        pagination: false,
        select: ["flight_number", "name", "date_utc", "upcoming", "success"],
        populate: [
          {
            path: "rocket",
            select: "name",
          },
          { path: "payloads", select: "customs" },
        ],
      },
    });
    const launchDocs = response.data.docs;
    let newMission = 0;

    for await (const launchDoc of launchDocs) {
      const payloads = launchDoc["payloads"];
      const customers = payloads.flatMap((payload) => payload["customers"]);
      const launch = {
        flightNumber: launchDoc["flight_number"],
        mission: launchDoc["name"],
        rocket: launchDoc["rocket"]["name"],
        launchDate: launchDoc["date_utc"],
        upcoming: launchDoc["upcoming"],
        success: launchDoc["success"],
        customers,
      };
      const res = await launchesData.updateOne(
        { flightNumber: launch.flightNumber },
        launch,
        { upsert: true }
      );
      if (res.upsertedCount !== 0 || res.modifiedCount !== 0) {
        newMission++;
      }
    }
    console.log(`${newMission} mission updated`);
  } catch (err) {
    console.error(err);
  }
}

async function findLaunch(filter) {
  return await launchesData.findOne(filter);
}

async function existsLaunchWithId(launchId) {
  return await findLaunch({
    flightNumber: launchId,
  });
}

async function getAllLaunches(skip,limit) {


  return await launchesData.find({}, "-_id -__v").sort({flightNumber:-1}).skip(skip).limit(limit)
  
  ;
}

// customer launches Insert function
async function insertLaunches(newLaunch) {
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
  loadLaunchData,
};
