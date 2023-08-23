// Name: Randomized Lists
// Version: v2.1.0
// https://github.com/huandney/Anki-Insert-Randomized-Lists

// Function to reorder elements in a list based on provided indices.
function reorder(elements, indices) {
    indices.forEach(index => elements.appendChild(elements.children[index]));
}

// Function to shuffle an array and return the shuffled version.
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function run() {
    // Select all list elements with the 'shuffle' class.
    const uls = document.querySelectorAll('ul.shuffle');
    
    // Attempt to retrieve indices previously stored in sessionStorage.
    // If there's no data in sessionStorage, initialize an empty object.
    let indices = JSON.parse(sessionStorage.getItem('allIndices')) || {};

    // If on the front side (doesn't have an element with ID 'back'), shuffle the lists.
    if (!document.getElementById('back')) {
        uls.forEach((ul, i) => 
            // For each list, generate an array of indices and shuffle it.
            indices[i] = shuffle([...Array(ul.children.length).keys()])
        );
        // Store the shuffled indices in sessionStorage.
        sessionStorage.setItem('allIndices', JSON.stringify(indices));
    }

    // For each list, reorder the elements based on the retrieved or generated indices.
    uls.forEach((ul, i) => reorder(ul, indices[i]));
}

// Execute the main function when the script is loaded.
run();
