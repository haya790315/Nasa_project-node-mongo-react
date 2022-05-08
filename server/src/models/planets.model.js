const { parse } = require("csv-parse");
const path = require("path");
const fs = require("fs");
const planets = require("./planets.mongo");

const habitablePlanets = [];

function isHabitablePlanet(planet) {
  return (
    planet["koi_disposition"] === "CONFIRMED" &&
    planet["koi_insol"] > 0.36 &&
    planet["koi_insol"] < 1.11 &&
    planet["koi_prad"] < 1.6
  );
}

async function getAllPlanets() {
  return await planets.find({}, "keplerName -_id");
}



async function savePlanets(data) {
  try {
    await planets.updateOne(
      {
        keplerName: data.kepler_name,
      },
      { keplerName: data.kepler_name },
      {
        upsert: true,
      }
    );
    console.log(`${data["kepler_name"]} planets found!`);
  } catch (err) {
    console.error(`can't save planet ${err}`);
  }
}

function loadPlanetsData() {
  return new Promise((resolve, reject) => {
    fs.createReadStream(path.join(__dirname, "../data/kepler_data.csv"))
      .pipe(
        parse({
          comment: "#",
          columns: true,
        })
      )
      .on("data", (data) => {
        if (isHabitablePlanet(data)) {
          savePlanets(data);
        }
      })
      .on("error", (err) => {
        console.log(err);
        reject(err);
      })
      .on("end", async () => {
        const planetNumber =(await getAllPlanets()).length;
        console.log(`${planetNumber} planets found!`);
        resolve();
      });
  });
}


module.exports = {
  loadPlanetsData,
  getAllPlanets,
};
