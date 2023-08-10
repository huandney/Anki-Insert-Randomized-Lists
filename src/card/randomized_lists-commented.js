// Function to reorder the items of a list based on the provided indices.
function reorderList(ul, indices) {
    // For each index in the 'indices' array
    indices.forEach(index => {
        // Append the child element at the given index to the end of the 'ul' list.
        // This effectively reorders the items based on the sequence of indices.
        ul.appendChild(ul.children[index]);
    });
}

// Function to shuffle the elements of an array.
function shuffleArray(array) {
    // Start the loop from the last element of the array
    for (var i = array.length - 1; i > 0; i--) {
        // Generate a random index between 0 and i (inclusive)
        var j = Math.floor(Math.random() * (i + 1));
        
        // Swap the elements at positions i and j
        [array[i], array[j]] = [array[j], array[i]];
    }
    
    // Return the shuffled array
    return array;
}

// Main function to handle the randomization and reordering of lists.
function run() {
    // Select all lists that need to be shuffled
    var ulElements = document.querySelectorAll('ul.shuffle');
    // Check if it's on the back of the card.
    var isBack = !!document.getElementById('back');
    // Retrieve all stored indices or initialize an empty object.
    var allIndices = isBack ? JSON.parse(sessionStorage.getItem('allIndices')) : {};

    ulElements.forEach((ul, i) => {
        // Use stored indices or shuffle to get new indices.
        var indices = allIndices[i] || shuffleArray(Array.from({length: ul.children.length}, (_, idx) => idx));
        // If on the front, store the generated indices.
        if (!isBack) allIndices[i] = indices;
        // Reorder the list based on indices.
        reorderList(ul, indices);
    });

    // If on the front, store all indices in sessionStorage.
    if (!isBack) sessionStorage.setItem('allIndices', JSON.stringify(allIndices));
}

// Run the main function
run();
