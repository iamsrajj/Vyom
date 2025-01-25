document.addEventListener("DOMContentLoaded", () => {
  const loadData = () => {
    const data = localStorage.getItem("data");
    console.log(data);

    if (data) {
      const parsedData = JSON.parse(data);
      console.log("parsedata", parsedData);

      const dev = parsedData.devList[0] || {};

      const getRoundedValue = (value) =>
        value ? Math.round(value * 100) / 100 : "N/A";

      document.getElementById("atm_temp").textContent = getRoundedValue(dev.atm_temp);
      document.getElementById("atm_pressure").textContent = getRoundedValue(dev.atm_pressure);
      document.getElementById("atm_humid").textContent = getRoundedValue(dev.atm_humid);
      document.getElementById("wind_spped").textContent = getRoundedValue(dev.wind_spped);
      document.getElementById("wind_dir").textContent = dev.wind_dir || "N/A";
      document.getElementById("rain").textContent = dev.rain || "N/A";
      document.getElementById("leaf").textContent = getRoundedValue(dev.leaf);
      document.getElementById("lux").textContent = getRoundedValue(dev.lux);
      document.getElementById("uv").textContent = getRoundedValue(dev.uv);
      document.getElementById("s_temp").textContent = getRoundedValue(dev.s_temp);
      document.getElementById("s_hum").textContent = getRoundedValue(dev.s_hum);
      document.getElementById("u_temp").textContent = getRoundedValue(dev.u_temp);
      document.getElementById("u_moist").textContent = getRoundedValue(dev.u_moist);
      document.getElementById("u_con").textContent = getRoundedValue(dev.u_con);
      document.getElementById("u_ph").textContent = getRoundedValue(dev.u_ph);
      document.getElementById("nitrogen").textContent = getRoundedValue(dev.nitrogen);
      document.getElementById("phosphorus").textContent = getRoundedValue(dev.phosphorus);
      document.getElementById("potassium").textContent = getRoundedValue(dev.potassium);
      document.getElementById("date_time").textContent = dev.date_time || "N/A";
    } else {
      console.error("No data found in localStorage.");
      document.getElementById("data-container").textContent =
        "No data available. Please try again.";
    }
  };

  // Load data initially
  loadData();

  // Reload data every 15 minutes (900000 milliseconds)
  setInterval(() => {
    loadData(); // Update data
    location.reload(); // Reload the page
  }, 300000);

  console.log("done");
});
