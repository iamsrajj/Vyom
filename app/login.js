loginForm.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent the default form submission

    const formData = new FormData(loginForm);

    loginUser(formData);
});

function loginUser(formData) {
    fetch("https://api.novosedge.xyz:4433/gis/party/signin", {
        method: "POST",
        body: formData,
    })
    .then((response) => {
        if (response.ok) {
            return response.json(); // Parse JSON response
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    })
    .then((data) => {
        console.log("Login successful:", data);
        localStorage.setItem("userData", JSON.stringify(data));
        const u_code = data.gisParty[0].ref_code; // Extract u_code instead of ref_code
        console.log("User code:", u_code);

        // Call the next API with the u_code
        fetchRefList(u_code); // Pass u_code to the next API call
    })
    .catch((error) => {
        console.error("Login failed:", error);
        handleLoginError(error);
    });
}

function fetchRefList(u_code) {
    // Create form data to pass the user code (u_code)
    const refFormData = new FormData();
    refFormData.append("u_code", u_code); // Pass u_code in the request
 

    fetch(`https://api.novosedge.xyz:4433/gis/reflist`, {
        method: "POST",
        body: refFormData, // Send u_code in the body
    })
    .then((response) => {
        if (response.ok) {
            return response.json(); // Parse JSON response
        } else {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
    })
    .then((dataa) => {
        console.log("Reference list fetched:", dataa);
         localStorage.setItem("ref_data", JSON.stringify(dataa));
  
        redirectToDiseasePage();
    })
    .catch((error) => {
        console.error("Failed to fetch reference list:", error);
        alert("Failed to retrieve reference list. Please try again later.");
    });
}

function redirectToDiseasePage() {
    // Redirect to disease page with user ID
    window.location.href = `../html/inroll_device.html`;
}

function handleLoginError(error) {
    let errorMessage = "Failed to login. Please try again later.";
    if (error.message.includes("401")) {
        errorMessage = "Invalid username or password. Please try again.";
    } else if (error.message.includes("500")) {
        errorMessage = "Server error occurred. Please try again later.";
    } else if (error.message.includes("405")) {
        errorMessage = "Server error occurred. Please try again later.";
    }
    alert(errorMessage);
}
