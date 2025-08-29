// Berhubungan langsung ke data : fs, JSON -> Sekarang Pool ke Postgre

const fs = require('fs/promises');
const { nanoid } = require('nanoid');
const path = require('path');

const { Pool } = require('pg');
const pool = new Pool();

const filePath = path.join(__dirname, '../../data/inventory.json');

async function getInventoryItems() {
    const query = {
        text: 'SELECT * FROM items ORDER BY name'
    }
    const result = await pool.query(query);
    return result.rows
}

async function postItems({id, name, category, price, stock, description}) {
        const query = {
            text: 'INSERT INTO items (id, name, category, price, stock, description) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            values: [id, name, category, price, stock, description],
        }
        // console.log(query)
        const result = await pool.query(query);
        return result.rows[0]
}

async function putItems({id, name, category, price, stock, description}) {
    const query = {
        text: 'UPDATE items SET name=$1, category=$2, price=$3, stock=$4, description=$5 WHERE id=$6 RETURNING *',
        values: [name, category, price, stock, description, id]
    }
    const result = await pool.query(query);
    return result.rows[0]
}

async function deleteItem(id) {
    const query = {
        text: 'DELETE FROM items where id=$1',
        values: [id]
    }
    const result = await pool.query(query)
    return result.rows
}

module.exports = { getInventoryItems, postItems, putItems, deleteItem}