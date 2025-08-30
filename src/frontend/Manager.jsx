import { faBoxArchive } from "@fortawesome/free-solid-svg-icons";
import Navbar from "./Navbar";
import ItemForm from "./ItemForm";
import ItemList from "./ItemList";
import { useEffect, useReducer, useState } from "react";
import { ItemsContext, ItemsReducerContext } from "./ItemContext";

function ItemReducer(list, action){
    switch(action.type){
        case "FETCH_DATA": 
            return {...list, inventory: action.payload}
        case "ADD_ITEMS":
            {const checkData = list.inventory.some(i => i.name.trim().toLowerCase() === action.payload.name.trim().toLowerCase())
                if(checkData){
                    return {...list, status: 'duplicated'}
                }
                if(action.payload.name.trim() === '' || action.payload.category.trim() === '' || action.payload.price <= 0 || action.payload.stock <= 0){
                    return {...list, status: 'fail'}
                }
                    return {...list, inventory: [...list.inventory, {...action.payload}], status: 'success'}
            };
        case "EDIT_ITEMS":
            {const checkData = list.inventory.find(i => i.name.trim().toLowerCase() === action.payload.name.trim().toLowerCase() && i.id !== action.target)
                if(checkData){
                    return {...list, status: 'duplicated'}
                }
                return {...list, inventory: list.inventory.map(i=> {
                if(i.id === action.target){
                    return {...action.payload, id: action.target}
                }
                return i;
            }), status: 'edited'}}
        case "ADD_INVALID":
            return {...list, status: 'fail'};
        case "EDIT_INVALID":
            return {...list, status: 'unedited'};
        case "RESET_STATUS":
            return {...list, status: ''};
        case "DELETE_ITEMS":
            return {...list, inventory: list.inventory.filter(i => i.id !== action.target), status: 'deleted'};
        case "SET_KEYWORD":
            return {...list, keyword: action.keyword};
        case "SET_TARGET":
            return {...list, type: action.target};
    }
}

export default function Manager(){
    const [item, dispatch] = useReducer(ItemReducer, {
        inventory: [],
        status: '',
        keyword: '',
        type: 'All'
    })
    // console.log('data array: ', item)
    const [message, setMessage] = useState(null)
    function setAlert(text){
        setMessage(text);
        setTimeout(() => {
            setMessage(null)
        }, 1200);
    }
    useEffect(()=> {
        if(item.status.trim() === 'success'){
            setAlert({info: 'Berhasil Menambahkan!', type: 'success'})
        }
        else if(item.status.trim() === 'fail'){
            setAlert({info: 'Gagal Menambahkan!', type: 'fail'})
        }
        else if(item.status.trim() === 'duplicated'){
            setAlert({info: 'Gagal Menambahkan!', type: 'fail'})
        }
        else if(item.status.trim() === 'deleted'){
            setAlert({info: 'Berhasil Menghapus!', type: 'success'})
        }
        else if(item.status.trim() === 'edited'){
            setAlert({info: 'Berhasil Memperbarui!', type: 'success'})
        }
        else if(item.status.trim() === 'unedited'){
            setAlert({info: 'Gagal Memperbarui!', type: 'fail'})
        }
        if(item.status){
            dispatch({
                type: 'RESET_STATUS'
            })
        }
    }, [item.status])

    useEffect(()=> {
        async function FetchData() {
            const response = await fetch('http://localhost:3000/api/inventory');
            const data = await response.json()
            dispatch({
            type: 'FETCH_DATA',
            payload: data 
        })
        }
        FetchData()
    }, [])

    const filteredData = item.inventory.filter(i => {
        const matchName = i.name.trim().toLowerCase().includes(item.keyword.trim().toLowerCase())|| item.keyword === '';
        const matchType = i.category.trim().toLowerCase() === item.type.trim().toLowerCase() || item.type === 'All'
        return matchName && matchType;
    })

    // console.log(filteredData)
    return(
        <main className="flex flex-col min-h-screen bg-white text-neutral">
            <Navbar logo={faBoxArchive} title="Inventory Manager" pages={["Home", "About", "Help"]}/>
            {message ? (
                <div className={`place-self-end inset-0 m-3 text-white fixed alert ${message.type.trim() === 'success' ? 'alert-success' : 'alert-error'}`}>
                    <p>{message.info}</p>
                </div>
            ) : ''}
            <div className="content grid lg:grid-cols-3 gap-4 p-4">
                <ItemsContext.Provider value={filteredData}>
                    <ItemsReducerContext.Provider value={dispatch}>
                        <ItemForm/>
                        <ItemList/>
                    </ItemsReducerContext.Provider>
                </ItemsContext.Provider>
            </div>
        </main>
    )
}