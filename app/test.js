document.addEventListener("DOMContentLoaded", function () {
    const demoContainer = document.getElementById('tiles-demo-container');
    const updateMapButton = document.getElementById('update-map-button');
    const loadingOverlay = document.getElementById("loading-overlay");

    // Create leftImage once and reuse it
    const leftImage = document.createElement('img');
    leftImage.style.cssText = 'position: absolute; bottom: 20px; left: 20px; width: 130px; margin-bottom: 100px; z-index: 10';
    demoContainer.appendChild(leftImage);

    // Scale images mapping
    const scaleImages = {
        "NDVI": '../assets/img/ndvi_scale.jpg',
        "NDREX": '../assets/img/ndrex_scale.jpg',
        "EVI": '../assets/img/evi_scale.jpg',
        "MSAVI2": '../assets/img/msavi2_scale.jpg',
        "SOC_VIS": '../assets/img/soc_vis_scale.jpg',
        "SOC_SWIR": '../assets/img/soc_swir_scale.jpg',
        "NDWI": '../assets/img/ndwi_scale.jpg',
        "NDMI": '../assets/img/ndmi_scale.jpg'
    };

    function updateMapData() {
        const gisMap = localStorage.getItem("map");
        if (!gisMap) {
            console.log("No map data found in localStorage.");
            return;
        }

        const userMap = JSON.parse(gisMap);
        const statistics = userMap.farmIndex.obs.result.statistics || "N/A";
        if (statistics === "N/A") return;

        // Show loading overlay
        loadingOverlay.style.display = "flex";

        fetch(statistics)
            .then(response => response.json())
            .then(data => {
                const percentiles = data.percentiles;
                let tilesDemoLink = userMap.farmIndex.obs.result.tiles_demo || "N/A";
                if (tilesDemoLink === "N/A") return;
                console.log("percent", percentiles);

                // Get the scale image
                const scale = userMap.farmIndex.obs.product[1];

                // Replace min_value and max_value dynamically
                if (tilesDemoLink.includes("min_value") && tilesDemoLink.includes("max_value")) {
                    let minValue = percentiles["10.0"];
                    let maxValue = percentiles["90.0"];

                    // Special handling for NDMI and NDWI
                    if (scale === "NDMI" || scale === "NDWI") {
                        minValue = percentiles["10.0"] || minValue;  // Use 5th percentile if available
                        maxValue = percentiles["90.0"] || maxValue; // Use 95th percentile if available
                    }

                    tilesDemoLink = tilesDemoLink
                        .replace(/min_value%3D[0-9.\-]+/, "min_value%3D" + minValue)
                        .replace(/max_value%3D[0-9.\-]+/, "max_value%3D" + maxValue);
                } else {
                    console.warn("min_value or max_value not found in tiles_demo URL, check its format.");
                }

                demoContainer.innerHTML = ''; // Clear previous content
                demoContainer.style.cssText = 'position: relative; width: 100vw; height: 100vh; overflow: hidden; margin-top: 12%;';
                console.log("demo", tilesDemoLink);

                if (scaleImages[scale]) {
                    leftImage.src = scaleImages[scale];
                    leftImage.style.display = "block"; // Show image
                } else {
                    if (!leftImage.src) {
                        leftImage.src = scaleImages["NDVI"]; // First time default to NDVI
                    } else {
                        leftImage.style.display = "none"; // Hide on next times
                    }
                }

                const iframe = document.createElement('iframe');
                iframe.src = tilesDemoLink;
                iframe.style.cssText = 'width: 100%; height: 540px; border: none; position: absolute; top: 0; left: 0; z-index: 1';

                demoContainer.appendChild(iframe);
                if (leftImage.style.display !== "none") {
                    demoContainer.appendChild(leftImage);
                }

                // Hide loading overlay
                loadingOverlay.style.display = "none";
            })
            .catch(error => {
                console.error("Error in GET request:", error);
                loadingOverlay.style.display = "none"; // Hide overlay on error
            });
    }

    // Initial map load
    updateMapData();

    // Manual map update
    updateMapButton.addEventListener('click', updateMapData);

    // Reload logic to run 3 times
    let reloadCount = localStorage.getItem("reloadCount") || 0;

    if (reloadCount < 2) {
        loadingOverlay.style.display = "flex";
        setTimeout(() => {
            reloadCount++;
            localStorage.setItem("reloadCount", reloadCount);
            location.reload();
        }, 3000); // You can increase this to 3000 or 5000 for smoother experience
    } else {
        localStorage.removeItem("reloadCount");
        loadingOverlay.style.display = "none";
    }
});
