// ReCo website - script.js
// JavaScript features in this file:
//   1. Menu button: shows / hides the menu on small screens
//   2. Search: filters the recipe cards on the home page
//   3. Ingredient checklist: ticks, progress bar, message, reset button
//   4. Greeting, date and live clock on the home page
//   5. Contact form: character counter, validation, error messages
//   6. Contact form: reads the entered data and sends it to thank-you.html
//   7. Thank-you page: reads the data and shows it in a table


// ---------- 1. MENU BUTTON (small screens) ----------
function toggleNav() {
  var nav = document.getElementById("myTopnav");

  if (nav.className === "topnav") {
    nav.className = "topnav responsive";   // open the menu
  } else {
    nav.className = "topnav";              // close the menu
  }
}


// ---------- 2. SEARCH (home page only) ----------
var searchBox = document.getElementById("searchInput");

if (searchBox) {
  var cards = document.getElementsByClassName("recipe-card");
  var noResults = document.getElementById("noResults");

  // Runs every time you type a letter
  searchBox.addEventListener("input", function () {
    var words = searchBox.value.toLowerCase().split(" ");   // "chicken rice" -> ["chicken", "rice"]
    var shown = 0;

    for (var i = 0; i < cards.length; i++) {
      // Everything we can search: the card text + its hidden keywords
      var cardText = cards[i].textContent + " " + cards[i].getAttribute("data-search");
      cardText = cardText.toLowerCase();

      // The card matches only if it contains every word you typed
      var matches = true;
      for (var w = 0; w < words.length; w++) {
        if (!cardText.includes(words[w])) {
          matches = false;
        }
      }

      if (matches) {
        cards[i].style.display = "";       // show the card
        shown++;
      } else {
        cards[i].style.display = "none";   // hide the card
      }
    }

    // Show "No recipes found" if nothing matched
    if (shown === 0) {
      noResults.style.display = "block";
    } else {
      noResults.style.display = "none";
    }
  });
}


// ---------- 3. INGREDIENT CHECKLIST (recipe pages only) ----------
var list = document.querySelector(".checklist");

if (list) {
  var recipeName = list.getAttribute("data-recipe");
  var boxes = list.querySelectorAll("input");
  var progressFill = document.getElementById("progressFill");
  var progressText = document.getElementById("progressText");
  var doneMessage = document.getElementById("doneMsg");
  var resetButton = document.getElementById("resetBtn");

  // Count the ticked boxes and update the bar and the text
  function updateProgress() {
    var ticked = 0;
    for (var i = 0; i < boxes.length; i++) {
      if (boxes[i].checked) {
        ticked++;
      }
    }

    var percent = (ticked / boxes.length) * 100;
    progressFill.style.width = percent + "%";
    progressText.textContent = ticked + " of " + boxes.length + " ingredients ready";

    // Show the "you have everything" message when all are ticked
    if (ticked === boxes.length) {
      doneMessage.style.display = "block";
    } else {
      doneMessage.style.display = "none";
    }
  }

  // Save one checkbox in the browser so it is remembered after refresh
  function saveBox(number) {
    localStorage.setItem(recipeName + "-" + number, boxes[number].checked);
  }

  // When the page opens: bring back the saved ticks, and watch for new clicks
  for (var i = 0; i < boxes.length; i++) {
    boxes[i].checked = localStorage.getItem(recipeName + "-" + i) === "true";

    boxes[i].addEventListener("change", function () {
      // Find which box was clicked, save it, update the bar
      for (var j = 0; j < boxes.length; j++) {
        saveBox(j);
      }
      updateProgress();
    });
  }

  // Reset button: untick everything
  resetButton.addEventListener("click", function () {
    for (var i = 0; i < boxes.length; i++) {
      boxes[i].checked = false;
      saveBox(i);
    }
    updateProgress();
  });

  updateProgress();
}


// ---------- 4. GREETING, DATE AND LIVE CLOCK (home page only) ----------
var greeting = document.getElementById("greeting");
var clock = document.getElementById("clock");

if (greeting && clock) {
  function showTime() {
    var now = new Date();
    var hour = now.getHours();

    // Change the greeting depending on the time of day
    if (hour < 12) {
      greeting.textContent = "Good morning! What shall we cook for breakfast?";
    } else if (hour < 18) {
      greeting.textContent = "Good afternoon! Ready to cook lunch?";
    } else {
      greeting.textContent = "Good evening! Time to plan dinner?";
    }

    // Show today's date and the current time
    clock.textContent = now.toLocaleDateString("en-GB", {
      weekday: "long", day: "numeric", month: "long", year: "numeric"
    }) + " | " + now.toLocaleTimeString("en-GB");
  }

  showTime();
  setInterval(showTime, 1000);   // update every second
}


// ---------- 5. CONTACT FORM: counter and validation ----------
var contactForm = document.getElementById("contactForm");

if (contactForm) {
  var commentsBox = document.getElementById("comments");
  var charCount = document.getElementById("charCount");

  // Show how many characters were typed (and the limit)
  commentsBox.addEventListener("input", function () {
    charCount.textContent = commentsBox.value.length + " / 300";
  });

  // Put a message under a field (an empty message clears the error)
  function setError(errorId, message) {
    document.getElementById(errorId).textContent = message;
  }

  // Check every field. Returns true only if everything is correct.
  function checkForm() {
    var ok = true;

    var name = document.getElementById("fullName").value.trim();
    var email = document.getElementById("email").value.trim();
    var phone = document.getElementById("phone").value.trim();
    var category = document.getElementById("category").value;
    var comments = commentsBox.value.trim();
    var rating = contactForm.querySelector('input[name="rating"]:checked');

    // Name: at least 2 letters
    if (name.length < 2) {
      setError("nameError", "Please enter your full name.");
      ok = false;
    } else {
      setError("nameError", "");
    }

    // Email: must look like name@site.com
    if (email.indexOf("@") < 1 || email.lastIndexOf(".") < email.indexOf("@") + 2 || email.lastIndexOf(".") === email.length - 1) {
      setError("emailError", "Please enter a valid email, like sara@example.com.");
      ok = false;
    } else {
      setError("emailError", "");
    }

    // Phone: optional, but if typed it must be 7 to 15 digits
    var digits = phone.replace(/[ +\-]/g, "");
    if (phone !== "" && (isNaN(digits) || digits.length < 7 || digits.length > 15)) {
      setError("phoneError", "Phone must have 7 to 15 digits (numbers only).");
      ok = false;
    } else {
      setError("phoneError", "");
    }

    // Category must be chosen
    if (category === "") {
      setError("categoryError", "Please choose a category.");
      ok = false;
    } else {
      setError("categoryError", "");
    }

    // Rating must be chosen
    if (rating === null) {
      setError("ratingError", "Please choose a rating from 1 to 5.");
      ok = false;
    } else {
      setError("ratingError", "");
    }

    // Comments: at least 10 characters
    if (comments.length < 10) {
      setError("commentsError", "Please write at least 10 characters.");
      ok = false;
    } else {
      setError("commentsError", "");
    }

    return ok;
  }

  // ---------- 6. CONTACT FORM: submit ----------
  contactForm.addEventListener("submit", function (event) {
    event.preventDefault();          // stop the normal page reload

    if (!checkForm()) {
      alert("Please fix the errors shown in red and try again.");
      return;
    }

    // Read the values and send them to the thank-you page in the address bar
    var rating = contactForm.querySelector('input[name="rating"]:checked').value;
    var data = new URLSearchParams();
    data.set("name", document.getElementById("fullName").value.trim());
    data.set("email", document.getElementById("email").value.trim());
    data.set("phone", document.getElementById("phone").value.trim());
    data.set("category", document.getElementById("category").value);
    data.set("rating", rating);
    data.set("suggestion", document.getElementById("suggestion").value.trim());
    data.set("comments", commentsBox.value.trim());

    window.location.href = "thank-you.html?" + data.toString();
  });

  // Clear form button: also clear the error messages and the counter
  contactForm.addEventListener("reset", function () {
    var errors = contactForm.getElementsByClassName("error");
    for (var i = 0; i < errors.length; i++) {
      errors[i].textContent = "";
    }
    charCount.textContent = "0 / 300";
  });
}


// ---------- 7. THANK-YOU PAGE: show the submitted data ----------
var resultBody = document.getElementById("resultBody");

if (resultBody) {
  var params = new URLSearchParams(window.location.search);

  if (!params.get("name")) {
    // Nobody filled the form: hide the table and show a message
    document.getElementById("resultBox").style.display = "none";
    document.getElementById("noData").style.display = "block";
    document.getElementById("thanksTitle").textContent = "Nothing to show yet";
    document.getElementById("thanksSub").textContent = "";
  } else {
    document.getElementById("thanksTitle").textContent = "Thank you, " + params.get("name") + "!";

    var stars = "";
    for (var s = 0; s < Number(params.get("rating")); s++) {
      stars += "★";
    }

    // Each row: [label, value]
    var rows = [
      ["Name", params.get("name")],
      ["Email", params.get("email")],
      ["Phone", params.get("phone") || "Not given"],
      ["Favourite category", params.get("category")],
      ["Rating", stars + " (" + params.get("rating") + " out of 5)"],
      ["Recipe suggestion", params.get("suggestion") || "None"],
      ["Comments", params.get("comments")],
      ["Sent on", new Date().toLocaleString("en-GB")]
    ];

    for (var r = 0; r < rows.length; r++) {
      var tr = document.createElement("tr");
      var th = document.createElement("th");
      var td = document.createElement("td");
      th.textContent = rows[r][0];
      td.textContent = rows[r][1];     // textContent keeps the text safe
      tr.appendChild(th);
      tr.appendChild(td);
      resultBody.appendChild(tr);
    }
  }
}
