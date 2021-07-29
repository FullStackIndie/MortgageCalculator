function load() {
    calculateMortgage("false");
}

function getMortgage() {
    let mortgage = JSON.parse(localStorage.getItem('mortgages')) || {
        "months": 0,
        "principal": 0,
        "interest": 0
    };
    return mortgage;
}

function saveMortgage(value) {
    let mortgage = getMortgage();
    if (value === "true") {
        mortgage = {
            months: parseInt(document.getElementById("initialMonths").value),
            principal: parseInt(document.getElementById("initialPrincipal").value),
            interest: parseInt(document.getElementById("initialInterest").value),
        };
        localStorage.setItem("mortgages", JSON.stringify(mortgage));
    }
    return mortgage;
}

function calculateMortgage(value) {
    let mortgage = saveMortgage(value);
    let monthlyRate = getRate(mortgage.interest);
    let initialLoan = parseInt(mortgage.principal);
    let months = parseInt(mortgage.months);
    let denominator = getMonthlyPayment(monthlyRate, months);
    let monthlyPay = (initialLoan) * (monthlyRate / denominator);

    const template = document.getElementById("Data-Template");
    const resultsBody = document.getElementById("resultsBody");
    resultsBody.innerHTML = "";

    let totalInterest = 0;
    let remainingLoan = initialLoan;

    for (let i = 0; i < months; i++) {
        const dataRow = document.importNode(template.content, true);

        let monthlyInterest = remainingLoan * monthlyRate;
        totalInterest += monthlyInterest;
        let monthlyPrincipal = monthlyPay - monthlyInterest;
        let monthlyPayment = monthlyPay + monthlyRate;
        remainingLoan -= monthlyPrincipal;
        let balance = remainingLoan;

        dataRow.getElementById("interest").textContent = monthlyInterest.toFixed(2);
        dataRow.getElementById("month").textContent = i + 1;
        dataRow.getElementById("payment").textContent = monthlyPayment.toFixed(2);
        dataRow.getElementById("principal").textContent = monthlyPrincipal.toFixed(2);
        dataRow.getElementById("totalInterest").textContent = totalInterest.toFixed(2);
        dataRow.getElementById("balance").textContent = balance.toFixed(2);
        resultsBody.appendChild(dataRow);
    }
    document.getElementById("resultPrincipal").textContent = initialLoan.toFixed(2);
    document.getElementById("resultInterest").textContent = totalInterest.toFixed(2);
    document.getElementById("resultCost").textContent = (initialLoan + totalInterest).toFixed(2);
}

function getRate(rate) {
    let r = parseInt(rate) / 1200;
    return r;
}

function getMonthlyPayment(rate, months) {
    let m = (1 - Math.pow((1 + (rate)), -months));
    return m;
}