const http = require('http');
const express = require('express');
const cors = require('cors');
const app = express();

const bodyParser = require('body-parser');
const registerRouter = require('./routes/register');
const expenseRouter = require('./routes/expense');
const purchaseRouter = require('./routes/purchase');
const premiumRouter = require('./routes/premium')
const passwordRouter = require('./routes/password')

app.use(cors());
app.use(bodyParser.json({ extended: false }));
app.use('/register', registerRouter);
app.use('/expense', expenseRouter);
app.use('/purchase', purchaseRouter);
app.use('/premium', premiumRouter)
app.use('/password', passwordRouter)

app.use((req, res) => {
    res.send("Page not fuound 404!");
})

const server = http.createServer(app);

server.listen(3000);


// xsmtpsib-51e7c87e935e3d63050dd76b3677a78a2703cde27a61c4d089366f9fb13fa20f-HZr8t4vMSjyPYdXT