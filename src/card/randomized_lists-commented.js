// Name: Randomized Lists
// Version: v2.3.0
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
    // Convert the collection of child elements into an array using spread syntax
    const children = [...elements.children];
    // Array to group the elements
    const grouped = [];

    // Iterate over all child elements
    for (let i = 0; i < children.length; i++) {
        // Create a group with the current child element
        const group = [children[i]];
        // Group contiguous <ul> elements, adding them to the current group
        // Note: using exact case 'UL' for better performance compared to toLowerCase()
        for (; i + 1 < children.length && children[i + 1].tagName === 'UL'; group.push(children[++i]));
        // Add the group to the array of groups
        grouped.push(group);
    }

    // Create a DocumentFragment for better performance when appending multiple elements
    const fragment = document.createDocumentFragment();
    // We could use optional chaining (grouped[index]?.forEach(...)) here,
    // but for maximum compatibility with older WebViews we use an explicit check:
    indices.forEach(index =>
      grouped[index] && grouped[index].forEach(el => fragment.appendChild(el))
    );
    // Replace all children of the element with the fragment in a single operation
    // This is more efficient than clearing innerHTML and then appending
    elements.replaceChildren(fragment);
}

// Main function to find and randomize lists
function run() {
    // Select all list elements with the 'shuffle' class
    const uls = document.querySelectorAll('ul.shuffle');
    // Early return if no shuffle lists are found, improving performance
    if (!uls || !uls.length) return; 
    
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

// Workaround for reported DOM-loading timing issues in AnkiDroid
document.addEventListener('DOMContentLoaded', run);
if (document.readyState !== 'loading') run();
