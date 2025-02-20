const display = document.getElementById("current");
const historyDisplay = document.getElementById("history");
const buttons = document.querySelectorAll(".btn");
const themeSwitcher = document.getElementById("themeSwitcher");
const modeLabel = document.getElementById("modeLabel");

let currentInput = "";
let previousInput = "";
let operator = null;

// Toggle Dark Mode
themeSwitcher.addEventListener("change", () => {
    document.body.classList.toggle("dark-mode");
    modeLabel.textContent = document.body.classList.contains("dark-mode") ? "Dark Mode" : "Light Mode";
    });

    // Utility Functions
    function updateDisplay(value) {
    display.textContent = value;
    }

    // Advanced operations
    function performAdvancedOperation(op, value) {
    let num = parseFloat(value);
    if (isNaN(num)) return "";
    switch(op) {
        case "sqrt": return Math.sqrt(num);
        case "square": return num * num;
        case "inverse": return num === 0 ? "Error" : 1 / num;
        default: return num;
    }
    }

    // Main Button Handler
    buttons.forEach(button => {
    button.addEventListener("click", () => {
        const value = button.getAttribute("data-value");

        if (value === "C") {
        currentInput = "";
        previousInput = "";
        operator = null;
        updateDisplay("0");
        historyDisplay.textContent = "";
        return;
        }

        if (value === "DEL") {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput || "0");
        return;
        }

        if (value === "±") {
        if (currentInput) {
            currentInput = (parseFloat(currentInput) * -1).toString();
            updateDisplay(currentInput);
        }
        return;
        }

        // Advanced operations
        if (["sqrt", "square", "inverse"].includes(value)) {
        if (currentInput === "") return;
        let result = performAdvancedOperation(value, currentInput);
        historyDisplay.textContent = `${value}(${currentInput})`;
        currentInput = result.toString();
        updateDisplay(currentInput);
        return;
        }

        // Operator buttons
        if (["+", "-", "*", "/", "%"].includes(value)) {
        if (currentInput === "") return;
        if (previousInput !== "") {
            // Chain calculation
            let result = eval(previousInput + operator + currentInput);
            previousInput = result.toString();
            updateDisplay(previousInput);
        } else {
            previousInput = currentInput;
        }
        operator = value;
        currentInput = "";
        historyDisplay.textContent = previousInput + " " + operator;
        return;
        }

        if (value === "=") {
        if (currentInput === "" || previousInput === "") return;
        let result = eval(previousInput + operator + currentInput);
        historyDisplay.textContent += " " + currentInput + " =";
        updateDisplay(result);
        currentInput = result.toString();
        previousInput = "";
        operator = null;
        return;
        }

        // Append number or decimal point
        if (value === "." && currentInput.includes(".")) return;
        currentInput += value;
        updateDisplay(currentInput);
    });
    });

    // Keyboard support (optional enhancement)
    document.addEventListener("keydown", (e) => {
    const key = e.key;
    if (/\d/.test(key) || key === ".") {
        currentInput += key;
        updateDisplay(currentInput);
    } else if (["+", "-", "*", "/", "%"].includes(key)) {
        if (currentInput === "") return;
        previousInput = currentInput;
        operator = key;
        currentInput = "";
        historyDisplay.textContent = previousInput + " " + operator;
    } else if (key === "Enter") {
        if (currentInput === "" || previousInput === "") return;
        let result = eval(previousInput + operator + currentInput);
        historyDisplay.textContent += " " + currentInput + " =";
        updateDisplay(result);
        currentInput = result.toString();
        previousInput = "";
        operator = null;
    } else if (key === "Backspace") {
        currentInput = currentInput.slice(0, -1);
        updateDisplay(currentInput || "0");
    } else if (key === "Escape") {
        currentInput = "";
        previousInput = "";
        operator = null;
        updateDisplay("0");
        historyDisplay.textContent = "";
    }
    });
