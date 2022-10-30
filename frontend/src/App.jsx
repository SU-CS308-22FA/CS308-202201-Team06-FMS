// Main page for the app
// 
// @zgr2788


import React, { useContext, useState } from "react";
import RegisterAdmin from "./components/RegisterAdmin";
import RegisterTeamAdmin from "./components/RegisterTeamAdmin";
import DeleteTeamAdmin from "./components/DeleteTeamAdmin";
import Header from "./components/Header";
import AdminLogin from "./components/LoginAdmin";
import { AdminContext } from "./context/AdminContext";
import { TeamContext } from "./context/TeamContext";
import TeamLogin from "./components/LoginTeam";


const App = () => {
  
  // Print welcome message
  const [message,] = useState("");
  const [adminToken,] = useContext(AdminContext);
  const [teamToken,] = useContext(TeamContext);

  return (
    <>
      <Header title = {message} />
      
      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
          {
            !(adminToken || teamToken) ? (
              <div className="columns">
              <AdminLogin />
              <TeamLogin />
              </div>
            ) : ( teamToken ? (
              <div className="column">
                Under development...
              </div>
            ) : (
              <div className="columns">
              <RegisterAdmin />
              <RegisterTeamAdmin />
              <DeleteTeamAdmin />
              </div>
            )
            )
             
          }
        </div>
        <div className="column"></div>
      </div>
    
    </>
  
  );
}

export default App;
