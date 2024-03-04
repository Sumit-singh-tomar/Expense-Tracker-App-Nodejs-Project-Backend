function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const userData = parseJwt(localStorage.getItem("token"))

document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token')
    let page = 1
    let itemperpage = userData.rowperpage || 10;

    var result = await axios.get(`http://54.206.7.33:3000/expense/get-expense?page=${page}&itemperpage=${itemperpage}`, { headers: { "Authorization": token } })

    const table = document.querySelector('table')

    if (result.data.data.length == 0) {
        table.style.display = 'none'
        viewTable.innerHTML = "You have no any expense"
        viewTable.style.fontWeight = 'bold'
        viewTable.style.fontSize = '30px'
        viewTable.style.marginTop = '3%'
        const downloadExpenseContainer = document.getElementById('downloadExpense')
        const b=downloadExpenseContainer.querySelectorAll('button')
        b.forEach((item)=>{
            item.style.display='none'
        })
    }

    createTable(result, page)
    showPagination(result.data.pageData)
})

if (userData.ispremium === 1) {
    function createTable(result, page) {
        const table = document.querySelector('table')
        table.innerHTML = ''
        const caption = table.createCaption();
        caption.innerHTML = 'Daily Expense';
        const headingRow = table.insertRow()
        headingRow.style.backgroundColor = 'tan'
        headingRow.style.color = 'white'
        headingRow.insertCell(0).innerHTML = 'Sn';
        headingRow.insertCell(1).innerHTML = 'Date';
        headingRow.insertCell(2).innerHTML = 'Description';
        headingRow.insertCell(3).innerHTML = 'Category';
        headingRow.insertCell(4).innerHTML = 'Income';
        headingRow.insertCell(5).innerHTML = 'Amount';
        headingRow.insertCell(6).innerHTML = 'Action';

        const userData = parseJwt(localStorage.getItem("token"))
        page = (page * userData.rowperpage) - (userData.rowperpage - 1)

        result.data.data.map((item, i) => {
            const row = table.insertRow()
            row.insertCell(0).innerHTML = page;
            row.insertCell(1).innerHTML = item.dates;
            row.insertCell(2).innerHTML = item.description;
            row.insertCell(3).innerHTML = item.expense_name;
            row.insertCell(4).innerHTML = item.income ? `&#8377;${item.income}` : '';
            row.insertCell(5).innerHTML = item.amount ? `&#8377;${item.amount}` : '';

            const deleteButton = document.createElement('button')
            deleteButton.innerHTML = "Delete"
            deleteButton.onclick = async function (event) {
                try {
                    const token = localStorage.getItem('token')
                    var response = await axios.delete(`http://54.206.7.33:3000/expense/delete-expense/${item.id}/${item.amount||0}`, { headers: { "Authorization": token } })
                    if (response.data.status) {
                        location.reload()
                    }
                } catch (e) {
                    alert(e.response.data.data)
                }
            }
            row.insertCell(6).appendChild(deleteButton)
            page++
        })

    }
}
else {
    function createTable(result, page) {
        const downloadExpenseContainer = document.getElementById('downloadExpense')
        const b=downloadExpenseContainer.querySelectorAll('button')
        b.forEach((item)=>{
            item.style.display='none'
        })
        const table = document.querySelector('table')
        table.innerHTML = ''
        const caption = table.createCaption();
        caption.innerHTML = 'Expense List';
        const headingRow = table.insertRow()
        headingRow.style.backgroundColor = 'tan'
        headingRow.style.color = 'white'
        headingRow.insertCell(0).innerHTML = 'Sn';
        headingRow.insertCell(1).innerHTML = 'Expense Name';
        headingRow.insertCell(2).innerHTML = 'Amount';
        headingRow.insertCell(3).innerHTML = 'Description';
        headingRow.insertCell(4).innerHTML = 'Action';

        const userData = parseJwt(localStorage.getItem("token"))
        page = (page * userData.rowperpage) - (userData.rowperpage - 1)

        result.data.data.map((item) => {
            const row = table.insertRow()
            row.insertCell(0).innerHTML = page;
            row.insertCell(1).innerHTML = item.expense_name;
            row.insertCell(2).innerHTML = `&#8377;${item.amount || item.income}`;
            row.insertCell(3).innerHTML = item.description;

            const deleteButton = document.createElement('button')
            deleteButton.innerHTML = "Delete"
            deleteButton.onclick = async function (event) {
                try {
                    const token = localStorage.getItem('token')
                    var response = await axios.delete(`http://54.206.7.33:3000/expense/delete-expense/${item.id}/${item.amount}`, { headers: { "Authorization": token } })
                    if (response.data.status) {
                        location.reload()
                    }
                } catch (e) {
                    alert(e.response.data.data)
                }
            }

            row.insertCell(4).append(deleteButton)
            page++
        })

    }
}



function getPage(page, itemperpage) {
    const token = localStorage.getItem("token")
    axios.get(`http://54.206.7.33:3000/expense/get-expense?page=${page}&itemperpage=${itemperpage}`, { headers: { "Authorization": token } })
        .then((result) => {
            if (result.data.status) {
                localStorage.setItem("token", result.data.token)
                createTable(result, page)
                showPagination(result.data.pageData)
            }
        })
        .catch((e) => {
            console.log(e);
            alert('error')
        })
}

function showPagination(data) {
    const paginationContainer = document.querySelector('#pagination')
    paginationContainer.innerHTML = ''
    if (data.ispreviouspage) {
        const previousPageButton = document.createElement('button');
        previousPageButton.innerHTML = data.previouspage
        previousPageButton.onclick = function () {
            const userData = parseJwt(localStorage.getItem("token"))
            getPage(data.previouspage, userData.rowperpage)
        }
        paginationContainer.appendChild(previousPageButton)
    }

    const currentPageButton = document.createElement('button');
    currentPageButton.innerHTML = data.currentpage
    currentPageButton.style.backgroundColor = 'tomato'
    currentPageButton.onclick = function () {
        const userData = parseJwt(localStorage.getItem("token"))
        getPage(data.currentpage, userData.rowperpage)
    }
    paginationContainer.appendChild(currentPageButton)

    if (data.isnextpage) {
        const nextPageButton = document.createElement('button');
        nextPageButton.innerHTML = data.nextpage
        nextPageButton.onclick = function () {
            const userData = parseJwt(localStorage.getItem("token"))
            getPage(data.nextpage, userData.rowperpage)
        }
        paginationContainer.appendChild(nextPageButton)
    }
}

function handleshowpremiumuserexpenses() {
    window.location.reload()
}

function handleMonthlyWise() {
    window.location.href = '../premium/expensemonthlywise.html'
}

function handleWeeklyWise() {
    window.location.href = '../premium/expenseweeklywise.html'
}

function handleRowPerPage() {
    getPage(1, rowperpage.value)
}