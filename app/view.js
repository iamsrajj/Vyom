document.addEventListener("DOMContentLoaded", function () {
    const gisdata = localStorage.getItem("gisdata");
    const toggleButton = document.getElementById('drawer-toggle');
    const drawer = document.getElementById('right-drawer');

    const polygonNameElement = document.getElementById('polygon-name-value');
    const phoneElement = document.getElementById('phone-value');
    const villageElement = document.getElementById('village-value');
    const polygonName1Element = document.getElementById('polygon-name'); // Same ID reused
    const polygonArea1Element = document.getElementById('polygon-area-value'); // Same ID reused
    const cropNameElement = document.getElementById('crop-name-value');
    const sowingDateElement = document.getElementById('sowing-date-value');
    const planTypeElement = document.getElementById('plan-type-value');
    const planDurationElement = document.getElementById('plan-duration-value');
    
    let calendarInstance = null; // Global variable to hold flatpickr instance
    let user_id = null; // Global user_id variable
   
    let polygon_id = null; // Global polygon_id variable
    let latestObservationDate = null; // Global latest observation date
    let index = "NDVI"; // Always reset index to "NDVI" on page load

    const loadingOverlay = document.getElementById("loading-overlay"); // Reference to loading overlay
    const mapElement = document.getElementById("map"); // Reference to the map container

    







    // Dropdown select event listener to update the index
    const indexSelect = document.getElementById('index-select');
    if (indexSelect) {
        indexSelect.addEventListener('change', function(event) {
            let selectedIndex = event.target.value.toUpperCase(); // Convert selected value to uppercase
            console.log("Dropdown selected value:", selectedIndex); // Debugging log

            index = selectedIndex; // Dynamically set index to the uppercase selected value
            console.log("Updated index:", index); // Debugging log

            // Call googleMap with updated index if latestObservationDate is available
            if (latestObservationDate) {
                googleMap(user_id, polygon_id, latestObservationDate, index); // Call googleMap with updated index
            }
        });
    }


const name = sessionStorage.getItem('name');
const phone = sessionStorage.getItem('phone');
const village = sessionStorage.getItem('village');
const polygon_name = sessionStorage.getItem('polygon_name');
const polygonArea = sessionStorage.getItem('polygon_area');
const cropName = sessionStorage.getItem('crop_name');
const sowingDate = sessionStorage.getItem('sowing_date');
const planType = sessionStorage.getItem('plan_type');
const planDuration = sessionStorage.getItem('plan_dur');
   


   // Ensure all required elements are present
   if (
    !drawer ||  !toggleButton ||  !polygonNameElement ||  !polygonArea1Element ||  !phoneElement || 
    !villageElement ||  !polygonName1Element ||  !cropNameElement ||  !sowingDateElement || !planTypeElement ||  !planDurationElement || 
    !loadingOverlay) {
    console.error("One or more elements not found in the DOM.");
    return;
}

// Update polygonNameElement with the name from sessionStorage
if (name) {
    polygonNameElement.textContent = name;
    phoneElement.textContent = phone;
    villageElement.textContent = village;
    polygonName1Element.textContent = polygon_name;
    polygonArea1Element.textContent = polygonArea;
    cropNameElement.textContent = cropName;
    sowingDateElement.textContent = sowingDate;
    planTypeElement.textContent = planType;
    planDurationElement.textContent = planDuration;

} else {
    console.warn("Polygon name not found in sessionStorage.");
}

// Toggle drawer and load polygon data
toggleButton.addEventListener('click', function () {
    drawer.classList.toggle('active');
    // polygonNameElement.textContent = name || "No name available"; // Fallback text if name is not set
});


    if (gisdata) {
        const gis = JSON.parse(gisdata);
        const userIdElement = document.getElementById('village');
        if (userIdElement) {
            // userIdElement.textContent = gis.farmList[0].village || "N/A";
        }

        user_id = gis.farmRaw.user_id;
        polygon_id = gis.farmRaw.polygon_id;
    
      

        const validObservations = gis.farmRaw.raw_data[0].sources[0].valid_observations || [];

        if (Array.isArray(validObservations) && validObservations.length > 0) {
            latestObservationDate = validObservations[validObservations.length - 1];
            setupFlatpickr(validObservations, latestObservationDate); // Initialize calendar with latest date as default

            // Reset the index to "NDVI" and initialize googleMap on page load
            index = "NDVI";
            googleMap(user_id, polygon_id, latestObservationDate, index);
        } else {
            console.log("No valid observations found");
        }

        const calendarButton = document.getElementById('calendar-button');
        if (calendarButton) {
            calendarButton.addEventListener('click', function(event) {
                event.stopPropagation(); // Prevent event bubbling
                if (calendarInstance) {
                    if (calendarInstance.isOpen) {
                        calendarInstance.close(); // Close if open
                    } else {
                        calendarInstance.open(); // Open if closed
                    }
                }
            });
        }
    } else {
        console.log("No user data found.");
    }

    function setupFlatpickr(validDates, defaultDate) {
        const selectedDateElement = document.getElementById('selected-date');

        // Display the latest observation date initially
        selectedDateElement.textContent = formatDate(new Date(defaultDate));

        calendarInstance = flatpickr("#calendar-button", {
            dateFormat: "Y-m-d",
            defaultDate: defaultDate, // Set the latest observation date as the default
            enable: validDates.map(date => {
                return { from: date, to: date }; // Only highlight valid observation dates
            }),
            clickOpens: false, // Prevent automatic open/close behavior
            onChange: function(selectedDates) {
                if (selectedDates.length > 0) {
                    const selectedDate = selectedDates[0];
                    selectedDateElement.textContent = formatDate(selectedDate); // Display selected date in span

                    latestObservationDate = formatDate(selectedDate, true); // Pass true for 'yy-mm-dd' format
                    googleMap(user_id, polygon_id, latestObservationDate, index); // Fetch updated data with the selected date
                }
            },
            onDayCreate: function(dObj, dStr, fp, dayElem) {
                const today = new Date();
                const isToday = (
                    dayElem.dateObj.getDate() === today.getDate() &&
                    dayElem.dateObj.getMonth() === today.getMonth() &&
                    dayElem.dateObj.getFullYear() === today.getFullYear()
                );
                if (isToday) {
                    dayElem.classList.remove("today");
                }
            }
        });
    }

    function formatDate(date, shortFormat = false) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = shortFormat ? String(date.getFullYear()).slice() : date.getFullYear();

        return `${year}-${month}-${day}`;
    }

    function googleMap(user_id, polygon_id, latestObservationDate, index) {
        function delay(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }

        const maxRetries = 10;

        async function fetchIndexData() {
            const refFormData = new FormData();
            refFormData.append("user_id", user_id);
            refFormData.append("polygon_id", polygon_id);
            refFormData.append("date", latestObservationDate);
            refFormData.append("index", index);
            console.log("user_id:", user_id);
            console.log("polygon_id:", polygon_id);
            console.log("latestObservationDate:", latestObservationDate);
            console.log("index:", index);

            for (let retryCount = 0; retryCount < maxRetries; retryCount++) {
                try {
                    // Show loading overlay
                    loadingOverlay.style.display = "flex";

                    const response = await fetch(`https://api.novosedge.xyz:4433/gis/index`, {
                        method: "POST",
                        body: refFormData,
                    });

                    if (!response.ok) {
                        throw new Error(`Error: ${response.status} - ${response.statusText}`);
                    }

                    const data = await response.json();
                    const status = data.farmIndex.obs.status;
                    console.log("Index data fetched:", status);

                    if (status === "completed") {
                        console.log("Status is 'completed'. Updating map.");
                        localStorage.setItem("map", JSON.stringify(data));
                       


                        // Update the map with the new data
                        updateMap(data);

                        // Hide loading overlay
                        loadingOverlay.style.display = "none";

                        break;
                    } else if (status === "created" || status === "rendering") {
                        console.log(`Status is 'created' or 'rendering', retrying in 3 seconds... (Attempt ${retryCount + 1} of ${maxRetries})`);
                        await delay(3000);
                    } else {
                        console.log("No data found", status);

                        // Hide loading overlay if status is not valid
                        loadingOverlay.style.display = "none";
                        break;
                    }
                } catch (error) {
                    // console.error("Failed to fetch index data:", error);
                    // Hide loading overlay on error
                    loadingOverlay.style.display = "none";
                    break;
                }

                if (retryCount === maxRetries - 1) {
                    console.log("Max retry attempts reached. Data not available.");
                    // Hide loading overlay on max retry
                    loadingOverlay.style.display = "none";
                }
            }
        }

        if (latestObservationDate && index) {
            fetchIndexData();
        } else {
            console.log("Latest Observation Date or Index missing.");
        }
    }

    function updateMap(data) {
        // Clear the map container
        while (mapElement.firstChild) {
            mapElement.removeChild(mapElement.firstChild);
        }

        // Check if the data contains valid content
        if (!data || !data.farmIndex || !data.farmIndex.obs || !data.farmIndex.obs.product || data.farmIndex.obs.product.length === 0) {
            // Display 'No Data Available' message
            const noDataMessage = document.createElement("div");
            noDataMessage.textContent = "No Data Available";
            noDataMessage.style.textAlign = "center";
            noDataMessage.style.padding = "20px";
            noDataMessage.style.color = "red";
            mapElement.appendChild(noDataMessage);
            return; // Exit the function early since there is no data
        }

        // If data is available, render it (replace with actual rendering logic)
        const mapData = document.createElement("div");
        mapData.textContent = "Map updated with new data: " + JSON.stringify(data.farmIndex.obs.product[1]);
        mapElement.appendChild(mapData);
    }
});
