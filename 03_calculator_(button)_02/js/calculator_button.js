"use strict";

let prev_value = null;
let w_result = "";
let w_total = "";
let currentAudio = null;

let click_sound = new Audio("./sound/click.mp3");

let keyboard_array = [
  "0",
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "c",
  "C",
  "Escape",
  "Backspace",
  "Delete",
  "+",
  "-",
  "*",
  "/",
  "=",
  "Enter",
];

const calcLog = document.getElementById("calcLog");
const result = document.getElementById("result");
const buttons = document.getElementById("buttons");

// Button event
buttons.addEventListener("click", (event) => {
  // Ignore clicks that are not buttons
  if (event.target.tagName !== "BUTTON") return;

  // Call calculator function
  calculate(event.target.value);
});

// Keyboard event
document.addEventListener("keydown", (event) => {
  // Stop browser default action for Enter
  if (event.key === "Enter") {
    event.preventDefault();
  }

  // If pressed key exists in keyboard_array
  if (keyboard_array.includes(event.key)) {
    calculate(event.key);
  }
});

// Calculator function
function calculate(event_value) {
  // Play click sound
  soundControl(click_sound);

  console.log(
    `prev_value: ${prev_value} w_result: ${w_result} w_total: ${w_total} calcLog.textContent: ${calcLog.textContent} result: ${result.textContent}`,
  );

  // Clear calculator
  if (
    event_value === "C" ||
    event_value === "c" ||
    event_value === "Escape" ||
    event_value === "Backspace" ||
    event_value === "Delete"
  ) {
    calcLog.textContent = "";
    result.textContent = "";

    w_result = "";
    w_total = "";
    prev_value = null;

    return;
  }

  // When "=" or Enter is pressed
  if (event_value === "=" || event_value === "Enter") {
    // Display calculation
    calcLog.textContent = w_result;

    try {
      // Calculate result
      w_total = eval(w_result);

      // Display result
      result.textContent = w_total.toLocaleString("ja-JP");
    } catch {
      result.textContent = "Error";
      w_total = "";
    }

    // Save previous key
    prev_value = event_value;

    return;
  }

  // If previous key was "=" or Enter,
  // start a new calculation
  if (prev_value === "=" || prev_value === "Enter") {
    w_result = "";
    w_total = "";

    calcLog.textContent = "";
  }

  // Add pressed number/operator
  w_result += event_value;

  // Display calculation
  result.textContent = w_result;

  // Add to calculation log
  calcLog.textContent += event_value;

  // Save previous key
  prev_value = event_value;

  console.log(
    `prev_value: ${prev_value} w_result: ${w_result} w_total: ${w_total} calcLog.textContent: ${calcLog.textContent} result: ${result.textContent}`,
  );
}

// Sound control
function soundControl(w_sound) {
  // Stop previous sound if playing
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
  }

  // Play sound
  w_sound.play().catch((error) => {
    if (error.name !== "AbortError") {
      console.error("Error:", error);
    }
  });

  // Save current audio
  currentAudio = w_sound;
}
