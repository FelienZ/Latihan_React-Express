import { useContext, useState } from "react"
import { ItemsReducerContext } from "./ItemContext"

export default function ItemForm(){
    const dispatch = useContext(ItemsReducerContext);
    const data = {
        name: '',
        category: '',
        stock: '',
        price: '',
        description: ''
    }
    const [item, setItem] = useState(data);

    function handleNameChange(e){
        setItem({
            ...item, name: e.target.value
        })
    }
    function handleDescChange(e){
        setItem({
            ...item, description: e.target.value
        })
    }
    function handleStockChange(e){
        setItem({
            ...item, stock: Number(e.target.value)
        })
    }
    function handlePriceChange(e){
        setItem({
            ...item, price: Number(e.target.value)
        })
    }
    function handleCategoryChange(e){
        setItem({
            ...item, category: e.target.value
        })
    }
    async function handleOnSubmit(e){
        e.preventDefault();
        if(item.name.trim() === '' || item.category.trim() === '' || typeof (item.price) !== 'number' || typeof(item.stock) !== 'number'){
            dispatch({
                type: 'ADD_INVALID'
            })
            return;
        }
        const response = await fetch('http://localhost:3000/api/inventory', {
            method: 'POST',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(item)
        })
        const data = await response.json()
        console.log(data)
        dispatch({
            type: 'ADD_ITEMS',
            payload: data.item
        })
        setItem({name: '', category: '', price: '', stock: '', description: ''})
    }
    return(
        <section className="flex flex-col h-screen gap-3 justify-center items-center">
            <p className="font-bold text-lg">Inventory Input</p>
            <form action="" onSubmit={handleOnSubmit} className="flex flex-col gap-1 p-3 w-[80%] justify-center border border-gray-400 rounded-sm">
                <label htmlFor="name" className="font-bold text-sm">Nama Barang :</label>
                <input type="text" onChange={handleNameChange} value={item.name} placeholder="Masukkan Nama Barang..." name="name" className="input w-full bg-white border border-gray-400"/>
                <label htmlFor="price" className="font-bold text-sm">Harga :</label>
                <input type="text" onChange={handlePriceChange} value={item.price} placeholder="Masukkan Harga Barang..." name="price" className="input w-full bg-white border border-gray-400"/>
                <label htmlFor="stock" className="font-bold text-sm">Stok :</label>
                <input type="text" onChange={handleStockChange} value={item.stock} placeholder="Masukkan Jumlah Stok..." name="stock" className="input w-full bg-white border border-gray-400"/>
                <label htmlFor="category" className="font-bold text-sm">Pilih Kategori :</label>
                <select name="category" onChange={handleCategoryChange} value={item.category} className="select w-full border border-gray-400 bg-white text-neutral">
                    <option value="" disabled hidden>
                        Kategori...
                    </option>
                    <option value="electronics">Elektronik</option>
                    <option value="fashion">Fashion</option>
                    <option value="furniture">Perabotan</option>
                </select>
                <label htmlFor="name" className="font-bold text-sm">Deskripsi Barang :</label>
                <textarea type="text" onChange={handleDescChange} value={item.description} placeholder="Masukkan Deskripsi Barang..." name="name" className="textarea resize-none w-full bg-white border border-gray-400"/>
                <button type="submit" className="btn btn-neutral my-2">Submit</button>
            </form>
        </section>
    )
}