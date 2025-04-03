// Select DOM elements
const results = document.querySelectorAll(".calculator-totals__result");
const resetButton = document.querySelector(".calculator-totals__reset");
const billAmountInput = document.getElementById("billAmount");
const tipCustomInput = document.getElementById("tipCustom");
const personAmountInput = document.getElementById("personAmount");
const radioButtons = document.querySelectorAll(
  'input[type="radio"][name="tip"]'
);
const tip15Radio = document.getElementById("tip15");
const personAmountError = document.getElementById("personAmountError");
const billAmountError = document.getElementById("billAmountError");

// Input initial states
billAmountInput.value = "";
personAmountInput.value = "";

// Set tip15 as default
tip15Radio.checked = true;

// Create IMask instances for input masking
const billAmountInputMask = IMask(billAmountInput, {
  mask: "num",
  blocks: {
    num: {
      mask: Number,
      padFractionalZeros: true,
      thousandsSeparator: ",",
      radix: ".",
      min: 0.01,
      max: 100000,
      autofix: true,
    },
  },
});

const tipCustomInputMask = IMask(tipCustomInput, {
  mask: [
    {
      mask: "",
    },
    {
      mask: "num%",
      lazy: false,
      blocks: {
        num: {
          mask: Number,
          max: 100,
          radix: ".",
          mapToRadix: [","],
          autofix: true,
          min: 0.01,
        },
      },
    },
  ],
});

const personAmountInputMask = IMask(personAmountInput, {
  mask: Number,
  scale: 0,
  min: 0,
  max: 500,
  autofix: true,
});

// Function to format currency
const formatCurrency = (amount) =>
  amount.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const updateResults = (tipAmount, totalAmount) => {
  const formattedTip = formatCurrency(tipAmount);
  const formattedTotal = formatCurrency(totalAmount);

  results[0].textContent = formattedTip;
  results[1].textContent = formattedTotal;

  // Determine the longer text
  const maxLength = Math.max(formattedTip.length, formattedTotal.length);
  const fontSize = maxLength > 8 ? "var(--fs-2xl)" : "";

  // Apply the same font size to both elements
  results.forEach((el) => (el.style.fontSize = fontSize));
};

const resetCalculator = () => {
  // Reset input values
  billAmountInput.value = "";
  personAmountInput.value = "";
  tipCustomInput.value = "";

  // Reset masks if used
  billAmountInputMask.updateValue();
  personAmountInputMask.updateValue();
  tipCustomInputMask.updateValue();

  // Reset selected radio button to default (15%)
  tip15Radio.checked = true;

  updateResults(0, 0);
  // displayPersonAmountError(false);

  displayInputError(personAmountInput, personAmountError, false, "");
  displayInputError(billAmountInput, billAmountError, false, "");

  // Disable reset button
  resetButton.disabled = true;
};

const toggleResetButton = () => {
  const hasInput =
    billAmountInput.value.trim() !== "" ||
    personAmountInput.value.trim() !== "" ||
    tipCustomInput.value.trim() !== "" ||
    [...radioButtons].some((radio) => radio.checked && radio.value !== "15");

  resetButton.disabled = !hasInput; // Enable if any input is filled
};

// Function to clear the custom tip input
const clearCustomInput = () => {
  tipCustomInput.value = ""; // Clear custom tip input value
  tipCustomInputMask.updateValue(); // Synchronize the mask
};

// Ensures only one tip input is active at a time
const handleTipAmountChange = (event) => {
  if (event.target.name === "tip") {
    clearCustomInput(); // Clear custom input when a radio button is selected
    calculateAndUpdateResults();
  }
};

// Function to display input errors
const displayInputError = (
  inputElement,
  errorElement,
  hasError,
  errorMessage
) => {
  if (hasError) {
    errorElement.textContent = errorMessage; // Show error message
    errorElement.style.display = "block";
    errorElement.setAttribute("aria-live", "polite"); // Use polite for less intrusive announcements
    errorElement.setAttribute("id", "error-" + inputElement.id); // Ensure unique ID for error message

    inputElement.classList.add("error"); // Add error class
    inputElement.setAttribute("aria-invalid", "true"); // Mark the input as invalid
    inputElement.setAttribute("aria-errormessage", errorElement.id); // Link input to the error message
  } else {
    errorElement.style.display = "none"; // Hide error
    inputElement.classList.remove("error"); // Remove error class
    inputElement.removeAttribute("aria-invalid"); // Remove invalid state
    inputElement.removeAttribute("aria-errormessage"); // Remove link to error message
  }
};

// Person amount validation logic
const handlePersonAmountError = () => {
  const value = personAmountInput.value.trim();
  const hasError = !validations.personAmount(value);
  displayInputError(
    personAmountInput,
    personAmountError,
    hasError,
    "Can't be zero"
  );
};

// Listen for change
personAmountInputMask.on("accept", handlePersonAmountError);

const handleBillAmountError = () => {
  const rawValue = billAmountInputMask.unmaskedValue.replace(/,/g, ""); // Strip commas
  const numericValue = Number(rawValue);

  if (numericValue > 99999) {
    hasError = true;

    displayInputError(
      billAmountInput,
      billAmountError,
      true,
      "Can't exceed 100,000"
    );

    return; // Stop further execution
  }

  hasError = false; // Reset error state
  displayInputError(billAmountInput, billAmountError, false, "");
};

// Listen for change
billAmountInputMask.on("accept", handleBillAmountError);

// Object to store validation logic
const validations = {
  billAmount: (value) => parseFloat(value.replace(/,/g, "")) > 0, // validate bill amount
  personAmount: (value) => value !== "" && parseInt(value, 10) > 0, // validate person amount
  tip: (customTipPercentage, selectedTipRadio) =>
    customTipPercentage > 0 ||
    (selectedTipRadio &&
      !isNaN(parseFloat(selectedTipRadio.value)) &&
      parseFloat(selectedTipRadio.value) > 0), // validate tip
};

// Refactored validateInputs function
const validateInputs = () => {
  const billAmount = billAmountInput.value;
  const personAmount = personAmountInput.value.trim();
  const selectedTipRadio = [...radioButtons].find((radio) => radio.checked);
  const customTipPercentage = tipCustomInput.value
    ? parseFloat(tipCustomInput.value)
    : 0;

  // Using the validation object to validate each input
  const isBillAmountValid = validations.billAmount(billAmount);
  const isPersonAmountValid = validations.personAmount(personAmount);
  const isTipValid = validations.tip(customTipPercentage, selectedTipRadio);

  const isAnyInputEmpty =
    !billAmount ||
    !personAmount ||
    (!selectedTipRadio && !tipCustomInput.value.trim());

  return {
    isBillAmountValid,
    isPersonAmountValid,
    isTipValid,
    isAnyInputEmpty,
    billAmount: parseFloat(billAmount.replace(/,/g, "")),
    personAmount,
    selectedTipRadio,
    customTipPercentage,
  };
};

const calculateAndUpdateResults = () => {
  const {
    isBillAmountValid,
    isPersonAmountValid,
    isTipValid,
    isAnyInputEmpty,
    billAmount,
    personAmount,
    selectedTipRadio,
    customTipPercentage,
  } = validateInputs();

  // If any required input is empty or invalid, reset the calculator
  if (
    isAnyInputEmpty ||
    !isBillAmountValid ||
    !isPersonAmountValid ||
    !isTipValid
  ) {
    return;
  }

  // Determine which tip to use
  let selectedTip =
    customTipPercentage > 0
      ? customTipPercentage
      : parseFloat(selectedTipRadio.value);

  // Perform calculations
  const tipAmount = (billAmount * selectedTip) / 100;
  const totalAmount = billAmount + tipAmount;

  // Calculate per person amounts
  const perPersonTip =
    Math.floor((tipAmount / parseInt(personAmount, 10)) * 100) / 100;
  const perPersonTotal =
    Math.round((totalAmount / parseInt(personAmount, 10)) * 100) / 100;

  // Update the UI with the calculated results
  updateResults(perPersonTip, perPersonTotal);
};

// Function to initialize event listeners
const initializeEventListeners = () => {
  resetButton.addEventListener("click", resetCalculator); // Reset button listener

  radioButtons.forEach((radio) => {
    radio.addEventListener("change", calculateAndUpdateResults); // To update calculations on change
    radio.addEventListener("change", handleTipAmountChange); // To clear the custom input when a radio button is selected
  });

  tipCustomInput.addEventListener("focus", () => {
    radioButtons.forEach((radio) => {
      radio.checked = false; // Uncheck all radio buttons when custom input is focused
    });
  });

  // Listen for changes in bill amount, person amount, and custom tip input
  const inputElements = [billAmountInput, personAmountInput, tipCustomInput];

  inputElements.forEach((input) => {
    input.addEventListener("input", () => {
      toggleResetButton(); // Enable reset button when user types

      if (
        !billAmountInput.value.trim() ||
        !personAmountInput.value.trim() ||
        (!tipCustomInput.value.trim() &&
          ![...radioButtons].some((radio) => radio.checked))
      ) {
        updateResults(0, 0); // Reset results if inputs are cleared
      } else {
        calculateAndUpdateResults(); // Keep calculations up to date
      }
    });
  });
};

// Initialize event listeners on DOMContentLoaded
document.addEventListener("DOMContentLoaded", () => {
  updateResults(0, 0); // Set initial state for results
  billAmountInput.classList.add("initial-state");

  initializeEventListeners(); // Initialize event listeners
});
