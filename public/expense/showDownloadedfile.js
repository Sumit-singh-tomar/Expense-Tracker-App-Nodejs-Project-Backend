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

    var result = await axios.get("http://54.206.7.33:3000/premium/get-downloaded-file", { headers: { "Authorization": token } })
    console.log(result);
    const table = document.querySelector('table')

    if (result.data.data.length == 0) {
        table.style.display = 'none'
        viewTable.innerHTML = userData.ispremium == 1?"You not download any file yet":"You Are Not a Premium Member, buy premium Membership to download files"
        viewTable.style.fontWeight = 'bold' 
        viewTable.style.fontSize = '30px'
    }

    result.data.data.map((item, i) => {
        const row = table.insertRow()
        row.insertCell(0).innerHTML = i + 1;
        row.insertCell(1).innerHTML = item.dates;
        row.insertCell(2).innerHTML = `<a href=${item.fileurl} target="_blank">${item.fileurl}</a>`;

    })
})

function handleDownloadFile(event) {
    if (userData.ispremium === 1) {
        axios.get("http://54.206.7.33:3000/premium/downloadexpense", { headers: { "Authorization": localStorage.getItem("token") } })
            .then((result) => {
                if (result.data.status) {
                    console.log(result.data.data);
                    const a = document.createElement('a')
                    a.href = result.data.data
                    a.download = 'myexpense.csv'
                    a.click()
                }
            })
            .catch((e) => {
                alert('false')
                console.log('e', e)
            })
    }
    else {
        alert('You Are Not a Premium Member,firstly buy premium Membership')
    }
}