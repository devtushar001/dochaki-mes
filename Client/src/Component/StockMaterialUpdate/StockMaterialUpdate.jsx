import React, { useContext, useEffect, useState, useCallback } from "react";
import "./StockMaterialUpdate.css";
import { Link } from "react-router-dom";
import { MesContext } from "../../Context/MesContextProvider";
import { toast } from "react-toastify";

const StockMaterialUpdate = () => {
  const { readDate, backend_url, token } = useContext(MesContext);
  const [fetchedData, setFetchedData] = useState([]);
  const [inputDate, setInputDate] = useState(getCurrentDate());

  function getCurrentDate() {
    return new Date().toISOString().split("T")[0]; // YYYY-MM-DD format
  }

  // Fetch data function
  const fetchRecentUpdate = useCallback(async () => {
    if (!inputDate) return;

    try {
      const res = await fetch(
        `${backend_url}/api/stock-material-update/get-update/${inputDate}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!res.ok) throw new Error("Failed to fetch recent updates");

      const result = await res.json();
      setFetchedData(result.data || []);
    } catch (error) {
      toast.error(`${error.name}: ${error.message}`);
    }
  }, [inputDate, backend_url, token]);

  // Fetch data when the component mounts / inputDate changes
  useEffect(() => {
    fetchRecentUpdate();
  }, [fetchRecentUpdate]);

  return (
    <div className="recent-update">
      <div className="filter-method">
        <h2>Recent updated stocks</h2>
        <div className="date-selection">
          <p>Select Date</p>
          <input
            type="date"
            name="date"
            id="date"
            value={inputDate}
            onChange={(e) => setInputDate(e.target.value)}
          />
          <button onClick={fetchRecentUpdate}>Search Data</button>
        </div>
      </div>

      {fetchedData.length === 0 ? (
        <p>No recent updates available.</p>
      ) : (
        <div className="table">
          {fetchedData.map((update) => (
            <React.Fragment key={update._id}>
              <div className="table-body">
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <img
                    style={{ maxWidth: "45px" }}
                    src={update?.ProductData?.image || "/fallback.png"}
                    alt={update?.ProductData?.name || "Unknown Product"}
                  />
                  {update?.ProductData?.name || "Unknown Product"}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  Current Qty : {update.currentQuantity}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-evenly" }}>
                  Change Type : {update.quantity} {update.changeType}
                </div>
                <div>Remark : {update.message}</div>
                <div>Updated Time : {readDate(update.updatedAt)}</div>
              </div>
              <hr />
            </React.Fragment>
          ))}
        </div>
      )}
    </div>
  );
};

export default StockMaterialUpdate;
