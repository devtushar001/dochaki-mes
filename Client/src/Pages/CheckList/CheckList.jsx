import React, { useContext, useState, useEffect, useRef } from "react";
import { MesContext } from "../../Context/MesContextProvider";
import "./CheckList.css";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const CheckList = () => {
    const { backend_url, token, setLoginSignup } = useContext(MesContext);
    const [active, setActive] = useState("stock");
    const [qty, setQty] = useState(5);
    const [fetching, setFetching] = useState([]);
    const pdfRef = useRef();

    const fetchProduct = async () => {
        if (!token) setLoginSignup(true);
        try {
            const res = await fetch(
                `${backend_url}/api/${active}-material/get?maxqty=${qty}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!res.ok) throw new Error("Failed to fetch raw materials");

            const data = await res.json();
            if (!data.success) {
                toast.error(data.message);
                return;
            }
            setFetching(data.data);
        } catch (error) {
            toast.error(`${error.name}: ${error.message}`);
        }
    };

    useEffect(() => {
        fetchProduct();
    }, [active, qty]);

    // PDF Download Function
    const downloadPDF = async () => {
        const input = pdfRef.current;

        const canvas = await html2canvas(input, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            scrollY: -window.scrollY, // pura capture karega
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pdfWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        let heightLeft = imgHeight;
        let position = 0;

        // Pehla page
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;

        // Agar aur content bacha ho to naye page add karo
        while (heightLeft > 0) {
            position = heightLeft - imgHeight;
            pdf.addPage();
            pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
            heightLeft -= pdfHeight;
        }

        pdf.save(`${active}-list.pdf`);
    };


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

            <div className="quantity-input">
                <label htmlFor="quantity">Set Minimum Quantity: </label>
                <select
                    id="quantity"
                    value={qty}
                    onChange={(e) => setQty(Number(e.target.value))}
                >
                    {Array.from({ length: 21 }, (_, i) => (
                        <option key={i} value={i}>
                            {i}
                        </option>
                    ))}
                </select>
            </div>

            <div className="info">
                {active === "stock"
                    ? "Showing low stock items."
                    : "Showing low raw items."}
            </div>

            {fetching.length > 0 ? (
                <>
                    <div className="data-show" ref={pdfRef}>
                        {fetching.map((item) => (
                            <div className="data-item" key={item._id}>
                                <div className="name">
                                    Name: {item.materialName}
                                </div>
                                <div className="desc">
                                    Description: {item.description}
                                </div>
                                <div className="color">
                                    Color: {item.color}
                                </div>
                                <div className="quantity">
                                    Quantity: {item.quantity}
                                </div>
                                <div className="id">
                                    Product ID: {item.productId}
                                </div>
                                {item.imageUrl && (
                                    <img
                                        src={item.imageUrl}
                                        alt={item.materialName}
                                        crossOrigin="anonymous"
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="download-button">
                        <button onClick={downloadPDF}>Download as PDF</button>
                    </div>
                </>
            ) : (
                <div className="no-data">
                    No items found with quantity less than or equal to {qty}.
                </div>
            )}
        </div>
    );
};

export default CheckList;
