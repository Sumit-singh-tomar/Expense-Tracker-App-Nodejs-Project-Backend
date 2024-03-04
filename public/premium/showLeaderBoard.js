document.addEventListener("DOMContentLoaded", async () => {
    const token = localStorage.getItem('token')

    var result = await axios.get("http://54.206.7.33:3000/premium/show-leaderboard", { headers: { "Authorization": token } })

    console.log('result', result.data.data);

    const table = document.querySelector('table')

    result.data.data.map((item, i) => {
        const row = table.insertRow()
        const col1 = row.insertCell(0);
        col1.innerHTML = i+1;
        col1.style.width='5%';
        row.insertCell(1).innerHTML = item.name;
        row.insertCell(2).innerHTML = `&#8377;${item.totalexpense}` || 0;
    })
})