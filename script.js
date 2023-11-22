const imageContainer = document.getElementById("image-container");
const loader = document.getElementById("loader");

// We are using a let instead of a const because the value within our photosArray will change everytime we make a request
let photosArray = [];
let ready = false;
let imagesLoaded = 0;
let totalImages = 0;
let isInitialLoad = true;

// Unsplash API
let initialLoad = 5;
const apiKey = "QT2BjdLuxwXMcYHMRSDO7sMymkAq3L8Z5-yb6_ju6iM";
let apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialLoad}`;

function updateAPIUrl(imgLoadCount) {
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${imgLoadCount}`;
}

// Check if pictures loaded is the first load or not, if not set initialLoad to 30
function moreImageLoad(initialLoadCount) {
  imagesLoaded++;
  if (imagesLoaded === totalImages) {
    ready = true;
    loader.hidden = true;
  }
}

// Check if all images were loaded
function imageLoaded() {
  moreImageLoad();
  apiUrl = `https://api.unsplash.com/photos/random/?client_id=${apiKey}&count=${initialLoad}`;
}

// Helper Function to set attributes on DOM Elements
function setAttributes(element, attributes) {
  for (const key in attributes) {
    element.setAttribute(key, attributes[key]);
  }
}

// Create Elemnts for Links and Photos, Add to DOM
function displayPhotos() {
  imagesLoaded = 0;
  totalImages = photosArray.length;
  // Run function for each object in phototsArray
  photosArray.forEach((photo) => {
    // Create <a> to link to unsplash
    const item = document.createElement("a");
    setAttributes(item, {
      href: photo.links.html,
      target: "_blank",
    });

    // Create <img> for photo
    const img = document.createElement("img");
    setAttributes(img, {
      src: photo.urls.regular,
      alt: photo.alt_description,
      title: photo.alt_description,
    });

    // Event Listener, check when each is finished loading
    img.addEventListener("load", imageLoaded);

    // Put <img> inside <a>, then put both inside imageContainer Element
    item.appendChild(img);
    imageContainer.appendChild(item);
  });
}

// Get photos from Unsplash API
async function getPhotos() {
  try {
    const response = await fetch(apiUrl);
    photosArray = await response.json();
    displayPhotos();
    if (isInitialLoad) {
      updateAPIUrl(30);
      isInitialLoad = false;
    }
  } catch (error) {
    // Catch error here
  }
}

// Check to see if scrolling near bottom of page, load more photos
window.addEventListener("scroll", () => {
  if (
    window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000 &&
    ready
  ) {
    ready = false;
    getPhotos();
  }
});

// On Load
getPhotos();
