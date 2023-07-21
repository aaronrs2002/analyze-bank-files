let file;
let title;
let incomeLabels = [];
let expenseLabels = [];
let expenseAmounts = [];
let incomeAmounts = [];
let monthMenu = "01";
let yearMenu = "2022";
let revenueList = [];
let expenseList = [];
let list = expenseList;
/*start analyze vars*/
let dataA = [];
let dataATotal = 0;
let dataB = [];
let dataBTotal = 0;
let initialAmount = 0;
let aTotal = 0;
let bTotal = 0;
let amounts = [Number(dataATotal), Number(dataBTotal)];
let labels = [title + " List A", title + " List B"];

var options = {
    series: [],
    total: 0,
    chart: {
        type: 'donut',
    },
    labels: [],
    responsive: [
        {
            breakpoint: undefined,
            options: {
                chart: {
                    width: "100%",
                    height: "100%",
                    position: 'center',
                    horizontalAlign: 'center',
                    offsetX: 0,
                    offsetY: 0,

                },

                legend: {

                    width: 150,
                    height: "auto",
                    position: 'right',
                    horizontalAlign: 'right',
                    offsetX: 75,
                    offsetY: 0,
                }
            }
        }
    ]
    ,
    plotOptions: {
        pie: {
            customScale: 1,
            labels: false,

        }
    }

};
// Create chart with init options
// Note that the link to the chart object is in the GLOBAL scope
var chart = new ApexCharts(document.getElementById('chart'), options);

/*START FUNCTIONALITY*/
const clearData = () => {
    [].forEach.call(document.querySelectorAll("data-view"), (e) => {
        e.classList.remove("active");
    });
    document.getElementById("dataLocation").innerHTML = "No data";
    document.getElementById("functionBts").classList.add("hide");
    document.getElementById("viewFunction").innerHTML = "";
    document.getElementById("displayPanel").classList.add("hide");
    revenueList = null;
    expenseList = null;
    localStorage.removeItem("csvData");
    sessionStorage.removeItem("expenseAmounts");
    sessionStorage.removeItem("incomeA");
    sessionStorage.removeItem("incomeB");
    sessionStorage.removeItem("expenseA");
    sessionStorage.removeItem("expenseB");
    /*start analyze vars*/
    dataA = [], dataATotal = 0, dataB = [], dataBTotal = 0, initialAmount = 0, aTotal = 0, bTotal = 0;
}

const prepForNewData = () => {
    const idList = ["dataA", "dataB", "aTotal", "initialAmount", "bTotal"];
    for (let i = 0; i < idList.length; i++) {
        document.getElementById(idList[i]).innerHTML = "";
    }
    dataA = [], dataATotal = 0, dataB = [], dataBTotal = 0, initialAmount = 0, aTotal = 0, bTotal = 0, amounts = [];
}

const applyValues = () => {
    setTimeout(() => {//THE INPUT FIELDS NEED A FEW MILLI SECONDS TO BUILD BEFORE YOU PUT THE VALUES IN./
        let ready = false;
        while (ready === false) {
            if (revenueList && expenseList) {
                for (let j = 0; j < revenueList.length; j++) {
                    if (document.querySelector("[name='" + revenueList[j].itemName + "']")) {
                        document.querySelector("[name='" + revenueList[j].itemName + "']").value = revenueList[j].amount;
                    }
                }
                for (let j = 0; j < expenseList.length; j++) {
                    if (document.querySelector("[name='" + expenseList[j].itemName + "']")) {
                        document.querySelector("[name='" + expenseList[j].itemName + "']").value = expenseList[j].amount;
                    }
                }
                ready = true;
            }
        }
        return false;
    }, 2000);
    return false;
}

const getData = () => {
    prepForNewData();
    const year = document.querySelector("select[name='menu-select-year']").value;
    const month = document.querySelector("select[name='menu-select-month']").value;
    revenueList = null;
    expenseList = null;
    const buildObj = (obj) => {
        revenueList = [...obj[0].income];
        expenseList = [...obj[0].expenses];
        applyValues();
        let tempIncomeLabels = [];
        let tempIncomeAmounts = [];
        for (let i = 0; i < obj[0].income.length; i++) {
            tempIncomeLabels.push(obj[0].income[i].itemName);
            tempIncomeAmounts.push(Number(obj[0].income[i].amount));
        }
        incomeLabels = tempIncomeLabels;
        incomeAmounts = tempIncomeAmounts;
        let tempExpenseLabels = [];
        let tempExpenseAmounts = [];
        for (let i = 0; i < obj[0].expenses.length; i++) {
            tempExpenseLabels.push(obj[0].expenses[i].itemName);
            tempExpenseAmounts.push(Number(obj[0].expenses[i].amount));
        }
        expenseLabels = tempExpenseLabels;
        expenseAmounts = tempExpenseAmounts;
        sessionStorage.setItem("expenseAmounts", JSON.stringify(tempExpenseAmounts));
        return false;
    }
    if (localStorage.getItem("csvData")) {
        document.getElementById("dataLocation").innerHTML = "Data stored locally";
        document.getElementById("functionBts").classList.remove("hide");
        document.getElementById("viewFunction").innerHTML = "Select Expenses or Income";
        document.getElementById("displayPanel").classList.remove("hide");
        let data = JSON.parse(localStorage.getItem("csvData"));
        for (let i = 0; i < data.length; i++) {
            if (year + "-" + month == data[i].id) {
                buildObj(data[i].monthYear);
            }
        }
        return false;
    }
    return false;
}


const buildObjects = (temp) => {
    let tempObj = [];
    let tempIncome = [];
    let tempExpenses = [];
    const year = document.querySelector("select[name='menu-select-year']").value;
    const month = document.querySelector("select[name='menu-select-month']").value;
    temp = temp.split("\n");
    let dateList = [];
    for (let i = 0; i < temp.length; i++) {
        let prepLine = temp[i].split(",");
        let originalDate = prepLine[0];
        originalDate = originalDate.substring(1, originalDate.length - 1);
        originalDate = originalDate.substring(6, originalDate.length) + "-" + originalDate.substring(0, 2);
        let id = originalDate;
        let originalPrice = prepLine[1];
        if (originalPrice) {
            let amount = originalPrice.substring(1, (originalPrice.length - 1));
            amount = Number(amount)
            let originalName = prepLine[4].replace(/[&\/\\'"“]/g, '');
            originalName = originalName.substring(0, originalName.length);

            if ((typeof Number(originalPrice)) === "number") {


                if (id && dateList.indexOf(id) === -1) {
                    tempObj.push({
                        id,
                        monthYear: [{ income: [], expenses: [] }]

                    });
                    dateList.push(id)
                }
                if (amount > 0) {

                    tempIncome.push({
                        id,
                        itemName: originalName + "(" + prepLine[0].substring(1, 11) + ")",
                        amount
                    });
                } else {
                    tempExpenses.push({
                        id,
                        itemName: originalName + "(" + prepLine[0].substring(1, 11) + ")",
                        amount: (amount * -1)
                    });
                }
            }
        }
    }

    for (let i = 0; i < tempObj.length; i++) {
        for (let j = 0; j < tempIncome.length; j++) {
            if (tempObj[i].id === tempIncome[j].id) {
                tempObj[i].monthYear[0].income.push({ itemName: tempIncome[j].itemName, amount: tempIncome[j].amount });
            }
        }
        for (let j = 0; j < tempExpenses.length; j++) {
            if (tempObj[i].id === tempExpenses[j].id) {
                tempObj[i].monthYear[0].expenses.push({ itemName: tempExpenses[j].itemName, amount: tempExpenses[j].amount });
            }
        }
    }

    localStorage.setItem("csvData", JSON.stringify(tempObj));
    setTimeout(() => {
        if (localStorage.getItem("csvData")) {
            globalAlert("alert-success", "Data uploaded. Select \"Expenses\" or \"Income\".");
            document.getElementById("dataLocation").innerHTML = "data stored locally";
            document.getElementById("functionBts").classList.remove("hide");
            document.getElementById("viewFunction").innerHTML = "Select Expenses or Income";
            document.getElementById("displayPanel").classList.remove("hide");
        } else {
            document.getElementById("dataLocation").innerHTML = "No data saved";
            document.getElementById("functionBts").classList.add("hide");
            document.getElementById("displayPanel").classList.add("hide");
            document.getElementById("viewFunction").innerHTML = "";
        }
    }, 500);
    getData();
    return false;
}

//START FILE READER
const handleOnChange = () => {
    file = document.getElementById("csvFileInput").files[0];
    if (file) {
        document.getElementById("importBt").disabled = false;
    } else {
        console.log("file FAIL: " + file);
    }
};
const handleOnSubmit = (type) => {

    try {
        if (file) {
            var reader = new FileReader();
            reader.readAsText(file, "UTF-8");
            reader.onload = function (evt) {
                let csvOutput = evt.target.result;

                if (type === "csv") {
                    buildObjects(csvOutput);
                } else {
                    let tempObj = JSON.stringify(JSON.parse(csvOutput));
                    localStorage.setItem("csvData", tempObj);
                    getData();
                }

            }
            reader.onerror = function (evt) {

                console.log("error csvOutput: " + csvOutput);
                globalAlert("alert-danger", "Your file gave me an error");
                return false;
            }
        }
    } catch (error) {
        globalAlert("alert-danger", "This data gave me an error: " + error);
        return false;
    }


};

const buildListAmounts = (list) => {

    try {
        if (list.length > 0) {
            let theList = list;
            let tempList = [];
            let tempLabels = [];
            let tempAmounts = [];
            for (let i = 0; i < theList.length; i++) {
                tempLabels.push(theList[i].itemName);
                tempAmounts.push(theList[i].amount);
            }
            for (let i = 0; i < tempLabels.length; i++) {
                tempList.push({ itemName: tempLabels[i], amount: tempAmounts[i] });
            }
            dataA = theList;
            let dataA_HTML = "";
            for (let i = 0; i < dataA.length; i++) {
                let funcA = ` onClick="javascript:seperateData('${dataA[i].itemName}',${dataA[i].amount},'A')" `;
                dataA_HTML = dataA_HTML + "<button type='button' " + funcA + "  class='list-group-item list-group-item-action'>" + dataA[i].itemName + " : $" + dataA[i].amount + "</button>";
            }
            document.getElementById("dataA").innerHTML = dataA_HTML
            let tempInitialAmount = 0;
            for (let i = 0; i < theList.length; i++) {
                tempInitialAmount = tempInitialAmount + Number(theList[i].amount);
            }
            initialAmount = tempInitialAmount;
            document.getElementById("initialAmount").innerHTML = initialAmount;

        }

    } catch (error) {

        globalAlert("alert-danger", "Shomething doesn't look correct. Check things like your month and year above or the file format: " + error);
        return false;

    }




    return false;

    document.getElementById("displayPanel").classList.remove("hide");
}

const viewData = (viewFunc) => {
    prepForNewData();
    if (viewFunc === "expenses") {
        list = expenseList;
        title = "Expense";
    } else {
        list = revenueList;
        title = "Income";
    }
    options.labels = [title + " List A", title + " List B"];
    document.getElementById("viewFunction").innerHTML = viewFunc;
    [].forEach.call(document.querySelectorAll("button.btn[data-view]"), (e) => {
        e.classList.remove("active");
    })
    document.querySelector("button.btn[data-view='" + viewFunc + "']").classList.add("active");
    buildListAmounts(list);
}

const seperateData = (itemName, amount, initialList) => {
    let tempB = dataB;
    let tempA = dataA;
    let tempData = [];
    let tempMerge = [];
    let tempATotal = 0;
    let tempBTotal = 0;
    if (initialList === "A") {
        for (let i = 0; i < tempA.length; i++) {
            if (itemName !== tempA[i].itemName) {
                tempData.push(tempA[i]);
                tempATotal = tempATotal + Number(tempA[i].amount)
            }
        }
        tempMerge = [...dataB, { itemName, amount }];
        dataA = tempData;
        dataB = tempMerge;

        aTotal = tempATotal;
        bTotal = initialAmount - tempATotal;

    } else {
        for (let i = 0; i < tempB.length; i++) {
            if (itemName !== tempB[i].itemName) {
                tempData.push(tempB[i])
            }
        }
        tempMerge = [...dataA, { itemName, amount }];
        dataA = tempMerge;
        dataB = tempData;
    }
    let dataB_HTML = "";
    for (let i = 0; i < dataB.length; i++) {
        let funcB = ` onClick="javascript:seperateData('${dataB[i].itemName}',${dataB[i].amount},'B')" `;
        dataB_HTML = dataB_HTML + "<button type='button' " + funcB + "  class='list-group-item list-group-item-action'>" + dataB[i].itemName + " : $" + dataB[i].amount + "</button>";
    }
    document.getElementById("dataB").innerHTML = dataB_HTML;
    let dataA_HTML = "";
    for (let i = 0; i < dataA.length; i++) {
        let funcA = ` onClick="javascript:seperateData('${dataA[i].itemName}',${dataA[i].amount}, 'A')" `;
        dataA_HTML = dataA_HTML + "<button type='button' " + funcA + "  class='list-group-item list-group-item-action'>" + dataA[i].itemName + " : $" + dataA[i].amount + "</button>";
    }
    document.getElementById("dataA").innerHTML = dataA_HTML;
    //START A
    dataA = tempData;
    let tempDataATotal = 0;
    for (let i = 0; i < tempData.length; i++) {
        tempDataATotal = tempDataATotal + Number(tempData[i].amount)
    }
    dataATotal = tempDataATotal;
    document.getElementById("aTotal").innerHTML = dataATotal;
    sessionStorage.setItem(title.toLowerCase() + "A", tempDataATotal);
    ///START B
    dataB = tempMerge;
    let tempDataBTotal = 0;
    for (let i = 0; i < tempMerge.length; i++) {
        tempDataBTotal = tempDataBTotal + Number(tempMerge[i].amount);
    }
    dataBTotal = tempDataBTotal;
    document.getElementById("bTotal").innerHTML = dataBTotal;
    sessionStorage.setItem(title.toLowerCase() + "B", dataBTotal);
    amounts = [Number(dataATotal), Number(dataBTotal)];
    document.getElementById("chart").innerHTML = "";
    options.total = parseInt(dataATotal) + parseInt(dataBTotal);
    options.series = amounts;
    chart.render();  // Firstly, prepare the ground
    chart.updateOptions({
        series: options.series,
        total: 0,
        chart: {
            type: 'donut',
        },
        labels: [title + " List A", title + " List B"],
        responsive: [{
            breakpoint: undefined,
            options: {
                chart: {
                    width: "auto"
                },
                legend: {
                    position: 'bottom'
                }
            }
        }]
    }); // Secondly, draw we want
    // chart.updateOptions(newOptions); Redraw we want
}
/*END FUNCTIONALITY*/

function tadaRollover(element) {
    document.querySelector("[data-tada='" + element + "']").classList.add("tada");
    if (document.querySelector("#footerIcons a i[data-tada='" + element + "']")) {
        document.querySelector("#footerIcons a i[data-tada='" + element + "']").classList.add("tada");
    }
}
function tadaRollout(element) {
    document.querySelector("[data-tada='" + element + "']").classList.remove("tada");
    if (document.querySelector("#footerIcons a i[data-tada='" + element + "']")) {
        document.querySelector("#footerIcons a i[data-tada='" + element + "']").classList.remove("tada");
    }
}



