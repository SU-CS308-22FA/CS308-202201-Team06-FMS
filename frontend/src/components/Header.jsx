// Header component
//
// @zgr2788
import React, { useContext } from "react";

import { AdminContext } from "../context/AdminContext";
import { TeamContext } from "../context/TeamContext";

const Header = ({loggedInTeam}, {loggedInAdmin}) => {
    const [teamToken, setTeamToken] = useContext(TeamContext);
    const [adminToken, setAdminToken] = useContext(AdminContext);

    const handleLogout = () => {
        setAdminToken(null);
        setTeamToken(null);
    }

    if (loggedInTeam || loggedInAdmin){
        return (
            <div className="has-text-centered m-6">
                {(adminToken || teamToken) && (
                    <button className="button" onClick = {handleLogout}>
                        Logout
                    </button>
                )}
            </div>
        );
    }

    return (null);

};

export default Header;