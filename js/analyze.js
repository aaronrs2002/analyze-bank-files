


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
    if (props.title !== "Income") {
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
    //START A
    dataA = tempData;
    let tempDataATotal = 0;
    for (let i = 0; i < tempData.length; i++) {
        tempDataATotal = tempDataATotal + Number(tempData[i].amount)
    }
    dataATotal = tempDataATotal;
    sessionStorage.setItem(title + "A", tempDataATotal);
    ///START B
    dataB = tempMerge;
    let tempDataBTotal = 0;
    for (let i = 0; i < tempMerge.length; i++) {
        tempDataBTotal = tempDataBTotal + Number(tempMerge[i].amount);
    }
    dataBTotal = tempDataBTotal;
    sessionStorage.setItem(title + "B", tempDataBTotal);
}
