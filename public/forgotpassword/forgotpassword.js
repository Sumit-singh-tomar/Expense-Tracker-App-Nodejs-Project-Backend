function handleForgotPassword(event) {
    event.preventDefault()
    const userData = { email_id: event.target.email_id.value }
    axios.post('http://54.206.7.33:3000/password/forgotpassword', userData)
        .then((result) => {
            console.log(result);
            if (result.data.status) {
                window.location.href = `showresetpage.html?email=${result.data.registerEmail}`
            }
        })
        .catch((e) => {
            console.log(e);
            alert('Something Went Wrong')
        })
}