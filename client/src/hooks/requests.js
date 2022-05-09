// TODO: Once API is ready.
// Load planets and return as JSON.
const urlApi = process.env.URL || "http://localhost:8000/v1";

async function httpGetPlanets() {
  const response = await fetch(`${urlApi}/planets`);
  const data = await response.json();
  return data;
}

// TODO: Once API is ready.
// Load launches, sort by flight number, and return as JSON.
async function httpGetLaunches() {
  const response = await fetch(`${urlApi}/launches`);
  const data = await response.json();
  return data.sort(function (a, b) {
    return a.flightNumber - b.flightNumber;
  });
}

async function httpSubmitLaunch(launch) {
  try {
    return await fetch(`${urlApi}/launches`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(launch),
    });
  } catch (err) {
    console.error(err);
    return {
      ok: false,
    };
  }
}

// TODO: Once API is ready.
// Delete launch with given ID.
async function httpAbortLaunch(id) {
  try {
    return await fetch(`${urlApi}/launches/${id}`, {
      method: "delete",
    });
  } catch (err) {
    console.log(err);
    return {
      ok: false,
    };
  }
}

export { httpGetPlanets, httpGetLaunches, httpSubmitLaunch, httpAbortLaunch };
