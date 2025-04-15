// Calculator state variables
let firstNumber = null;
let operator = null;
let displayValue = '0';
let isNewNumber = true;
let isCalculationDone = false;

// Get DOM elements
const display = document.querySelector('.display');
const numberButtons = document.querySelectorAll('.number');
const operatorButtons = document.querySelectorAll('.operator');
const equalsButton = document.querySelector('.equals');
const clearButton = document.querySelector('.clear');

// Update display function
function updateDisplay(forceValue = null) {
    if (forceValue !== null) {
        display.textContent = forceValue;
        return;
    }

    if (operator && !isNewNumber) {
        // Show full expression
        display.textContent = `${firstNumber} ${operator} ${displayValue}`;
    } else {
        // Show just the current number
        display.textContent = displayValue;
    }
}

// Handle digit input
function inputDigit(digit) {
    if (isCalculationDone) {
        displayValue = digit;
        isCalculationDone = false;
        isNewNumber = false;
    } else if (isNewNumber) {
        displayValue = digit;
        isNewNumber = false;
    } else {
        // Prevent multiple decimal points
        if (digit === '.' && displayValue.includes('.')) {
            return;
        }
        // Limit the length of numbers to prevent overflow
        if (displayValue.length < 12) {
            displayValue = displayValue === '0' && digit !== '.' 
                ? digit 
                : displayValue + digit;
        }
    }
    updateDisplay();
}

// Handle operator input
function handleOperator(nextOperator) {
    const inputValue = parseFloat(displayValue);

    if (firstNumber === null) {
        // First number input
        firstNumber = inputValue;
        operator = nextOperator;
    } else if (operator) {
        // If we already have a first number and operator, perform the operation
        try {
            const result = operate(operator, firstNumber, inputValue);
            displayValue = formatResult(result);
            firstNumber = parseFloat(displayValue);
            operator = nextOperator;
            updateDisplay(displayValue); // Show just the result briefly
        } catch (error) {
            displayValue = 'Error';
            firstNumber = null;
            operator = null;
            updateDisplay();
            return;
        }
    }

    isNewNumber = true;
    isCalculationDone = false;
}

// Handle equals
function handleEquals() {
    if (firstNumber === null || operator === null || isNewNumber) {
        return;
    }

    const inputValue = parseFloat(displayValue);
    try {
        const result = operate(operator, firstNumber, inputValue);
        displayValue = formatResult(result);
        firstNumber = null;
        operator = null;
        isNewNumber = true;
        isCalculationDone = true;
        updateDisplay();
    } catch (error) {
        displayValue = 'Error';
        firstNumber = null;
        operator = null;
        isNewNumber = true;
        updateDisplay();
    }
}

// Format result to prevent overflow and handle decimals
function formatResult(number) {
    if (isNaN(number) || !isFinite(number)) {
        return 'Error';
    }
    
    // Convert to string with fixed decimal places if needed
    let result = number.toString();
    
    // Handle long decimal numbers
    if (result.includes('.')) {
        result = parseFloat(number.toFixed(8)).toString();
    }
    
    // Handle long numbers
    if (result.length > 12) {
        if (Math.abs(number) < 1e-7 || Math.abs(number) > 1e11) {
            return number.toExponential(6);
        }
        return 'Error';
    }
    
    return result;
}

// Clear function
function clearCalculator() {
    displayValue = '0';
    firstNumber = null;
    operator = null;
    isNewNumber = true;
    isCalculationDone = false;
    updateDisplay();
}

// Event listeners
numberButtons.forEach(button => {
    button.addEventListener('click', () => inputDigit(button.textContent));
});

operatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        const op = button.textContent === '×' ? '*' : 
                   button.textContent === '÷' ? '/' : 
                   button.textContent;
        handleOperator(op);
    });
});

equalsButton.addEventListener('click', handleEquals);
clearButton.addEventListener('click', clearCalculator);

// Initialize display
updateDisplay();

// Basic math operations
function add(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Both arguments must be numbers');
    }
    return a + b;
}

function subtract(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Both arguments must be numbers');
    }
    return a - b;
}

function multiply(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Both arguments must be numbers');
    }
    return a * b;
}

function divide(a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Both arguments must be numbers');
    }
    if (b === 0) {
        throw new Error('Division by zero is not allowed');
    }
    return a / b;
}

function operate(operator, a, b) {
    if (typeof a !== 'number' || typeof b !== 'number') {
        throw new Error('Both operands must be numbers');
    }
    
    switch (operator) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        default:
            throw new Error('Invalid operator');
    }
}
