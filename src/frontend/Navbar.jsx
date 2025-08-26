import { faBars } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";

export default function Navbar({title, logo, pages = []}){
    const [trigger, setTrigger] = useState(false)

    return(
        <nav className="bg-neutral text-white items-center flex justify-evenly p-4">
            <div className="flex items-center gap-3">
                <FontAwesomeIcon icon={logo}/>
                <p className="font-bold text-xl">{title}</p>
            </div>
            <ul className={`flex items-center gap-5 ${trigger ? `flex flex-col absolute top-15 p-4 w-full bg-neutral` : 'max-sm:hidden'}`}>
                {pages.map((i, idx) => (
                    <li key={idx}>{i}</li>
                ))}
            </ul>
            <div className="hamburger hidden max-sm:flex">
                <FontAwesomeIcon icon={faBars} onClick={()=> setTrigger(!trigger)}/>
            </div>
        </nav>
    )
}