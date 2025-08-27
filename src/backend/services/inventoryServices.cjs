// Berhubungan langsung ke data : fs, JSON

const fs = require('fs/promises');
const { nanoid } = require('nanoid');
const path = require('path');

const filePath = path.join(__dirname, '../../data/inventory.json');

async function getInventoryItems() {
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    return data;
}

async function postItems({name, category, price, stock, desc}) {
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const checkData = data.some(i => i.name.trim().toLowerCase() === name.trim().toLowerCase());
    if(checkData){
        throw new Error('Duplikasi Data!')
    }
    const id = nanoid(10)
    const newData = {
        id, name, category, price, stock, desc
    }
    data.push(newData)
    await fs.writeFile(filePath, JSON.stringify(data, null, 2))
    return newData;
}

async function putItems({id, name, category, price, stock, desc}) {
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const checkData = data.some(i => i.name.trim().toLowerCase() === name.trim().toLowerCase() && i.id !== id);
    if(checkData){
        throw new Error('Duplikasi Data!')
    }
    const newData = {
        id, name, category, price, stock, desc
    }
    const mapData = data.map(i => {
        if(i.id === id){
            return {...newData}
        }
        return i
    })
    await fs.writeFile(filePath, JSON.stringify(mapData, null, 2))
    return newData;
}

async function deleteItem(id) {
    const data = JSON.parse(await fs.readFile(filePath, 'utf-8'));
    const filterData = data.filter(i => i.id !== id);
    await fs.writeFile(filePath, JSON.stringify(filterData, null, 2))
}

module.exports = { getInventoryItems, postItems, putItems, deleteItem}