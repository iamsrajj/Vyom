document.addEventListener("DOMContentLoaded", function() {
    
    const userData = localStorage.getItem("userData");
    if (userData) {
        const user = JSON.parse(userData); // Parse user data
        
        // Assign user data to HTML elements
        document.getElementById('name').textContent = user.gisParty[0].name || "N/A";
        document.getElementById('email').textContent = user.gisParty[0].email || "N/A";
        document.getElementById('phone').textContent = user.gisParty[0].phone || "N/A";
        document.getElementById('ref_code').textContent = user.gisParty[0].ref_code || "N/A";
        
        
        console.log("User Data:", user); // Log the user data

    } else {
        console.log("No user data found.");
    }

    // Add your existing profile icon click functionality here





    const refListData = JSON.parse(localStorage.getItem("refListData"));
// Now you can use refListData as needed on this page



document.getElementById('profile-icon').addEventListener('click', function(event) {
    event.stopPropagation(); // Prevent the click event from bubbling up to the document
    const profileCard = document.getElementById('profile-card');
    profileCard.style.display = profileCard.style.display === 'block' ? 'none' : 'block';
});

// Hide the profile card when clicking anywhere outside of it
document.addEventListener('click', function(event) {
    const profileCard = document.getElementById('profile-card');
    const profileIcon = document.getElementById('profile-icon');

    // Check if the clicked target is not the profile card or the profile icon
    if (!profileCard.contains(event.target) && !profileIcon.contains(event.target)) {
        profileCard.style.display = 'none'; // Hide the profile card
    }
});



});



















