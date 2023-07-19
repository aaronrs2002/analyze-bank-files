


let dataA = [];
let dataATotal = 0;
let dataB = [];
let dataBTotal = 0;
let initialAmount = 0;
let aTotal = 0;
let bTotal = 0;

//DATA
const seperateData = (itemName, amount, initialList) => {
    let title = "income";
    if (title !== "income") {
        title = "expense"
    }
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
                console.log("Number(tempA[i].amount): " + Number(tempA[i].amount) + " (tyopeof Number(tempA[i].amount)): " + typeof Number(tempA[i].amount));
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
    sessionStorage.setItem(title + "A", tempDataATotal);
    ///START B
    dataB = tempMerge;
    let tempDataBTotal = 0;
    for (let i = 0; i < tempMerge.length; i++) {
        tempDataBTotal = tempDataBTotal + Number(tempMerge[i].amount);
    }
    dataBTotal = tempDataBTotal;
    document.getElementById("bTotal").innerHTML = dataBTotal;
    sessionStorage.setItem(title + "B", dataBTotal);
}
