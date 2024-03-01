const http = require('http');
const express = require('express');
const dontenv = require('dotenv').config()
const cors = require('cors');
const helmet = require('helmet')
const compression = require('compression')

const app = express();

const bodyParser = require('body-parser');
const registerRouter = require('./routes/register');
const expenseRouter = require('./routes/expense');
const purchaseRouter = require('./routes/purchase');
const premiumRouter = require('./routes/premium')
const passwordRouter = require('./routes/password')

app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.urlencoded({ extended: true }));
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

server.listen(process.env.PORT || 3000);