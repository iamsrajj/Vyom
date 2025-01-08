document.addEventListener("DOMContentLoaded", function () {
    const userData = localStorage.getItem("ref_data");
    if (userData) {
        const user = JSON.parse(userData);
        const tableBody = document.getElementById('submitted_data');
        tableBody.innerHTML = '';
        console.log( "reff_data",user);

        function convertSquareMetersToAcres(squareMeters) {
            return squareMeters / 4046.85642;
        }
        function convertToDateFormat(dateStr) {
            return dateStr.length === 8 ? `${dateStr.slice(0, 4)}/${dateStr.slice(4, 6)}/${dateStr.slice(6)}` : "Invalid date format";
        }

        function calculateFutureDate(planDate, planDur) {
            const date = new Date(planDate);
            date.setDate(date.getDate() + +planDur);
            return date.toLocaleDateString('en-GB');
        }

        user.farmList.forEach((farm, index) => {
            const row = document.createElement('tr');

            const serialNumber = document.createElement('td');
            serialNumber.textContent = index + 1;
            row.appendChild(serialNumber);

            const farmName = document.createElement('td');
            farmName.textContent = farm.polygon_name || "N/A";
            row.appendChild(farmName);

            const plan = document.createElement('td');
            plan.textContent = farm.plan_type || "N/A";
            row.appendChild(plan);

            const farmArea = document.createElement('td');
            if (farm.polygon_area) {
                const areaInAcres = convertSquareMetersToAcres(farm.polygon_area);
                farmArea.textContent = areaInAcres.toFixed(2) + " acres";
            } else {
                farmArea.textContent = "N/A";
            }
            row.appendChild(farmArea);

            const expiry = document.createElement('td');
            if (farm.plan_datetime && farm.plan_dur) {
                const expiryDate = calculateFutureDate(farm.plan_datetime, farm.plan_dur);
                expiry.textContent = expiryDate;

                const viewButton = document.createElement('button');
                viewButton.textContent = "View";
                viewButton.classList.add("view-button");
                viewButton.onclick = function () {

                    if (farm.polygon_area) {
                        const areaInAcres = convertSquareMetersToAcres(farm.polygon_area);
                        farmArea.textContent = areaInAcres.toFixed(2) + " acres";
                         sessionStorage.setItem("polygon_area",  areaInAcres.toFixed(2) + " acres");

                    }
                    if (farm.plan_datetime && farm.plan_dur) {
                        const expiryDate = calculateFutureDate(farm.plan_datetime, farm.plan_dur);
                        expiry.textContent = expiryDate;
                        sessionStorage.setItem("plan_dur",  expiryDate);
                        
                    }
                    
                    if (farm.sowing_date) {
                        const sdate = convertToDateFormat(farm.sowing_date);
                         sessionStorage.setItem("sowing_date",  sdate);

                    }
                    
                    
                    



                    // Save user_id and polygon_id to sessionStorage
                    sessionStorage.setItem("user_id", farm.user_id);
                    sessionStorage.setItem("polygon_id", farm.polygon_id);
                    sessionStorage.setItem("name", farm.name);
                    sessionStorage.setItem("phone", farm.phone);
                    sessionStorage.setItem("village", farm.village);
                    sessionStorage.setItem("polygon_name", farm.polygon_name);
                    // sessionStorage.setItem("polygon_area", farm.polygon_area);
                    sessionStorage.setItem("crop_name", farm.crop_name);
                    // sessionStorage.setItem("sowing_date", farm.sowing_date);
                    sessionStorage.setItem("plan_type", farm.plan_type);
                    
                    // sessionStorage.setItem("plan_dur",  farm.plan_dur);


                

                    // Redirect to gis_farm page
                     window.location.href = `../html/gis_farm.html`;
                };

                expiry.appendChild(viewButton);
            } else {
                expiry.textContent = "N/A";
            }
            row.appendChild(expiry);
            tableBody.appendChild(row);
        });
    } else {
        console.log("No user data found.");
    }
});
