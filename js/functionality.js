var options = {
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
};



/*START FUNCTIONALITY*/



let file;
//let [panel, setPanel] = useState("importCSV");
let importDisable = true;
let incomeLabels = [];
let expenseLabels = [];
let expenseAmounts = [];
let incomeAmounts = [];
let monthMenu = "January";
let yearMenu = "2022";
let revenueList = [];
let expenseList = [];
let dataLocation = null;

const clearData = () => {
    dataLocation = null;
    revenueList = null;
    expenseList = null;
    localStorage.removeItem("csvData");
    sessionStorage.removeItem("expenseAmounts");
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
    setTimeout(() => {


        monthMenu = month;
        yearMenu = year;
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
            dataLocation = "local";
            let data = JSON.parse(localStorage.getItem("csvData"));
            for (let i = 0; i < data.length; i++) {
                if (year + "-" + month + ":" + props.userEmail == data[i].id) {
                    console.log("We are building from local storage JSON.stringify(data[i].monthYear): " + JSON.stringify(data[i].monthYear));
                    buildObj(data[i].monthYear);
                }
            }
            return false;
        }

    }, 2000);
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
        //"01/02/2022","-6.49","*","","GOOGLE GSUITE_web-presen650-2530000 CA"
        let prepLine = temp[i].split(",");
        let originalDate = prepLine[0];
        originalDate = originalDate.substring(1, originalDate.length - 1);
        originalDate = originalDate.substring(6, originalDate.length) + "-" + originalDate.substring(0, 2);
        let id = originalDate + ":" + props.userEmail;
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
            props.showAlert("CSV file saved to local storage.", "success");
        } else {
            props.showAlert("That did not save to local storage.", "danger");
        }
    }, 500)
    getData();
    return false;
}
//START FILE READER
const fileReader = new FileReader();

const handleOnChange = (e) => {
    /* const e = document.getElementById("csvFileInput");*/
    console.log("e.target: " + e.target);
    //  file = e.target.files[0];
    file = document.getElementById("csvFileInput").value;
    if (file) {
        importDisable = false;
    }
};
const handleOnSubmit = (e, type) => {
    e.preventDefault();
    localStorage.setItem("csvData", "");
    if (file) {
        fileReader.onload = function (event) {
            const csvOutput = event.target.result;

            if (type === "csv") {
                buildObjects(csvOutput);
            } else {
                let tempObj = JSON.stringify(JSON.parse(csvOutput));
                localStorage.setItem("csvData", tempObj);
                getData();
            }

        };

        fileReader.readAsText(file);
    }
    document.querySelector("input[type='file']").value = "";
    importDisable = true;
};

/*END FUNCTIONALITY*/






var chart = new ApexCharts(document.querySelector("#chart"), options);

chart.render();