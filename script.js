const amountInput = document.querySelector("#mortgage-amount");
const mortgageTerm = document.querySelector("#mortgage-term");
const interestRate = document.querySelector("#interest-rate");
const monthlyRepayment = document.querySelector("#monthly-repayment");
const totalRepayment = document.querySelector("#total-repayment");

const mortgageForm = document.querySelector(".mortgage-form");
const completedResults = document.querySelector(".completed-results");

const emptyResults = document.querySelector(".empty-results");
const clearBtn = document.querySelector(".clear-btn");

const errors = document.querySelectorAll(".error-message");
const inputGroups = document.querySelectorAll(".input-group");

amountInput.addEventListener("input", () => {
    let value = amountInput.value.replace(/,/g, "");

    // Allow digits only
    value = value.replace(/\D/g, "");

    // Add commas every three digits
    amountInput.value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
});

const fields = [amountInput, mortgageTerm, interestRate];

fields.forEach((input, index) => {
    input.addEventListener("input", () => {
        if (input.value !== "") {
            errors[index].hidden = true;
            inputGroups[index].classList.remove("active");
        }
    });
});


  

mortgageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if(amountInput.value===""|| mortgageTerm.value===""|| interestRate.value===""){
       errors.forEach((error) => {
        error.hidden = false;
        });
       inputGroups.forEach((inputGroup) => {
        inputGroup.classList.add("active");
         });
      return;
    }
    const principal = Number(amountInput.value.replace(/,/g, ""));
    const years = Number(mortgageTerm.value);
    const annualRate = Number(interestRate.value);

    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = years * 12;

    let monthlyPayment;
    
    const selectedMortgage = document.querySelector(
    'input[name="mortgageType"]:checked');
    
    if (selectedMortgage && selectedMortgage.value === "interest-only") {
        monthlyPayment = principal * monthlyRate;
    } else if (annualRate === 0) {
    // 0% interest
        monthlyPayment = principal / totalMonths;
    } else {
    // Repayment: interest + loan amount
        monthlyPayment = principal * monthlyRate *
        Math.pow(1 + monthlyRate, totalMonths) /
        (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }


    
    monthlyRepayment.textContent = "£"+monthlyPayment.toLocaleString("en-GB", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
   });
    const total = monthlyPayment * totalMonths;

    const finalTotal = selectedMortgage && selectedMortgage.value === "interest-only"
        ? total + principal
        : total;

    totalRepayment.textContent = "£" + finalTotal.toLocaleString("en-GB", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });


    emptyResults.style.display = "none";
    completedResults.style.display = "flex";
    
});

clearBtn.addEventListener("click", () => {
    mortgageForm.reset();

    completedResults.style.display = "none";
    emptyResults.style.display = "flex";
});