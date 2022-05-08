const http = require("http");
const app = require("./app");
const mongoose = require("mongoose");

const { loadPlanetsData } = require("./models/planets.model");

const port = process.env.PORT || 8000;
const server = http.createServer(app);

mongoose.connection.once("open", () => {
  console.log("server started");
});

mongoose.connection.on("error", (err) => {
  console.error(err);
});


(async function startServer() {
  await mongoose.connect("mongodb://localhost:27017/NasaProject");

  loadPlanetsData().then(() =>
    server.listen(port, console.log(`listening on port ${port}`))
  ).catch(err=>console.error(err));
})();
