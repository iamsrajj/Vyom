document.getElementById('submit').addEventListener('click', function() {
    // Create and append a new card
    let newCard = document.createElement('div');
    newCard.className = 'card';
    newCard.textContent = 'New Card Content'; // Customize the content as needed

    // Append the new card directly to the body
    document.body.appendChild(newCard);
});
