// Name: Randomized Lists
// Version: v2.2.0
// https://github.com/huandney/Anki-Insert-Randomized-Lists

// Function to shuffle an array and return the shuffled version
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Reorders child elements based on provided indices
function reorder(elements, indices) {
    // Convert the collection of child elements into an array
    const children = Array.from(elements.children);
    // Array to group the elements
    const grouped = [];

    // Iterate over all child elements
    for (let i = 0; i < children.length; i++) {
        // Create a group with the current child element
        const group = [children[i]];
        // Group contiguous <ul> elements, adding them to the current group
        for (; i + 1 < children.length && children[i + 1].tagName.toLowerCase() === 'ul'; group.push(children[++i]));
        // Add the group to the array of groups
        grouped.push(group);
    }

    // Reorder the groups according to the provided indices
    const reordered = indices.flatMap(index => grouped[index] || []);

    // Clear the content of the element and add the reordered elements
    // We could use elements.replaceChildren(...reordered) here,
    // but for compatibility with older browser versions,
    // we use the combination of elements.innerHTML = '' and elements.append(...reordered).
    elements.innerHTML = '';
    elements.append(...reordered);
}

function run() {
    // Select all list elements with the 'shuffle' class
    const uls = document.querySelectorAll('ul.shuffle');
    
    // Attempt to retrieve indices previously stored in sessionStorage
    // If there's no data in sessionStorage, initialize an empty object
    let indices = JSON.parse(sessionStorage.getItem('allIndices')) || {};

    // If on the front side (doesn't have an element with ID 'back'), shuffle the lists
    if (!document.getElementById('back')) {
        uls.forEach((ul, i) => 
            // For each list, generate an array of indices and shuffle it
            indices[i] = shuffle([...Array(ul.children.length).keys()])
        );
        // Store the shuffled indices in sessionStorage
        sessionStorage.setItem('allIndices', JSON.stringify(indices));
    }

    // For each list, reorder the elements based on the retrieved or generated indices
    uls.forEach((ul, i) => reorder(ul, indices[i]));
}

// Execute the main function when the script is loaded
run();
