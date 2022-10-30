// Header component
//
// @zgr2788
import React, { useContext } from "react";

import { AdminContext } from "../context/AdminContext";
import { TeamContext } from "../context/TeamContext";

const Header = ({title}) => {
    const [teamToken, setTeamToken] = useContext(TeamContext);
    const [adminToken, setAdminToken] = useContext(AdminContext);

    const handleLogout = () => {
        setAdminToken(null);
        setTeamToken(null);
    }

    return (
        <div className="has-text-centered m-6">
            <h1 className="title">{title}</h1>
            {(adminToken || teamToken) && (
                <button className="button" onClick = {handleLogout}>
                    Logout
                </button>
            )}
        </div>

    );
};

export default Header;