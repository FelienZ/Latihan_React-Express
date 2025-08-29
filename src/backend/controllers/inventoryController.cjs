//kirim ke Services
const { nanoid } = require('nanoid');
const inventoryServices = require('../services/inventoryServices.cjs')

exports.getInventoryItems = async(req, res) => {
    try {
        const item = await inventoryServices.getInventoryItems();
        res.json(item)
    } catch (error) {
        res.status(500).json({message: 'Kesalahan Server!'})
    }
}

exports.addInventoryItem = async(req, res) => {
    try {
        const { name, category, price, stock, description } = req.body;
        if(name.trim() === '' || category.trim() === '' || typeof(price) !== 'number' || typeof(stock) !== 'number'){
            return res.status(400).json({message: 'Data Tidak Valid!'})
        }
        const id = nanoid(10)
        const newItem = await inventoryServices.postItems({id, name, category, price, stock, description});
        res.status(201).json({item: newItem})
    } catch (error) {
        res.status(500).json({message: `Kesalahan Server dalam Post: ${error.message}`})
    }
}

exports.updateInventoryItem = async(req, res) =>{
    try {
        const { name, category, price, stock, description } = req.body;
        const id = req.params.id;
        if(name.trim() === '' || category.trim() === '' || typeof(price) !== 'number' || typeof(stock) !== 'number'){
            return res.status(400).json({message: 'Data Tidak Valid!'})
        }
        const updateData = await inventoryServices.putItems({id, name, category, price, stock, description});
        console.log(updateData)
        res.status(200).json({item: updateData, message: 'Berhasil Memperbarui!'})
    } catch (error) {
        res.status(500).json({message: `Kesalahan Server dalam Update: ${error.message}`})
    }
}

exports.deleteInventoryItem = async(req, res) => {
    try {
        const id = req.params.id;
        await inventoryServices.deleteItem(id)
        res.status(200).json({target: id , message: 'Berhasil Menghapus!'})
    } catch (error) {
       res.status(500).json({message: `Kesalahan Server dalam Delte: ${error.message}`}) 
    }
}