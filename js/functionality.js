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
let autoChooseCategories = [{ hasText: "COFFEE", category: "coffee" },
{ hasText: "COFFEE", category: "coffee" },
{ hasText: "REPLENISH SAVINGS", category: "emergency-savings" },
{ hasText: "SMOKE", category: "fun" },
{ hasText: "VAPE", category: "fun" },
{ hasText: "APPLE", category: "streaming" },
{ hasText: "NETFLIX", category: "streaming" },
{ hasText: "Hulu", category: "streaming" },
{ hasText: "MICROSOFT*CONSOLE", category: "streaming" },
{ hasText: "PARAMOUNT", category: "streaming" },
{ hasText: "Primo Water", category: "groceries" },
{ hasText: "CONVENIENT CORNER", category: "fun" },
{ hasText: "ANIMAL HOSP", category: "dogs" },
{ hasText: "EOS FIT", category: "fitness" },
{ hasText: "HOMEDEPOT", category: "home" },
{ hasText: "AMAZON RETA", category: "groceries" },
{ hasText: "GREAT CLIPS", category: "services" },
{ hasText: "SUPER CUTS", category: "services" },
{ hasText: "BLACK ROCK COF", category: "coffee" },
{ hasText: "CHEBA HUT", category: "restaurant" },
{ hasText: "TEXAS ROADHOUSEF", category: "restaurant" },

];

if (localStorage.getItem("transactionCategories")) {
    autoChooseCategories = [...autoChooseCategories, ...JSON.parse(localStorage.getItem("transactionCategories"))];
}


console.log("JSON.stringify(autoChooseCategories): " + JSON.stringify(autoChooseCategories));

let categoryValues = ["default", "streaming", "groceries", "home", "car", "fun", "services"];
let categoryOptions = [
    { value: "default", htmlTxt: "Assign category for selected item" },
    { value: "streaming", htmlTxt: "Streaming Services" },
    { value: "groceries", htmlTxt: "Groceries" },
    { value: "home", htmlTxt: "Home" },
    { value: "car", htmlTxt: "Car" },
    { value: "fun", htmlTxt: "Fun Expenses" },
    { value: "services", htmlTxt: "services" },
];





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
            if (tempExpenseLabels.indexOf(obj[0].expenses[i].category) === -1) {
                tempExpenseLabels.push(obj[0].expenses[i].category);
            }

            /*
            
            let categoryValues = ["default", "streaming", "groceries","home","car","fun","services"];
            let categoryOptions = [
            
             { value: "default", htmlTxt: "Assign category for selected item" },
            
            
            */




            if (categoryValues.indexOf(obj[0].expenses[i].category) === -1) {
                categoryValues.push(obj[0].expenses[i].category);

                categoryOptions.push({ value: obj[0].expenses[i].category, htmlTxt: obj[0].expenses[i].category });

                //categoryListHTML = categoryListHTML + `<option value='${obj[0].expenses[i].itemName}'>${obj[0].expenses[i].itemName}</option>`
            }










            /****end new category functionality */

            tempExpenseAmounts[tempExpenseLabels.indexOf(obj[0].expenses[i].category)] = (Number(tempExpenseAmounts[tempExpenseLabels.indexOf(obj[0].expenses[i].category)]) + Number(obj[0].expenses[i].amount))

            // tempExpenseAmounts.push(Number(obj[0].expenses[i].amount));
        }
        let categoryListHTML = "";


        for (let i = 0; i < categoryOptions.length; i++) {


            categoryListHTML = categoryListHTML + `<option value='${categoryOptions[i].value}'>${categoryOptions[i].htmlTxt}</option>`



        }



        document.querySelector("select[name='categoryList']").innerHTML = categoryListHTML;
        document.querySelector("select[name='categoryListFromKeyWord']").innerHTML = categoryListHTML;





        expenseLabels = tempExpenseLabels;
        expenseAmounts = tempExpenseAmounts;

        console.log("expenseLabels: " + expenseLabels + " - expenseAmounts: " + expenseAmounts);









        //sessionStorage.setItem("expenseAmounts", JSON.stringify(tempExpenseAmounts));
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


    if (localStorage.getItem("transactionCategories")) {
        autoChooseCategories = JSON.parse(localStorage.getItem("transactionCategories"));
    }

    let tempObj = [];
    let tempIncome = [];
    let tempExpenses = [];
    const year = document.querySelector("select[name='menu-select-year']").value;
    const month = document.querySelector("select[name='menu-select-month']").value;

    temp = temp.split("\n");


    console.log("JSON.stringify(temp): " + JSON.stringify(temp));

    let dateList = [];
    for (let i = 0; i < temp.length; i++) {
        let prepLine = temp[i].split(`,`);

        let originalDate = prepLine[0];
        originalDate = originalDate.substring(1, originalDate.length - 1);
        originalDate = originalDate.substring(6, originalDate.length) + "-" + originalDate.substring(0, 2);
        let id = originalDate;
        let originalPrice = prepLine[2];
        if (originalPrice) {
            let amount = originalPrice.substring(1, (originalPrice.length - 1));
            amount = Number(amount)
            let originalName = prepLine[1].replace(/[&\/\\'"“]/g, '');
            originalName = originalName.substring(0, originalName.length);

            let autoAssignCat = "default";

            for (let i = 0; i < autoChooseCategories.length; i++) {
                if (originalName.toLowerCase().indexOf(autoChooseCategories[i].hasText.toLowerCase()) !== -1) {

                    //console.log("UPDATED originalName: " + originalName + " - autoChooseCategories[i].hasText: " + autoChooseCategories[i].hasText + " - category updated to: " + autoChooseCategories[i].category);

                    autoAssignCat = autoChooseCategories[i].category;

                }

            }

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
                        amount,
                        category: autoAssignCat
                    });
                } else {
                    tempExpenses.push({
                        id,
                        itemName: originalName + "(" + prepLine[0].substring(1, 11) + ")",
                        amount: (amount * -1),
                        category: autoAssignCat
                    });
                }
            }
        }
    }

    for (let i = 0; i < tempObj.length; i++) {
        for (let j = 0; j < tempIncome.length; j++) {
            if (tempObj[i].id === tempIncome[j].id) {


                let autoAssignCat = "default";

                for (let s = 0; s < autoChooseCategories.length; s++) {
                    if (tempIncome[j].itemName.toLowerCase().indexOf(autoChooseCategories[s].hasText.toLowerCase()) !== -1) {

                        autoAssignCat = autoChooseCategories[s].category;
                        // console.log("UPDATED autoAssignCat: " + autoAssignCat + " - FOR ITEM: " + tempIncome[j].itemName);

                    }


                }


                tempObj[i].monthYear[0].income.push({ itemName: tempIncome[j].itemName, amount: tempIncome[j].amount, category: autoAssignCat });
            }
        }
        for (let j = 0; j < tempExpenses.length; j++) {
            if (tempObj[i].id === tempExpenses[j].id) {



                let autoAssignCat = "default";

                for (let s = 0; s < autoChooseCategories.length; s++) {
                    if (tempExpenses[j].itemName.toLowerCase().indexOf(autoChooseCategories[s].hasText.toLowerCase()) !== -1) {

                        autoAssignCat = autoChooseCategories[s].category;
                        // console.log("UPDATED autoAssignCat: " + autoAssignCat + " - FOR ITEM: " + tempExpenses[j].itemName);

                    }

                }
                tempObj[i].monthYear[0].expenses.push({ itemName: tempExpenses[j].itemName, amount: tempExpenses[j].amount, category: autoAssignCat });
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
    console.log("JSON.stringify(list): " + JSON.stringify(list));

    try {
        if (list.length > 0) {
            let theList = list;
            let tempList = [];
            let tempLabels = [];
            let tempAmounts = [];




            for (let i = 0; i < theList.length; i++) {
                if (tempLabels.indexOf(theList[i].category) === -1) {
                    tempLabels.push(theList[i].category);
                    tempAmounts.push(0);
                }
                // tempLabels.push(theList[i].itemName);
                let addTo = tempLabels.indexOf(theList[i].category);
                tempAmounts[Number(addTo)] = (tempAmounts[Number(addTo)] + Number(theList[i].amount));
                //tempAmounts.push(theList[i].amount);
            }
            /*   for (let i = 0; i < tempLabels.length; i++) {
                 tempList.push({ category: tempLabels[i], transactions: [] })
                 //tempList.push({ itemName: tempLabels[i], amount: tempAmounts[i] });
             }
 
             for(let i=0;i<tempList.length;i++){
                   if (tempList[i].category===)
               }*/
            console.log("tempLabels: " + tempLabels + " - tempAmounts: " + tempAmounts);



            /****RENDER HERE */


            chart.render();  // Firstly, prepare the ground
            chart.updateOptions({
                series: tempAmounts,
                total: 0,
                chart: {
                    type: 'donut',
                },
                labels: tempLabels,
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



            /********END RENDER */

            dataA = theList;
            let dataA_HTML = "";
            for (let i = 0; i < dataA.length; i++) {
                let funcA = ` onClick="javascript:seperateData('${dataA[i].itemName}',${dataA[i].amount},'A', '${dataA[i].category}')" `;
                dataA_HTML = dataA_HTML + "<button type='button' " + funcA + "  class='list-group-item list-group-item-action' data-num='" + i + "' data-category='" + dataA[i].category + "'>" + dataA[i].itemName + " : $" + dataA[i].amount + "</button>";
            }
            document.getElementById("dataA").innerHTML = dataA_HTML
            let tempInitialAmount = 0;
            for (let i = 0; i < theList.length; i++) {
                tempInitialAmount = tempInitialAmount + Number(theList[i].amount);
            }
            initialAmount = tempInitialAmount;
            document.getElementById("initialAmount").innerHTML = initialAmount;

            incomeLabels = tempLabels;
            expenseLabels = tempLabels;


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
        title = expenseLabels;
    } else {
        list = revenueList;
        title = incomeLabels
    }
    options.labels = title;
    document.getElementById("viewFunction").innerHTML = viewFunc;
    [].forEach.call(document.querySelectorAll("button.btn[data-view]"), (e) => {
        e.classList.remove("active");
    })
    document.querySelector("button.btn[data-view='" + viewFunc + "']").classList.add("active");
    buildListAmounts(list);
}


const populateCategory = (whichInput) => {


    if (whichInput === "addKeyWord") {
        let selectedCategory = document.querySelector("select[name='categoryListFromKeyWord']").value;


        if (selectedCategory === "default") {
            return false;
        } else {
            document.querySelector("input[name='assignCategoryFromKeyWord']").value = selectedCategory;
        }
        let newKeyWord = document.querySelector("input[name='" + whichInput + "']").value;
        if (newKeyWord.length === 0) {
            return false;
        }

    } else {

        let selectedCategory = document.querySelector("select[name='categoryList']").value;
        if (selectedCategory === "default") {
            return false;
        } else {
            document.querySelector("input[name='assignCategory']").value = selectedCategory;
        }
        let selectedTransaction = document.querySelector("input[name='chosenTransaction']").value;
        if (selectedTransaction.length === 0) {
            return false;
        }
    }







}



const addKeyWord = () => {

    if (localStorage.getItem("transactionCategories")) {
        autoChooseCategories = JSON.parse(localStorage.getItem("transactionCategories"));
    }

    let keyWord = document.querySelector("input[name='addKeyWord']").value;
    let selectedCategory = document.querySelector("select[name='categoryListFromKeyWord']").value;
    let assignCategory = document.querySelector("input[name='assignCategoryFromKeyWord']").value;

    autoChooseCategories.push({ hasText: keyWord, category: assignCategory });

    console.log("PUSHED: " + keyWord + " - to category: " + assignCategory)

    localStorage.setItem("transactionCategories", JSON.stringify(autoChooseCategories));

    document.querySelector("input[name='addKeyWord']").value = "";
    document.querySelector("select[name='categoryListFromKeyWord']").selectedIndex = 0;
    document.querySelector("input[name='assignCategoryFromKeyWord']").value = "";

    globalAlert("alert-success", "Success! Updates will appear next time you upload your CSV file/Bank Statement.");
}





const updateCategory = (whichInput) => {

    let selectedTransaction = document.querySelector("input[name='chosenTransaction']").value;
    let selectedCategory = document.querySelector("select[name='categoryList']").value;
    let assignCategory = document.querySelector("input[name='assignCategory']").value;


    //document.querySelector("select[name='categoryListFromKeyWord']").innerHTML = categoryListHTML;

    assignCategory = assignCategory.toLowerCase();


    /*
    
    
                if (categoryValues.indexOf(obj[0].expenses[i].category) === -1) {
                    categoryValues.push(obj[0].expenses[i].category);
    
                    categoryOptions.push({ value: obj[0].expenses[i].itemName, htmlTxt: obj[0].expenses[i].itemName });
    
                    //categoryListHTML = categoryListHTML + `<option value='${obj[0].expenses[i].itemName}'>${obj[0].expenses[i].itemName}</option>`
                }
    
    
                ----------
    
    
                        let categoryListHTML = "";
    
    
            for (let i = 0; i < categoryOptions.length; i++) {
    
    
                categoryListHTML = categoryListHTML + `<option value='${categoryOptions[i].value}'>${categoryOptions[i].htmlTxt}</option>`
    
    
    
            }
    
    
   
    if (categoryValues.indexOf(assignCategory) === -1) {
        categoryOptions.push({ value: assignCategory, htmlTxt: assignCategory });

    }

    let categoryListHTML = "";
    for (let i = 0; i < categoryOptions.length; i++) {
        categoryListHTML = categoryListHTML + `<option value='${categoryOptions[i].value}'>${categoryOptions[i].htmlTxt}</option>`
    }


    document.querySelector("select[name='categoryList']").innerHTML = categoryListHTML;
 */



    let csvData = JSON.parse(localStorage.getItem("csvData"));

    for (let i = 0; i < csvData.length; i++) {

        for (let j = 0; j < csvData[i].monthYear.length; j++) {

            for (let s = 0; s < csvData[i].monthYear[j].income.length; s++) {

                if (csvData[i].monthYear[j].income[s].itemName === selectedTransaction) {
                    csvData[i].monthYear[j].income[s].category = assignCategory;
                }
            }

            for (let s = 0; s < csvData[i].monthYear[j].expenses.length; s++) {

                if (csvData[i].monthYear[j].expenses[s].itemName === selectedTransaction) {

                    console.log("csvData[i].monthYear[j].expenses[s].itemName: " + csvData[i].monthYear[j].expenses[s].itemName + " to category " + assignCategory);
                    csvData[i].monthYear[j].expenses[s].category = assignCategory;
                }
            }


        }


    }

    localStorage.setItem("csvData", JSON.stringify(csvData));

    console.log("JSON.stringify(csvData): " + JSON.stringify(csvData));

    getData();
    document.querySelector("input[name='chosenTransaction']").value = "";
    document.querySelector("select[name='categoryList']").selectedIndex = 0;
    document.querySelector("input[name='assignCategory']").value = "";


    [].forEach.call(document.querySelectorAll("#dataA button"), (e) => {
        e.disabled = false;
    });

    document.getElementById("chart").innerHTML = "<h5 class='text-danger'>Select Expenses or income to reload your data.</h5>";
    document.querySelector("input[name='chosenTransaction']").classList.remove("error");
    document.querySelector("select[name='categoryList']").classList.remove("error");
    document.querySelector("input[name='assignCategory']").classList.remove("error");


}






const seperateData = (itemName, amount, initialList, category) => {

    window.location = "#functionBts";
    document.querySelector("input[name='chosenTransaction']").classList.add("error");
    document.querySelector("select[name='categoryList']").classList.add("error");
    document.querySelector("input[name='assignCategory']").classList.add("error");


    document.querySelector("input[name='chosenTransaction']").value = itemName;

    // document.getElementById("dataA").disabled = true;





    let tempB = dataB;
    let tempA = dataA;
    let tempData = [];
    let tempMerge = [];
    let tempATotal = 0;
    let tempBTotal = 0;
    let categoryListB = [];
    let listBAmounts = []
    if (initialList === "A") {
        for (let i = 0; i < tempA.length; i++) {
            if (itemName !== tempA[i].itemName) {

                tempData.push({ itemName: tempA[i].itemName, amount: Number(tempA[i].amount), category: tempA[i].category });
                tempATotal = tempATotal + Number(tempA[i].amount);
                // category = tempA[i].category;
            }
        }
        tempMerge = [...dataB, { itemName, amount, category }];
        dataA = tempData;
        dataB = tempMerge;

        aTotal = tempATotal;
        bTotal = initialAmount - tempATotal;

    } else {
        for (let i = 0; i < tempB.length; i++) {
            if (itemName !== tempB[i].itemName) {
                categoryListB.push(tempA[i].category);
                listBAmounts.push(0);
                tempData.push({ itemName: tempA[i].itemName, amount: Number(tempA[i].amount), category: tempA[i].category });
                // category = tempB[i].category;
            }
        }

        for (let i = 0; i < tempB.length; i++) {
            listBAmounts[categoryListB.indexOf(tempB[i].category)] = (Number(listBAmounts[categoryListB.indexOf(tempB[i].category)]) + Number(tempB[i].amount))
        }


        tempMerge = [...dataA, { itemName, amount, category }];
        dataA = tempMerge;
        dataB = tempData;
    }

    let dataB_HTML = "";
    for (let i = 0; i < dataB.length; i++) {
        let funcB = ` onClick="javascript:seperateData('${dataB[i].itemName}',${dataB[i].amount},'B', '${dataB[i].category}')" `;
        dataB_HTML = dataB_HTML + "<button type='button' " + funcB + "  class='list-group-item list-group-item-action' data-num='" + i + "' data-category='" + dataB[i].category + "'>" + dataB[i].itemName + " : $" + dataB[i].amount + "</button>";
    }
    document.getElementById("dataB").innerHTML = dataB_HTML;
    let dataA_HTML = "";
    for (let i = 0; i < dataA.length; i++) {
        let funcA = ` onClick="javascript:seperateData('${dataA[i].itemName}',${dataA[i].amount}, 'A', '${dataA[i].category}')" `;
        dataA_HTML = dataA_HTML + "<button type='button' " + funcA + "  class='list-group-item list-group-item-action'  data-num='" + i + "' data-category='" + dataA[i].category + "' >" + dataA[i].itemName + " : $" + dataA[i].amount + "</button>";
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
    //sessionStorage.setItem(title.toLowerCase() + "A", tempDataATotal);
    ///START B
    dataB = tempMerge;
    let tempDataBTotal = 0;
    for (let i = 0; i < tempMerge.length; i++) {
        tempDataBTotal = tempDataBTotal + Number(tempMerge[i].amount);
    }
    dataBTotal = tempDataBTotal;
    document.getElementById("bTotal").innerHTML = dataBTotal;
    // sessionStorage.setItem(title.toLowerCase() + "B", dataBTotal);
    amounts = [Number(dataATotal), ...listBAmounts];
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
        labels: [title + " List A", ...categoryListB],
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

    [].forEach.call(document.querySelectorAll("#dataA button"), (e) => {
        e.disabled = true;
    });
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



