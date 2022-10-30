// Main page for the app
// 
// @zgr2788


import React, { useContext, useState } from "react";
import RegisterAdmin from "./components/RegisterAdmin";
import RegisterTeam from "./components/RegisterTeam";
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
              <RegisterTeam />
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
