/*var options = {
    chart: {
        type: 'bar'
    },

    series: [{
        name: 'sales',
        data: [30, 40, 45, 50, 49, 60, 70, 91, 125]
    }],

    xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
    }
};*/



/*START FUNCTIONALITY*/



let file;
let title;


let importDisable = true;
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

const clearData = () => {
    document.getElementById("dataLocation").innerHTML = "No data";
    document.getElementById("functionBts").classList.add("hide");
    document.getElementById("viewFunction").innerHTML = "";
    document.getElementById("displayPanel").classList.add("hide");
    revenueList = null;
    expenseList = null;
    localStorage.removeItem("csvData");
    sessionStorage.removeItem("expenseAmounts");
    /*start analyze vars*/
    dataA = [], dataATotal = 0, dataB = [], dataBTotal = 0, initialAmount = 0, aTotal = 0, bTotal = 0;
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
            console.log("ready to apply values.");
        }

        return false;
    }, 2000);
    return false;
}

const getData = () => {

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
        document.getElementById("viewFunction").innerHTML = "Expenses";
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
    //console.log("FROM buildObjects: JSON.stringify(temp): " + JSON.stringify(temp));
    let tempObj = [];
    let tempIncome = [];
    let tempExpenses = [];
    const year = document.querySelector("select[name='menu-select-year']").value;
    const month = document.querySelector("select[name='menu-select-month']").value;
    temp = temp.split("\n");
    let dateList = [];
    for (let i = 0; i < temp.length; i++) {
        //"01/02/2022","-6.49","*","","GOOGLE GSUITE_web-presen650-2530000 CA"
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
            document.getElementById("dataLocation").innerHTML = "data stored locally";
            document.getElementById("functionBts").classList.remove("hide");
            document.getElementById("viewFunction").innerHTML = "Expenses";
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
//const fileReader = new FileReader();
const handleOnChange = () => {

    file = document.getElementById("csvFileInput").files[0];

    console.log("handleOnChange file: " + file);
    if (file) {

        console.log("file: " + file);
        importDisable = false;
    } else {
        console.log("file FAIL: " + file);
    }
};
const handleOnSubmit = (type) => {


    console.log("HANDLE ON SUBMIT file: " + file);
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
            console.log("error csvOutput: " + csvOutput)
        }
    } else {
        console.log("error file: " + file);
    }
    importDisable = true;
};



const buildListAmounts = (list) => {

    if (list.length > 0) {

        console.log("JSON.stringify(list): " + JSON.stringify(list));



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
    document.getElementById("displayPanel").classList.remove("hide");
}





const viewData = (viewFunc) => {
    /*start analyze vars*/
    dataA = [], dataATotal = 0, dataB = [], dataBTotal = 0, initialAmount = 0, aTotal = 0, bTotal = 0;
    document.getElementById("dataB").innerHTML = "";
    document.getElementById("dataA").innerHTML = "";
    document.getElementById("initialAmount").innerHTML = "";
    document.getElementById("aTotal").innerHTML = "";
    document.getElementById("bTotal").innerHTML = "";


    if (viewFunc === "expenses") {
        list = expenseList;
        title = "expense";
    } else {
        list = revenueList;
        title = "income";
    }
    document.getElementById("viewFunction").innerHTML = viewFunc;
    [].forEach.call(document.querySelectorAll("button.btn[data-view]"), (e) => {
        e.classList.remove("active");
    })
    document.querySelector("button.btn[data-view='" + viewFunc + "']").classList.add("active");

    console.log("list: " + JSON.stringify(list));
    buildListAmounts(list);

}

/*END FUNCTIONALITY*/






/*var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();*/