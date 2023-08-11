// Function to reorder the items of a list based on the provided indices.
function reorderList(ul, indices) {
    indices.forEach(index => ul.appendChild(ul.children[index]));
}

// Function to shuffle the elements of an array.
function shuffleArray(array) {
    for (var i = array.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

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
