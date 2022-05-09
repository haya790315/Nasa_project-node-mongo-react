const http = require("http");
const app = require("./src/app");
const mongoose = require("mongoose");
require("dotenv").config();

const { loadPlanetsData } = require("./src/models/planets.model");
const {loadLaunchData} = require("./src/models/launches.model")
const port = process.env.PORT;
const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("server started");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});


(async function startServer() {
  await mongoose.connect(process.env.MONGODB_DATABASE_URL);
  await loadLaunchData()
  loadPlanetsData().then(() =>
    server.listen(port, console.log(`listening on port ${port}`))
  ).catch(err=>console.error(err));
})();
