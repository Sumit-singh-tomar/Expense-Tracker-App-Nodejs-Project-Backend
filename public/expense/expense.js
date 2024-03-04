function parseJwt(token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
}

const userData = parseJwt(localStorage.getItem("token"))
if (userData.ispremium == 1) {
    const buyPremiumDiv = document.getElementById('buyPremium');

    const buyPremiumButton = buyPremiumDiv.querySelector('button');
    buyPremiumButton.innerHTML = "You are a Premium Member";
    buyPremiumButton.onclick = () => {
        alert('You have Already premium MemberShip');
    }

    const showLeaderBoardButton = document.createElement('button');
    showLeaderBoardButton.innerHTML = 'show LeaderBoard';
    showLeaderBoardButton.onclick = function () {
        window.location.href = '../premium/showLeaderBoard.html';
    }

    showLeaderBoard.appendChild(showLeaderBoardButton)
}

async function handleAddExpense(event) {
    try {
        event.preventDefault()
        const expenseDetail = {
            expense_name: event.target.category.value,
            amount: event.target.amount.value,
            description: event.target.description.value,
        }
        const token = localStorage.getItem('token')
        var result = await axios.post('http://54.206.7.33:3000/expense/add-expense', expenseDetail, { headers: { 'Authorization': token } })
        if (result.data.status) {
            alert(result.data.data)
            window.location.href = 'showExpense.html'
        }
    }
    catch (e) {
        alert(e.response.data.data)
    }
}

async function handleBuyPremium(event) {
    event.preventDefault()
    try {
        const token = localStorage.getItem('token')
        var result = await axios.get('http://54.206.7.33:3000/purchase/buy-premium', { headers: { "Authorization": token } })
        if (result.data.status) {
            const options = {
                "key": result.data.key_id,
                "order_id": result.data.order.id,
                "handler":
                    async function (result) {
                        const res = await axios.post('http://54.206.7.33:3000/purchase/update-transaction-status', {
                            order_id: options.order_id,
                            payment_id: result.razorpay_payment_id,
                            status: "SUCCESSFUL"
                        }, { headers: { "Authorization": token } })
                        localStorage.setItem("token", res.data.token)
                        alert("You are a Premium User Now")
                        window.location.reload()
                    }
            }

            const rzp1 = new Razorpay(options);
            rzp1.open();
            event.preventDefault();

            rzp1.on('payment.failed', async function (response) {
                await axios.post('http://54.206.7.33:3000/purchase/update-transaction-status', {
                    "order_id": options.order_id,
                    "payment_id": response.error.metadata.payment_id,
                    status: "FAILED"
                }, { headers: { "Authorization": token } })
                alert('Payment failed')
            })
        }
    }
    catch (e) {
        alert(e.response.data.data)
        console.log('e', e);
    }
}

function handleDownloadExpense(event) {
    window.location.href = 'showDownloadedfile.html'
}