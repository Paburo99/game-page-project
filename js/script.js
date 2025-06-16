// -- COUNTDOWN TIMER --
const daysElement = document.getElementById("days");
const hoursElement = document.getElementById("hours");
const minutesElement = document.getElementById("minutes");
const secondsElement = document.getElementById("seconds");

const releaseDate = new Date("2025-06-16T20:00:00");

function updateCountdown() {
    const now = new Date();
    const timeDifference = releaseDate.getTime() - now.getTime(); //milliseconds

    if (timeDifference > 0) {
        const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

        daysElement.textContent = String(days).padStart(2, "0");
        hoursElement.textContent = String(hours).padStart(2, "0");
        minutesElement.textContent = String(minutes).padStart(2, "0");
        secondsElement.textContent = String(seconds).padStart(2, "0");
    } else {
        clearInterval(timerInterval);
        document.querySelector(".countdown-timer").innerHTML = "<h3>The Game is Out Now!</h3>";
    }
}

const timerInterval = setInterval(updateCountdown, 1000);

// -- SMOOTH SCROLLING --
const nav = document.querySelector("header nav");

nav.addEventListener("click", (event) => {
    if (event.target.tagName === "A") {
        event.preventDefault();

        const href = event.target.getAttribute("href");
        const targetSection = document.querySelector(href);

        if (targetSection) {
            targetSection.scrollIntoView({
                behavior: "smooth"
            });
        }
    }
})
