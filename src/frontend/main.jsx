import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./App.css"
import Manager from "./Manager";
createRoot(document.getElementById('root')).render(
    <StrictMode>
        <Manager/>
    </StrictMode>
)