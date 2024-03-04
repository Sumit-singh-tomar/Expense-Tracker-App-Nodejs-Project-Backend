async function handleLogin(event) {
    try {
        event.preventDefault()
        const email_id = event.target.email_id.value
        const password = event.target.password.value
        const userDetail = { email_id: email_id, password: password }
        var result = await axios.post('http://54.206.7.33:3000/register/login-user', userDetail)
        if (result.data.status) {
            alert("User Login Succesfully")
            localStorage.setItem('token', result.data.token)
            window.location.href = '../expense/expense.html'
        }
    }

    catch (e) {
        alert(e.response.data.data)
    }
}