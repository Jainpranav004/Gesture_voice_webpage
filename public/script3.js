console.log("hello")

// Get the main image container and button container elements
const mainImageContainer = document.getElementById('main-img');
const buttonContainer = document.getElementById('button-container');

// Add an event listener to each button
buttonContainer.addEventListener('click', (event) => {
  if (event.target.tagName === 'LI') {
    console.log("clicked")
    const imageUrl = event.target.getAttribute('data-img');
    mainImageContainer.innerHTML = `<img src="${imageUrl}" alt="Main Image">`;
  }
});