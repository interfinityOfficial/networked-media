window.onload = () => {
    // Mechanical Clock
    const mechanicalClockCenterGear = document.getElementById("mechanical-clock-center-gear");
    const mechanicalClockBottomGear = document.getElementById("mechanical-clock-bottom-gear");

    window.onresize = () => {
        updateGears();
    };

    function updateGears() {
        let centerGearWidth = mechanicalClockCenterGear.clientWidth
        let bottomGearWidth = mechanicalClockBottomGear.clientWidth

        if (centerGearWidth == 0) {
            centerGearWidth = 100;
        }
        if (bottomGearWidth == 0) {
            bottomGearWidth = 100;
        }
        mechanicalClockCenterGear.style.setProperty("--ratio", 100 / centerGearWidth);
        mechanicalClockBottomGear.style.setProperty("--ratio", 100 / bottomGearWidth);
    }

    // Quantum Clock
    const quantumClockMain = document.getElementById("quantum-clock-main");

    const quantumDigit1 = document.getElementById("quantum-clock-digit-1");
    const quantumDigit2 = document.getElementById("quantum-clock-digit-2");
    const quantumDigit3 = document.getElementById("quantum-clock-digit-3");
    const quantumDigit4 = document.getElementById("quantum-clock-digit-4");
    const quantumDigit5 = document.getElementById("quantum-clock-digit-5");
    const quantumDigit6 = document.getElementById("quantum-clock-digit-6");

    let interval;

    function getRandomDigit() {
        let digit = Math.floor(Math.random() * 11);
        if (digit == 10) {
            digit = "?";
        }
        return digit;
    }

    function startFlicker() {
        interval = setInterval(() => {
            quantumDigit1.textContent = getRandomDigit();
            quantumDigit2.textContent = getRandomDigit();
            quantumDigit3.textContent = getRandomDigit();
            quantumDigit4.textContent = getRandomDigit();
            quantumDigit5.textContent = getRandomDigit();
            quantumDigit6.textContent = getRandomDigit();
        }, 50);
    }

    function stopFlicker() {
        clearInterval(interval);
        quantumDigit1.textContent = quantumDigit1.getAttribute("data-value");
        quantumDigit2.textContent = quantumDigit2.getAttribute("data-value");
        quantumDigit3.textContent = quantumDigit3.getAttribute("data-value");
        quantumDigit4.textContent = quantumDigit4.getAttribute("data-value");
        quantumDigit5.textContent = quantumDigit5.getAttribute("data-value");
        quantumDigit6.textContent = quantumDigit6.getAttribute("data-value");
    }

    quantumClockMain.onmouseenter = () => {
        stopFlicker();
    };

    quantumClockMain.onmouseleave = () => {
        startFlicker();
    };

    startFlicker();

    // Main Function
    const now = new Date();
    let seconds = now.getSeconds();
    let minutes = now.getMinutes();
    let hours = now.getHours();


    const params = new URLSearchParams(window.location.search);
    const time = params.get("time");
    const clock = params.get("clock");
    const mode = params.get("mode");
    let clickClock = "1"

    if (clock && clock >= 1 && clock <= 10 && mode && (mode == "click" || (mode.substring(0, 8) == "speedrun" && Number(mode.substring(8, 10)) >= 1 && Number(mode.substring(8, 10)) <= 60))) {
        clickClock = clock;
    }

    if (mode && mode == "click") {
        document.body.onclick = () => {
            let newClock = Number(clickClock) + 1;
            if (newClock > 10) {
                newClock -= 10;
            }
            clickClock = newClock.toString();
            setClock(clickClock);
        };
    } else if (mode && (mode.substring(0, 8) == "speedrun" && Number(mode.substring(8, 10)) >= 1 && Number(mode.substring(8, 10)) <= 60)) {
        setInterval(() => {
            let newClock = Number(clickClock) + 1;
            if (newClock > 10) {
                newClock -= 10;
            }
            clickClock = newClock.toString();
            setClock(clickClock);
        }, Number(mode.substring(8, 10)) * 1000);
    }

    if (time && time.length == 6) {
        const hoursString = time.substring(0, 2);
        const minutesString = time.substring(2, 4);
        const secondsString = time.substring(4, 6);

        if (hoursString >= 0 && hoursString < 24 && minutesString >= 0 && minutesString < 60 && secondsString >= 0 && secondsString < 60) {
            hours = parseInt(hoursString);
            minutes = parseInt(minutesString);
            seconds = parseInt(secondsString);
        }
    }

    updateClock();
    setInterval(() => updateClock(), 1000);

    function updateClock() {
        if (mode && (mode == "click" || (mode.substring(0, 8) == "speedrun" && Number(mode.substring(8, 10)) >= 1 && Number(mode.substring(8, 10)) <= 60))) {
            setClock(clickClock);
        } else if (clock) {
            setClock(clock);
        } else if (hours >= 0 && hours < 4) {
            // Sundial
            updateSundial(hours, minutes, seconds);

        } else if (hours >= 4 && hours < 8) {
            // Water Clock
            updateWaterClock(hours, minutes, seconds);
        } else if (hours >= 8 && hours < 12) {
            // Candle Clock
            updateCandleClock(hours, minutes, seconds);
        } else if (hours >= 12 && hours < 16) {
            // Mechanical Clock
            updateMechanicalClock(hours, minutes, seconds);
        } else if (hours >= 16 && hours < 19) {
            // Pendulum Clock
            updatePendulumClock(hours, minutes, seconds);
        } else if (hours == 19) {
            if (minutes < 40) {
                // Nixie Clock
                updateNixieClock(hours, minutes, seconds);
            } else if (minutes < 50) {
                // LED Clock
                updateLEDClock(hours, minutes, seconds);
            } else {
                // GUI Clock
                updateGUIClock(hours, minutes, seconds);
            }
        } else if (hours == 20) {
            if (minutes < 7) {
                // LED Clock
                updateGUIClock(hours, minutes, seconds);
            } else {
                // Data Clock
                updateDataClock(hours, minutes, seconds);
            }
        } else {
            // Quantum Clock
            updateQuantumClock(hours, minutes, seconds);
        }

        seconds++;
        if (seconds == 60) {
            seconds = 0;
            minutes++;
            if (minutes == 60) {
                minutes = 0;
                hours++;
                if (hours == 24) {
                    hours = 0;
                }
            }
        }
    }

    // Set Clock Function
    function setClock(clock) {
        if (clock == "1") {
            // Sundial
            updateSundial(hours, minutes, seconds);
        } else if (clock == "2") {
            // Water Clock
            updateWaterClock(hours, minutes, seconds);
        } else if (clock == "3") {
            // Candle Clock
            updateCandleClock(hours, minutes, seconds);
        } else if (clock == "4") {
            // Mechanical Clock
            updateMechanicalClock(hours, minutes, seconds);
        } else if (clock == "5") {
            // Pendulum Clock
            updatePendulumClock(hours, minutes, seconds);
        } else if (clock == "6") {
            // Nixie Clock
            updateNixieClock(hours, minutes, seconds);
        } else if (clock == "7") {
            // LED Clock
            updateLEDClock(hours, minutes, seconds);
        } else if (clock == "8") {
            // GUI Clock
            updateGUIClock(hours, minutes, seconds);
        } else if (clock == "9") {
            // Data Clock
            updateDataClock(hours, minutes, seconds);
        } else {
            // Quantum Clock
            updateQuantumClock(hours, minutes, seconds);
        }
    }

    // Functions fot each clock
    function updateSundial(hours, minutes, seconds) {
        document.body.classList = "show-sundial";
        let angle = (hours % 12 + minutes / 60 + seconds / 3600) * 18;
        if (hours % 12 < 7) {
            document.documentElement.style.setProperty("--sundial-shadow-angle-right", angle + "deg");
            document.documentElement.style.setProperty("--sundial-shadow-angle-left", "0deg");
        } else {
            document.documentElement.style.setProperty("--sundial-shadow-angle-right", "0deg");
            document.documentElement.style.setProperty("--sundial-shadow-angle-left", 216 - angle + "deg");
        }
    }

    function updateWaterClock(hours, minutes, seconds) {
        document.body.classList = "show-water-clock";
        let percentage = (hours % 6 + minutes / 60 + seconds / 3600) / 7 * 100;
        if (hours < 6 || hours % 12 < 6) {
            document.getElementById("water-clock-marks").classList = "water-clock-marks water-clock-marks-1";
        } else {
            document.getElementById("water-clock-marks").classList = "water-clock-marks water-clock-marks-2";
        }
        document.documentElement.style.setProperty("--water-clock-height", percentage + "%");
    }

    function updateCandleClock(hours, minutes, seconds) {
        document.body.classList = "show-candle-clock";
        let fraction = (hours % 12 + minutes / 60 + seconds / 3600) / 12;
        const candleClockMarks = document.getElementById("candle-clock-marks");
        const candleClockMark = document.getElementById("candle-clock-mark-1");
        const markHeight = candleClockMark.clientHeight;
        const markSpacing = (candleClockMarks.clientHeight - markHeight * 12) / 13;
        document.documentElement.style.setProperty(
            "--candle-clock-height",
            `${1 -
            (fraction * 12 * (markSpacing + markHeight)) /
            candleClockMarks.clientHeight
            }`
        );
    }

    function updateMechanicalClock(hours, minutes, seconds) {
        document.body.classList = "show-mechanical-clock";
        let hours12 = hours % 12;
        let angle = (hours12 + minutes / 60 + seconds / 3600) * 30 - 90;
        document.documentElement.style.setProperty("--mechanical-clock-angle", angle + "deg");
        updateGears();
    }

    function updatePendulumClock(hours, minutes, seconds) {
        document.body.classList = "show-pendulum-clock";
        let hours12 = hours % 12;
        let hourAngle = (hours12 + minutes / 60 + seconds / 3600) * 30 - 90;
        let minuteAngle = (minutes + seconds / 60) * 6 - 90;
        document.documentElement.style.setProperty("--pendulum-clock-hour-angle", hourAngle + "deg");
        document.documentElement.style.setProperty("--pendulum-clock-minute-angle", minuteAngle + "deg");
    }

    function updateNixieClock(hours, minutes, seconds) {
        document.body.classList = "show-nixie-clock";
        let timeString = hours.toString().padStart(2, "0") + minutes.toString().padStart(2, "0") + seconds.toString().padStart(2, "0");
        let display1 = document.getElementById("nixie-clock-display-1");
        let display2 = document.getElementById("nixie-clock-display-2");
        let display3 = document.getElementById("nixie-clock-display-3");
        let display4 = document.getElementById("nixie-clock-display-4");
        let display5 = document.getElementById("nixie-clock-display-5");
        let display6 = document.getElementById("nixie-clock-display-6");

        display1.classList = "nixie-clock-display nixie-1-" + timeString[0] + "-on";
        display2.classList = "nixie-clock-display nixie-2-" + timeString[1] + "-on";
        display3.classList = "nixie-clock-display nixie-3-" + timeString[2] + "-on";
        display4.classList = "nixie-clock-display nixie-4-" + timeString[3] + "-on";
        display5.classList = "nixie-clock-display nixie-5-" + timeString[4] + "-on";
        display6.classList = "nixie-clock-display nixie-6-" + timeString[5] + "-on";
    }

    function updateLEDClock(hours, minutes, seconds) {
        document.body.classList = "show-led-clock";
        let timeString = hours.toString().padStart(2, "0") + minutes.toString().padStart(2, "0") + seconds.toString().padStart(2, "0");
        let display1 = document.getElementById("led-clock-display-1");
        let display2 = document.getElementById("led-clock-display-2");
        let display3 = document.getElementById("led-clock-display-3");
        let display4 = document.getElementById("led-clock-display-4");
        let display5 = document.getElementById("led-clock-display-5");
        let display6 = document.getElementById("led-clock-display-6");

        display1.classList = "led-clock-display led-clock-display-" + timeString[0];
        display2.classList = "led-clock-display led-clock-display-" + timeString[1];
        display3.classList = "led-clock-display led-clock-display-" + timeString[2];
        display4.classList = "led-clock-display led-clock-display-" + timeString[3];
        display5.classList = "led-clock-display led-clock-display-" + timeString[4];
        display6.classList = "led-clock-display led-clock-display-" + timeString[5];
    }

    function updateGUIClock(hours, minutes, seconds) {
        document.body.classList = "show-gui-clock";
        let timeString = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0") + ":" + seconds.toString().padStart(2, "0");
        document.getElementById("gui-clock-time").textContent = timeString;
    }

    function updateDataClock(hours, minutes, seconds) {
        document.body.classList = "show-data-clock";
        let timeString = hours.toString().padStart(2, "0") + ":" + minutes.toString().padStart(2, "0");
        document.getElementById("data-clock-time").textContent = timeString;
        document.getElementById("data-clock-date").textContent = new Date(hours.toString().padStart(2, "0") + minutes.toString().padStart(2, "0"), 0, seconds * 366 / 60).toLocaleDateString("en-US", { month: "long", day: "numeric" }) + ", " + hours.toString().padStart(2, "0") + minutes.toString().padStart(2, "0");
    }

    function updateQuantumClock(hours, minutes, seconds) {
        document.body.classList = "show-quantum-clock";
        let timeString = hours.toString().padStart(2, "0") + minutes.toString().padStart(2, "0") + seconds.toString().padStart(2, "0");
        let display1 = document.getElementById("quantum-clock-digit-1");
        let display2 = document.getElementById("quantum-clock-digit-2");
        let display3 = document.getElementById("quantum-clock-digit-3");
        let display4 = document.getElementById("quantum-clock-digit-4");
        let display5 = document.getElementById("quantum-clock-digit-5");
        let display6 = document.getElementById("quantum-clock-digit-6");

        display1.setAttribute("data-value", timeString[0]);
        display2.setAttribute("data-value", timeString[1]);
        display3.setAttribute("data-value", timeString[2]);
        display4.setAttribute("data-value", timeString[3]);
        display5.setAttribute("data-value", timeString[4]);
        display6.setAttribute("data-value", timeString[5]);
    }

};