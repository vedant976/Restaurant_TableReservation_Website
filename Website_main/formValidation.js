// Form validation for Reservations and Manage Reservations forms
function validateReservationForm() {
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email") ? document.getElementById("email").value.trim() : null;
    const phone = document.getElementById("phone") ? document.getElementById("phone").value.trim() : null;
    const date = document.getElementById("date").value.trim();
    const time = document.getElementById("time").value.trim();
    const guests = document.getElementById("guests").value.trim();

    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const phonePattern = /^[0-9]{10}$/;

    if (name === "" || date === "" || time === "" || guests === "") {
        alert("All fields are required.");
        return false;
    }

    if (email && !emailPattern.test(email)) {
        alert("Please enter a valid email address.");
        return false;
    }

    if (phone && !phonePattern.test(phone)) {
        alert("Please enter a valid 10-digit phone number.");
        return false;
    }

    if (isNaN(guests) || guests < 1 || guests > 20) {
        alert("Please enter a valid number of guests (between 1 and 20).");
        return false;
    }

    return true; // If all validations pass
}

// Attach validation to the form submissions
document.addEventListener("DOMContentLoaded", function () {
    const forms = document.querySelectorAll(".reservation-form");
    forms.forEach(form => {
        form.addEventListener("submit", function (event) {
            if (!validateReservationForm()) {
                event.preventDefault();
            }
        });
    });
});


// Form validation for Delete Reservation form
function validateDeleteReservationForm() {
    const name = document.getElementById("delete-name").value.trim();

    if (name === "") {
        alert("Please enter the full name to delete the reservation.");
        return false;
    }

    return true; // If validation passes
}

// Attach validation to the delete reservation form submission
document.addEventListener("DOMContentLoaded", function () {
    const deleteForm = document.getElementById("delete-reservation-form");
    if (deleteForm) {
        deleteForm.addEventListener("submit", function (event) {
            if (!validateDeleteReservationForm()) {
                event.preventDefault();
            }
        });
    }
});
