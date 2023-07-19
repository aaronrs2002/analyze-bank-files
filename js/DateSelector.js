let years = "";
let monthList = "";
let date = new Date();
let year = date.getFullYear();
const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
for (let i = year; i < (parseInt(year) + 3); i++) {
    years = years + "<option value='" + i + "'>" + i + "</option>";
}
document.querySelector("select[name='menu-select-year']").innerHTML = years;
for (let i = 0; i < months.length; i++) {
    let value = i + 1;
    if (value < 10) {
        value = "0" + value;
    }
    monthList = monthList + "<option value='" + value + "'>" + months[i] + "</option>";
}
document.querySelector("select[name='menu-select-month']").innerHTML = monthList;


