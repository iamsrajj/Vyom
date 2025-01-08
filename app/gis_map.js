

      document.addEventListener("DOMContentLoaded", function () {
    const user_id = sessionStorage.getItem("user_id");
    const polygon_id = sessionStorage.getItem("polygon_id");
    
    const loadingOverlay = document.getElementById("loading-overlay");

    if (user_id && polygon_id) {
        // Show the loading overlay
        loadingOverlay.style.display = "flex";
        // console.log("Loading overlay displayed.");

        const refFormData = new FormData();
        refFormData.append("user_id", user_id);
        refFormData.append("polygon_id", polygon_id);

        fetch(`https://api.novosedge.xyz:4433/gis/raw`, {
            method: "POST",
            body: refFormData,
        })
        .then((response) => {
            if (response.ok) {
                return response.json();
            } else {
                throw new Error(`Error: ${response.status} - ${response.statusText}`);
            }
        })
        .then((data) => {
            // console.log("Reference list fetched:", data);
            localStorage.setItem("gisdata", JSON.stringify(data));
            
            // Hide the loading overlay once data is fetched
            loadingOverlay.style.display = "none";
            // console.log("Loading overlay hidden after data received.");
        })
        .catch((error) => {
            console.error("Failed to fetch reference list:", error);
            
            // Hide the loading overlay in case of an error
            loadingOverlay.style.display = "none";
            console.log("Loading overlay hidden after error.");
        });
    } else {
        // console.log("User ID or Polygon ID missing.");
    }
});





