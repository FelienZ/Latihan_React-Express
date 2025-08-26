const express = require('express');
const app = express();

require('dotenv').config();
const port = process.env.PORT;
const host = process.env.HOST;
const cors = require('cors')
const path = require('path')
const fs = require('fs/promises');
const { nanoid } = require('nanoid');

app.use(express.json())
app.use(cors());

app.get('/', async(req, res) => {
    res.status(200).json(`This is Express Server`)
})

app.get('/api/inventory', async(req, res)=> {
    const filePath = path.join(__dirname, '../data/inventory.json')
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'))
    res.json(data)
})
app.post('/api/inventory', async(req, res) => {
    const { name, category, price, stock, desc } = req.body;
    // console.log('tes: ', name)
    const id = nanoid(10)
    try {
        const filePath = path.join(__dirname, '../data/inventory.json');
        const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        const newData = {
            id, name, category, price, stock, desc
        }
        if(name.trim() === '' || category.trim() === '' || typeof(price) !== 'number' || typeof(stock) !== 'number'){
            throw new Error('Invalid Data!')
        }
        const findData = data.some(i => i.name.trim().toLowerCase() === name.trim().toLowerCase())
        if(findData){
            throw new Error('Duplikasi Data!')
        }
        data.push(newData);
        await fs.writeFile(filePath, JSON.stringify(data, null, 2))
        res.status(201).send({item: newData, message: 'SuccessFully Added'})
    } catch (error) {
        console.info(error)
        throw new Error('Kesalahan dalam sistem')
    }
})
app.put('/api/inventory/:id', async(req, res) => {
    try {
        const filePath = path.join(__dirname, '../data/inventory.json');
        const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
        const id = req.params.id;
        const { name, category, price, stock, desc } = req.body;
        const newData = {
            id, name, category, price, stock, desc
        }
        if(name.trim() === '' || category.trim() === '' || typeof(price) !== 'number' || typeof(stock) !== 'number'){
            throw new Error('Invalid Data!')
        }
        const findData = data.some(i => i.name.trim().toLowerCase() === name.trim().toLowerCase() && i.id !== id)
            if(findData){
                throw new Error('Duplikasi Data!')
            }
        const checkData = data.map(i => {
            if(i.id === id){
                return {...newData}
            }
            return i
        })
        await fs.writeFile(filePath, JSON.stringify(checkData, null, 2))
        res.status(200).send({item: newData, info: 'Successfully Updated'})
    } catch (error) {
        console.info(error);
        throw new Error(`Gagal Memperbarui`)
    }
})
app.delete('/api/inventory/:id', async(req, res) => {
    const filePath = path.join(__dirname, '../data/inventory.json');
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const id = req.params.id;
    const filterData = data.filter(i => i.id !== id);
    await fs.writeFile(filePath, JSON.stringify(filterData, null, 2))
    res.status(200).send({target: id , message: 'Successfully Deleted'})
})
app.use(async(req, res)=> {
    res.status(404).json(`Cannot Get Path`)
})

app.listen(port, host, ()=> {
    console.log(`Server Run at http://${host}:${port}`)
})