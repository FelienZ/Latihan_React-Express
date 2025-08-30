import { useContext, useState } from "react"
import { ItemsContext, ItemsReducerContext } from "./ItemContext"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faEdit, faFilter, faSave, faTrash } from "@fortawesome/free-solid-svg-icons"

export default function ItemList(){
    const list = useContext(ItemsContext)
    const dispatch = useContext(ItemsReducerContext)
    const [edit, setEdit] = useState(null);
    const newData = {
        name: '',
        price: '',
        stock: '',
        description: '',
        category: ''
    }
    const [data, setData] = useState(newData);
    function handleNameChange(e){
        setData({
            ...data, name: e.target.value
        })
    }
    function handleDescChange(e){
        setData({
            ...data, description: e.target.value
        })
    }
    function handleStockChange(e){
        setData({
            ...data, stock: Number(e.target.value)
        })
    }
    function handlePriceChange(e){
        setData({
            ...data, price: Number(e.target.value)
        })
    }
    function handleCategoryChange(e){
        setData({
            ...data, category: e.target.value
        })
    }
    async function SendDelete(id){
        const response = await fetch(`http://localhost:3000/api/inventory/${id}`, {
            method: 'DELETE'
        })
        if(response.ok){
            dispatch({
                type: "DELETE_ITEMS",
                target: id
            })    
        }
    }
    async function SendEdit(){
        // console.log(data)
        if(data.name.trim() === ''|| data.category.trim() === ''|| typeof (data.price) !== 'number' || typeof(data.stock) !== 'number'){
            dispatch({
                type: 'EDIT_INVALID'
            })
            setEdit(null)
            return;
        }
        const respone = await fetch(`http://localhost:3000/api/inventory/${edit}`, {
            method: 'PUT',
            headers: {'Content-Type' : 'application/json'},
            body: JSON.stringify(data)
        })
        const dataEdit = await respone.json();
        dispatch({
            type: 'EDIT_ITEMS',
            payload: dataEdit.item,
            target: edit
        })
        setData({name: '', price: '', stock: '', category: '', description: ''})
        setEdit(null)
    }
    function handleOnSetTarget(text){
        dispatch({
            type: 'SET_TARGET',
            target: text,
        })
    }
    function handleOnSetKeyword(text){
        dispatch({
            type: 'SET_KEYWORD',
            keyword: text,
        })
    }
    return(
        <section className={`flex flex-col lg:col-span-2 p-4 gap-4 ${list.length ? '' : 'justify-center'} items-center`}>
            <p className="font-bold text-lg">Items Inventory</p>
            <div className={`inputField flex items-center gap-2 ${list.length ? 'self-end' : ''}`}>
                <input type="text" onChange={(e)=> handleOnSetKeyword(e.target.value)} className="input bg-white border border-neutral" placeholder="Cari Nama Barang"/>
                <div className="dropdown dropdown-bottom dropdown-end text-white">
                <div tabIndex={0} role="button" className="btn btn-neutral"><FontAwesomeIcon icon={faFilter}/></div>
                <ul tabIndex={0} className="dropdown-content menu bg-neutral rounded-box z-1 w-52 p-2 mt-2 shadow-sm">
                    <li onClick={()=>handleOnSetTarget('electronics')}><a>Elektronik</a></li>
                    <li onClick={()=>handleOnSetTarget('fashion')}><a>Fashion</a></li>
                    <li onClick={()=>handleOnSetTarget('furniture')}><a>Perabotan</a></li>
                    <li onClick={()=>handleOnSetTarget('All')}><a>Tampilkan Semua</a></li>
                </ul>
                </div>
            </div>
            {list.length ? (
                <div className="flex flex-col gap-3 lg: h-screen w-full overflow-y-auto border border-neutral p-3">
                {list.map(i => (
                  <div key={i.id} className="flex flex-col w-full border border-gray-400 rounded-sm p-3 gap-2">
                    {edit === i.id ? (<input onChange={handleNameChange} defaultValue={i.name} className="input w-full bg-white border border-gray-400" placeholder="Nama Barang"></input>) : (<span className="font-bold flex items-center gap-2">Nama:<p className="font-normal"> {i.name}</p></span>)}
                    {edit === i.id ? (
                    <select name="category" onChange={handleCategoryChange} defaultValue={i.category} className="select w-full border border-gray-400 bg-white text-neutral">
                        <option value="" disabled hidden>
                            Kategori...
                        </option>
                        <option value="electronics">Elektronik</option>
                        <option value="fashion">Fashion</option>
                        <option value="furniture">Perabotan</option>
                    </select>
                    ): (<span className="font-bold flex items-center gap-2">Kategori:<p className="font-normal"> {i.category}</p></span>)}
                    <div className="font-bold flex gap-5 items-center self-end">
                        {edit === i.id ?(<input onChange={handlePriceChange} defaultValue={i.price} className="input bg-white border border-gray-400" placeholder="Harga"></input>) : (<span className="flex items-center gap-2">Harga: <p className="font-normal">{i.price.toLocaleString('id-ID', {style: 'currency', currency: 'IDR'})}</p></span>)}
                        {edit === i.id ? (<input onChange={handleStockChange} defaultValue={i.stock} className="input bg-white border border-gray-400" placeholder="Stok"></input>) : (<span className="flex items-center gap-2">Stok: <p className="font-normal">{i.stock}</p></span>)}
                    </div>
                    {edit === i.id ? (
                        <textarea onChange={handleDescChange} defaultValue={i.description} className="textarea bg-white border resize-none border-gray-400 w-full" placeholder="Deskripsi Barang"></textarea>
                    ) : (<textarea className="textarea disabled:bg-white resize-none disabled:text-gray-600 border border-gray-400 w-full" disabled value={i.description}></textarea>)}
                    <div className="buttons grid grid-cols-2 gap-2 w-full items-center">
                        {edit === i.id ? (<button className="btn btn-primary" onClick={SendEdit}><FontAwesomeIcon icon={faSave}/> Simpan</button>) : (<button className="btn btn-warning" onClick={()=>setEdit(i.id)}><FontAwesomeIcon icon={faEdit}/> Edit</button>)}
                        <button className="btn btn-secondary" onClick={()=>SendDelete(i.id)}><FontAwesomeIcon icon={faTrash}/>Hapus</button>
                    </div>
                  </div>  
                ))}
                </div>
            ) 
            : (
                <p>Inventori Kosong!</p>
            )}
        </section>
    )
}