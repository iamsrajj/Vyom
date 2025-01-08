// Show the profile card when the profile icon is clicked
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
