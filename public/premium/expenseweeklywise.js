document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token")
    axios.get("http://54.206.7.33:3000/premium/get-expense-weekly-wise", { headers: { "Authorization": token } })
        .then((result) => {
            if (result.data.status) {

                const table = document.querySelector('table')

                result.data.data.map((item) => {
                    const row = table.insertRow()
                    row.insertCell(0).innerHTML = item.week;
                    row.insertCell(1).innerHTML = item.monthname;
                    row.insertCell(2).innerHTML = `&#8377;${item.amt}`;
                    row.insertCell(3).innerHTML = item.income ? `&#8377;${item.income}` : '';
                    let saving = item.income - item.amt
                    const flag = saving.toString().includes('-')
                    row.insertCell(4).innerHTML = flag?'':`&#8377;${saving}`;
                })
            }
        })
        .catch((e) => {
            alert(e.response.data.data)
            console.log(e);
        })
})

function handleMonthlyWise() {
    window.location.href = 'expensemonthlywise.html'
}

function handleWeeklyWise() {
    window.location.reload()
}

function handleshowpremiumuserexpenses() {
    window.location.href = '../expense/showExpense.html'

}