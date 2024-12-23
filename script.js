// Select all drum parts
const drumParts = document.querySelectorAll(
  "#kickpedal, #snare, #tom, #floor, #hi-hat, #hi-hatpedal, #crash, #ride, #bell"
);

// Path to the folder containing audio samples
const audioPath = "./samples/";

// Map keyboard keys to drum IDs
const keyMap = {
  Space: "kickpedal", // Spacebar -> Kick Pedal
  KeyS: "snare", // S -> Snare
  KeyT: "tom", // T -> Tom
  KeyF: "floor", // F -> Floor
  KeyH: "hi-hat", // H -> Hi-Hat
  KeyO: "hi-hatpedal", // O -> Hi-Hat Pedal
  KeyC: "crash", // C -> Crash
  KeyR: "ride", // R -> Ride
  KeyB: "bell", // B -> Bell
};

// Object to store preloaded sounds
const sounds = {};
let loadedSounds = 0;

// Function to preload all audio files
const preloadSounds = () => {
  drumParts.forEach((part) => {
    const id = part.id;
    const audio = new Audio(`${audioPath}${id}.wav`);
    audio.preload = "auto"; // Ensure the browser fetches the audio file
    audio.addEventListener("canplaythrough", () => {
      loadedSounds++;
      // Hide loading indicator when all sounds are loaded
      if (loadedSounds === drumParts.length) {
        document.getElementById("loading").style.display = "none";
        console.log("All sounds loaded!");
      }
    });
    sounds[id] = audio; // Store the audio object in the sounds map
  });
};

// Function to play sound by ID and apply active class
const playSound = (id) => {
  if (!id || !sounds[id]) return;

  // Find the element and add the "active" class
  const element = document.getElementById(id);
  if (element) {
    element.classList.add("active"); // Add active class
    setTimeout(() => element.classList.remove("active"), 50); // Remove active class after 50ms
  }

  // Play the sound
  sounds[id].currentTime = 0; // Start playback from the beginning
  sounds[id].play();
};

// Add click and touch support
drumParts.forEach((part) => {
  // Only add the active class and play sound for non-hi-hat parts here
  if (part.id !== "hi-hatpedal") {
    part.addEventListener("click", () => playSound(part.id));
    part.addEventListener("touchstart", (e) => {
      e.preventDefault(); // Prevent both touch and click triggers
      playSound(part.id);
    });
  }
});

// Add keyboard support
document.addEventListener("keydown", (e) => {
  const drumId = keyMap[e.code]; // Get the drum ID from the key map
  if (drumId) {
    playSound(drumId); // Play sound based on the key pressed
  }

  // Handle specific case for hi-hatpedal (O key)
  if (e.code === "KeyO") {
    const hiHat = document.getElementById("hi-hat");

    // Add active class to hi-hat only
    hiHat.classList.add("active-hi-hatpedal");

    setTimeout(() => {
      hiHat.classList.remove("active-hi-hatpedal");
    }, 50); // Reduced to 50ms
  }
});

// Get the hi-hat pedal and hi-hat elements by their IDs
const hiHatPedal = document.getElementById("hi-hatpedal");
const hiHat = document.getElementById("hi-hat");

// When the hi-hat pedal is pressed, add a custom active class to hi-hat and play sound
hiHatPedal.addEventListener("mousedown", () => {
  hiHat.classList.add("active-hi-hatpedal"); // Simulate active state of hi-hat
  playSound("hi-hatpedal"); // Play hi-hatpedal sound (only here)
});

// Prevent playing the sound again when mouseup occurs
hiHatPedal.addEventListener("mouseup", () => {
  hiHat.classList.remove("active-hi-hatpedal"); // Deactivate the hi-hat
});

// For touch devices, handle the touch events as well
hiHatPedal.addEventListener("touchstart", (e) => {
  e.preventDefault(); // Prevent default touch behavior
  hiHat.classList.add("active-hi-hatpedal"); // Simulate active state of hi-hat
  playSound("hi-hatpedal"); // Play hi-hatpedal sound (only here)
});

hiHatPedal.addEventListener("touchend", () => {
  hiHat.classList.remove("active-hi-hatpedal"); // Deactivate the hi-hat
});

// Preload sounds when the page loads
window.addEventListener("load", preloadSounds);
