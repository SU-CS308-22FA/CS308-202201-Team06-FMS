import React, { useContext } from "react";

import { AdminContext } from "../context/AdminContext";
import { TeamContext } from "../context/TeamContext";

const Header = ({title}) => {
    const [token, setToken] = useContext(AdminContext);

    const handleLogout = () => {
        setToken(null);
    }

    return (
        <div className="has-text-centered m-6">
            <h1 className="title">{title}</h1>
            {token && (
                <button className="button" onClick = {handleLogout}>
                    Logout
                </button>
            )}
        </div>

    );
};

export default Header;