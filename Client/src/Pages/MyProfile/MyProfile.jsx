import React, { useEffect } from 'react';
import './MyProfile.css';
import { assets } from '../../Assets/Assets';
import { MesContext } from '../../Context/MesContextProvider';
import { FaCheckDouble } from "react-icons/fa6";


const MyProfile = () => {
    const { userDetails } = React.useContext(MesContext);
    console.log("User Details:", userDetails);

    useEffect(() => {
        console.log(userDetails)
    }, [userDetails]);

    return (
        <>
            <div className="my-profile">
                <div className="profile-header">
                    <h2>My Profile</h2>
                </div>
                <div className="profile-content">
                    <img src={assets.user_icon} alt="" />
                    <p>
                        {userDetails.name}
                        {userDetails.isVerified && userDetails.access
                            ? <FaCheckDouble style={{ color: "green" }} />
                            : "Not Verified"}
                    </p>

                </div>
                <div className="others-data">
                   <p>User Id: {userDetails._id}</p>
                   <p>Email: {userDetails.email}</p>
                </div>
            </div>
        </>
    )
}

export default MyProfile;