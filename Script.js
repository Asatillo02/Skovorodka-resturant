// Initialize the current image index
let currentIndex = 0;
const images = document.querySelectorAll('.slide img'); // Get all images inside the slide container

// Function to show the image based on index
function showImage(index) {
    // Hide all images first
    images.forEach((image, i) => {
        image.style.display = 'none';  // Hide all images
    });
    
    // Show the current image
    images[index].style.display = 'block';  // Display the image at the current index
}

// Function to move images based on direction
function move(direction) {
    // Calculate the new index
    currentIndex = (currentIndex + direction + images.length) % images.length;
    showImage(currentIndex);
}

// Show the first image when the page loads
showImage(currentIndex);


function Menu() {
    const nav = document.querySelector('nav');
    nav.classList.toggle('active');
}
