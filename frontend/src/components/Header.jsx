// Header component
//
// @zgr2788
import React, { useContext } from "react";

import { AdminContext } from "../context/AdminContext";
import { TeamContext } from "../context/TeamContext";

const Header = () => {
    const [, setTeamToken, teamLogin, setTeamLogin] = useContext(TeamContext);
    const [, setAdminToken, adminLogin, setAdminLogin] = useContext(AdminContext);

    const handleLogout = () => {
        setAdminToken(null);
        setTeamToken(null);
        setAdminLogin(false);
        setTeamLogin(false);
    }
        if (adminLogin || teamLogin)
        return (
            <div className="columns">

                <div className="has-text-centered m-6">
                    <button className="button" onClick = {handleLogout}>
                        Logout
                    </button>
                </div>

            </div>

        );

        return(null);

};

export default Header;