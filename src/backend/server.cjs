const express = require('express');
const app = express();
const cors = require('cors')
const inventoryRoutes = require('./routes/inventoryRoutes.cjs')

app.use(cors())
app.use(express.json())

app.get('/', async(req, res)=> {
    res.json(`Ini Server Express`)
})
app.use('/api/inventory', inventoryRoutes)
require('dotenv').config()
const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, ()=> {
    console.log(`Server Run at http://${host}:${port}`)
})