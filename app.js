import Clock from './clock.js'

// DOM nodes
let icon = document.getElementById('themeToggle');
let dayCount = document.getElementById("countDay");
const animatedCountDuration = 800;

// let controls = document.getElementsByClassName("button");
// let startButton = document.getElementById('startButton');
// let stopButton = document.getElementById('stopButton');
const body = document.body;
const dayNumber = document.getElementById('day-num');
const hourNumber = document.getElementById("hour-num");
const minNumber = document.getElementById("min-num");
const secNumber = document.getElementById("sec-num");
const dateInput = document.getElementById('customDate')

const customDayNumber = document.getElementById('day-custom');
const customHourNumber = document.getElementById("hour-custom");
const customMinNumber = document.getElementById("min-custom");
const customSecNumber = document.getElementById("sec-custom");

//to stop the clock
let intervalID;
let animationComplete = false;
let customClockMovement = false;

// Initialize default Clock class
export var myclock = new Clock();
var customClock;

export function waitForAnimation(clock, domElements) {
    stepIncreaseAndStart(clock||myclock, domElements, animatedCountDuration)
    // begin animated countdown and wait for it to complete
    console.log('day', dayNumber);
    intervalID = setInterval(()=>{ startClock(clock||myclock, domElements)}, animatedCountDuration + 100);
}

function startClock(clock, { dayNumber, hourNumber, minNumber, secNumber }) {
    
    //upon completion begin countdown
    if (animationComplete) {
        clearTimeout(intervalID);
        intervalID = setInterval(()=>{ startTime(clock, { dayNumber, hourNumber, minNumber, secNumber } )}, 500);
    }
}

function startTime(clock, {dayNumber, hourNumber, minNumber, secNumber} ) {
    // console.log( clock);
    updateDisplay(clock, dayNumber, hourNumber, minNumber, secNumber);
    if(dayCount)dayCount.innerHTML = myclock.countDays();
    if (customClockMovement) {
        updateDisplay(customClock, customDayNumber, customHourNumber, customMinNumber, customSecNumber);
    }
}

// add zero in front of numbers < 10
function addZeros(time) {
    if (time < 10) {
        time = "0" + time;
    }
    return time;
}

export function updateDisplay(counter, dayDisplay, hourDisplay, minDisplay, secDisplay) {
    
    counter.countDown();
    let d = counter.days
    let h = counter.hours
    let m = counter.minutes
    let s = counter.seconds
    d = addZeros(d);
    h = addZeros(h);
    m = addZeros(m);
    s = addZeros(s);

    dayDisplay.innerHTML = `${d}`;
    hourDisplay.innerHTML = `${h}`;
    minDisplay.innerHTML = `${m}`;
    secDisplay.innerHTML = `${s}`;
}



//todo: find a better way of checking for a valid date
/**
 * Listens for a user input for date element
 */
function listenForDate() {
    const input = this.value;
    // console.log(input, 'run');
    if (input != '') {
        customClock = new Clock(new Date(input));
        displayClockRow();
        // do the fast countdown
        // set speed faster when day of the year is greater
        // todo: change to animateValue
        stepIncreaseAndStart(customClock, { customDayNumber, customHourNumber, customMinNumber, customSecNumber }, (365 - customClock.days < 100) ? 365 - customClock.days : 70);
    }
}

function displayClockRow() {

    let customRow = document.getElementById("customDisplay");
    // show row
    customRow.style.display = 'block';
}
/* //restart the clock
function restartTime() {
    if (customClockMovement) {
        return;
    } else {
        startClock();
    }
}
*/
//stop the clock
export function stopClock() {
    clearTimeout(intervalID);
    customClockMovement = false;
}

//light mode if after 6am and after 18:00 evening
function autoLight() {
    let h = new Date().getHours();
    //between 6 am and 6pm
    if (h > 5 && h < 18) activateLightMode();
}

function activateLightMode() {
    icon.innerHTML = `<i class="fas fa-moon"></i>`;
    if (body.classList.contains("dark")) {
        body.classList.replace("dark", "light");
    } else { body.classList.add("light"); }
}

function activateDarkMode() {
    icon.innerHTML = `<i class="fas fa-sun"></i>`;
    if (body.classList.contains("light")) {
        body.classList.replace("light", "dark");
    } else { body.classList.add("dark"); }
}

function setMode() {
    if (!body.classList.contains("light")) {
        activateLightMode();
    } else {
        activateDarkMode();
    }
}
function notifyMode() {
    let notifyText;
    if (body.classList.contains("light")) {
        notifyText = "Light mode set";
    } else {
        notifyText = "Dark mode set";
    }

    if (document.getElementsByClassName("mode-info")[0]) {
        document.getElementsByClassName("mode-info")[0].remove();
        body.insertAdjacentHTML(
            "afterbegin",
            `<span class="mode-info">${notifyText}</span>`
        );
    } else {
        body.insertAdjacentHTML(
            "afterbegin",
            `<span class="mode-info">${notifyText}</span>`
        );
    }
}

//for the animated Countdown
function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        obj.innerHTML = Math.floor(progress * (end - start) + start);
        if (progress < 1) {
            window.requestAnimationFrame(step);
            animationComplete = false;
        } else {
            animationComplete = true;
        }
    };
    window.requestAnimationFrame(step);
}

function stepIncreaseAndStart(clockElement, domElements, speed = 50, start_num = 0) {
    animateValue(domElements.dayNumber, start_num, clockElement.days, speed);
    animateValue(domElements.hourNumber, start_num, clockElement.hours, speed);
    animateValue(domElements.minNumber, start_num, clockElement.minutes, speed);
    animateValue(domElements.secNumber, start_num, clockElement.seconds, speed);

}

function addEventListeners() {
    icon.addEventListener("click", setMode);
    icon.addEventListener("click", notifyMode);
}

//show day value before animation runs
// startTime();
waitForAnimation(myclock, {dayNumber, hourNumber, minNumber, secNumber});
addEventListeners();
autoLight();
// init events



// dateInput.addEventListener('change', listenForDate);

// service worker
/*
if('serviceWorker' in navigator){
    window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
    .then( (reg)=> console.log('service worker registered', reg))
        .catch((err)=> console.log('Service worker not registered', err));
  });
        
}
*/