document.addEventListener("DOMContentLoaded", function () {
  const userData = localStorage.getItem("userData");
  if (userData) {
    const user = JSON.parse(userData); // Parse user data

    // Assign user data to HTML elements
    document.getElementById("name").textContent =
      user.gisParty[0].name || "N/A";
    document.getElementById("email").textContent =
      user.gisParty[0].email || "N/A";
    document.getElementById("phone").textContent =
      user.gisParty[0].phone || "N/A";
    document.getElementById("ref_code").textContent =
      user.gisParty[0].ref_code || "N/A";

    // console.log("User Data:", user); // Log the user data
  } else {
    console.log("No user data found.");
  }

  // Add your existing profile icon click functionality here

  const refListData = JSON.parse(localStorage.getItem("refListData"));
  // Now you can use refListData as needed on this page

  document
    .getElementById("profile-icon")
    .addEventListener("click", function (event) {
      event.stopPropagation(); // Prevent the click event from bubbling up to the document
      const profileCard = document.getElementById("profile-card");
      profileCard.style.display =
        profileCard.style.display === "block" ? "none" : "block";
    });

  // Hide the profile card when clicking anywhere outside of it
  document.addEventListener("click", function (event) {
    const profileCard = document.getElementById("profile-card");
    const profileIcon = document.getElementById("profile-icon");

    // Check if the clicked target is not the profile card or the profile icon
    if (
      !profileCard.contains(event.target) &&
      !profileIcon.contains(event.target)
    ) {
      profileCard.style.display = "none"; // Hide the profile card
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("device").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default action (navigation)

    const userData = localStorage.getItem("userData");
    if (userData) {
      const user = JSON.parse(userData); // Parse user data
      const ref_code = user.gisParty[0]?.ref_code || "N/A"; // Safely access ref_code

      console.log("User Data Ref Code:", ref_code); // Log the user ref_code
      fetchDeviceData(ref_code); // Fetch device data using ref_code

      // Set interval to fetch the device data every 10 minutes (600000 ms)
      setInterval(() => {
        fetchDeviceData(ref_code);
      }, 600000); // 10 minutes in milliseconds
    } else {
      console.error("No user data found.");
      alert("No user data found. Please ensure you are logged in.");
    }

    function fetchDeviceData(ref_code) {
      // Construct API URL with ref_code
      const apiUrl = `https://api.novosedge.xyz:4433/ad/devmqtt?ref_code=${encodeURIComponent(
        ref_code
      )}`;

      fetch(apiUrl, {
        method: "GET",
      })
        .then((response) => {
          if (response.ok) {
            return response.json(); // Parse JSON response
          } else {
            throw new Error(
              `Error: ${response.status} - ${response.statusText}`
            );
          }
        })
        .then((data) => {
          console.log("Reference list fetched:", data);

          // Store the fetched data in localStorage, making sure it's updated each time
          localStorage.setItem("data", JSON.stringify(data));

          // Optionally, you can also redirect to Monitor.html or perform any other actions here
          window.location.href = `../html/Monitor.html`;
        })
        .catch((error) => {
          console.error("Failed to fetch reference list:", error);
          alert("Failed to retrieve reference list. Please try again later.");
        });
    }
  });
});
