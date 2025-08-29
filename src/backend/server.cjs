const express = require('express');
const app = express();
const cors = require('cors')
require('dotenv').config()
const inventoryRoutes = require('./routes/inventoryRoutes.cjs')

const corsOptions = {
    origin: 'http://localhost:5173'
}
app.use(cors(corsOptions))
app.use(express.json())

app.get('/', async(req, res)=> {
    res.json(`Ini Server Express`)
})
app.use('/api/inventory', inventoryRoutes)
const port = process.env.PORT;
const host = process.env.HOST;

app.listen(port, host, ()=> {
    console.log(`Server Run at http://${host}:${port}`)
})