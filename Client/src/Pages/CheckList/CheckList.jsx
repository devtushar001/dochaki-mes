import React, { useContext, useState, useEffect } from "react";
import { MesContext } from "../../Context/MesContextProvider";
import "./CheckList.css";
import { toast } from "react-toastify";
const CheckList = () => {
    const { backend_url, rawMaterials, setRawMaterials, token, setLoginSignup } = useContext(MesContext);
    const [active, setActive] = useState("stock");
    const [qty, setQty] = useState(5); // Minimum quantity to check



    const fetchProduct = async () => {
        if (!token) setLoginSignup(true);
        try {
            const res = await fetch(`${backend_url}/api/${active}-material/get?minqty=${qty}`, {
                method: 'GET',
                headers: { 'Content-Type': "application/json", Authorization: `Bearer ${token}` }
            });

            if (!res.ok) throw new Error("Failed to fetch raw materials");

            const data = await res.json();
            console.log(data);
            if (!data.success) {
                toast.error(data.message);
                return;
            }

            setRawMaterials(data.data);
            console.log(data.data)
        } catch (error) {
            toast.error(`${error.name}: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [active, qty]);




    return (
        <div className="checklist">
            <div className="buttons">
                <button
                    className={`stock ${active === "stock" ? "active" : ""}`}
                    onClick={() => setActive("stock")}
                    disabled={active === "stock"}
                >
                    Stock List
                </button>
                <button
                    className={`raw ${active === "raw" ? "active" : ""}`}
                    onClick={() => setActive("raw")}
                    disabled={active === "raw"}
                >
                    Raw List
                </button>
            </div>
            <div className="info">
                {active === "stock" ? "Showing low stock items." : "Showing low raw items."}
            </div>
        </div>
    );
};

export default CheckList;
