document.addEventListener("DOMContentLoaded", function () {
    // const toggleButton = document.getElementById('drawer-toggle');
    // const drawer = document.getElementById('right-drawer');
    // const polygonNameElement = document.getElementById('polygon-name-value');
    // const polygonNameElement1 = document.getElementById('polygon-area-value');
    const demoContainer = document.getElementById('tiles-demo-container');
    const updateMapButton = document.getElementById('update-map-button');
    const loadingOverlay = document.getElementById("loading-overlay");

    // Helper function to convert square meters to acres
    function convertSquareMetersToAcres(squareMeters) {
        return (squareMeters * 0.000247105).toFixed(2); // Convert and round to 2 decimal places
    }

    // // Fallback if elements are missing
    // if (!drawer || !toggleButton || !polygonNameElement || !polygonNameElement1 || !loadingOverlay) {
    //     console.error("One or more elements not found in the DOM.");
    //     return;
    // }

    // // Toggle drawer and load polygon data
    // toggleButton.addEventListener('click', function () {
    //     drawer.classList.toggle('active');
    //     if (drawer.classList.contains('active')) {
    //         const gisRefData = localStorage.getItem("ref_data");
            
       
          
    //         if (gisRefData) {
    //             const user = JSON.parse(gisRefData);
    //             polygonNameElement.textContent = user.farmList[1].polygon_name;
    //             polygonNameElement1.textContent = convertSquareMetersToAcres(user.farmList[0].polygon_area);
    //             console.log(gisRefData);
    //         } else {
    //             polygonNameElement.textContent = "N/A";
    //             polygonNameElement1.textContent = "N/A";
    //             console.warn("No ref_data found in localStorage.");
    //         }
    //     }
    // });

    // Load and display map data
    function updateMapData() {
        const gisMap = localStorage.getItem("map");
      
        if (!gisMap) {
            console.log("No map data found in localStorage.");
            return;
        }

        const userMap = JSON.parse(gisMap);
        const statistics = userMap.farmIndex.obs.result.statistics || "N/A";
        if (statistics === "N/A") return;
        

        // Show the loading overlay while fetching data
        loadingOverlay.style.display = "flex"; // Use flex to show the overlay

        fetch(statistics)
            .then(response => response.json())
            .then(data => {
                const percentiles = data.percentiles;
                let tilesDemoLink = userMap.farmIndex.obs.result.tiles_demo || "N/A";
                if (tilesDemoLink === "N/A") return;

                tilesDemoLink  = tilesDemoLink
                .replace(/min_value%3D[0-9.]+/, "min_value%3D" + percentiles["10.0"])  // Dynamically replace min_value with the 10.0 percentile
                .replace(/max_value%3D[0-9.]+/, "max_value%3D" + percentiles["90.0"]); // Dynamically replace max_value with the 90.0 percentile
                demoContainer.innerHTML = ''; // Clear previous content
                demoContainer.style.cssText = 'position: relative; width: 100vw; height: 100vh; overflow: hidden';

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
                const scale = userMap.farmIndex.obs.product[1];
                const imageSource = scaleImages[scale] || '../assets/img/ndvi_scale.jpg';

                const leftImage = document.createElement('img');
                leftImage.src = imageSource;
                leftImage.style.cssText = 'position: absolute; bottom: 20px; left: 20px; width: 130px; margin-bottom: 100px; z-index: 10';

                const iframe = document.createElement('iframe');
                iframe.src = tilesDemoLink;
                iframe.style.cssText = 'width: 100%; height: 540px; border: none; position: absolute; top: 0; left: 0; z-index: 1';

                demoContainer.appendChild(iframe);
                demoContainer.appendChild(leftImage);

                // Hide the loading overlay once data is loaded
                loadingOverlay.style.display = "none";
            })
            .catch(error => {
                console.error("Error in GET request:", error);
                loadingOverlay.style.display = "none"; // Hide the overlay on error
            });
    }

    // Initial map data load
    updateMapData();

    // Map data update on button click
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
