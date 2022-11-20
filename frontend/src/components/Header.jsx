// Header component
//
// @zgr2788
import React, { useContext } from "react";

import { AdminContext } from "../context/AdminContext";
import { TeamContext } from "../context/TeamContext";

const Header = () => {
    const [teamToken, setTeamToken, teamLogin, setTeamLogin, teamName, setTeamName] = useContext(TeamContext);
    const [adminToken, setAdminToken, adminLogin, setAdminLogin] = useContext(AdminContext);

    const handleLogout = () => {
        setAdminToken(null);
        setTeamToken(null);
        setAdminLogin(false);
        setTeamLogin(false);
        setTeamName(null);
    }

    if (adminLogin || teamLogin)
        return (
            <div>

                <div className="has-text-centered m-6">
                    <button className="button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

            </div>

        );

    return (null);

};

export default Header;