// Header component
//
// @zgr2788
import React, { useContext } from "react";

import { AdminContext } from "../context/AdminContext";
import { TeamContext } from "../context/TeamContext";


import { AppBar } from '@mui/material';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";



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
            /*<div>
                <div className="has-text-centered m-6">
                    <button className="button" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

            </div>*/
            <AppBar position="fixed">
        <Toolbar>
          {/*Inside the IconButton, we 
           can render various icons*/}

          {/* The Typography component applies 
           default font weights and sizes */}
  
          <Typography variant="h6" 
            component="div" sx={{ flexGrow: 1 }}>
            GeeksforGeeks Header
          </Typography>
          <button className="button" onClick={handleLogout}>
                        Logout
                    </button>
        </Toolbar>
      </AppBar>

        );

    return (null);

};

export default Header;