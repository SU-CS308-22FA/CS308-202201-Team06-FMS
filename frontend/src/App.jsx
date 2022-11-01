// Main page for the app
// 
// @zgr2788


import React, { useContext, useState, useEffect} from "react";
import RegisterAdmin from "./components/RegisterAdmin";
import RegisterTeamAdmin from "./components/RegisterTeamAdmin";
import DeleteTeamAdmin from "./components/DeleteTeamAdmin";
import UpdateTeamAdmin from "./components/UpdateTeamAdmin";
import Header from "./components/Header";
import AdminLogin from "./components/LoginAdmin";
import { AdminContext } from "./context/AdminContext";
import { TeamContext } from "./context/TeamContext";
import TeamLogin from "./components/LoginTeam";
import Table from "./components/TeamBudgetTable";


const App = () => {

  // Print welcome message
  const [message,] = useState("");
  const [adminToken,] = useContext(AdminContext);
  const [teamToken,] = useContext(TeamContext);
  const [loading, setLoading] = useState(false);
  const [loggedInTeam, setLoggedInTeam] = useState(false);
  const [loggedInAdmin, setLoggedInAdmin] = useState(false);


  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
    }, 3000)
}, []);



  return (
    <>
      <Header />

      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
          { loading ? (
          <div className="column"> 
          Loading - TODO: Place Spinner Here
          </div>) : 
            (() => {
            
              if (!adminToken && !teamToken) {  
                return <div className="columns">
                <AdminLogin />
                <TeamLogin />
                </div>
              }
            
              else if (adminToken) {
                  return <div className="columns">
                  <RegisterAdmin loggedInAdmin={loggedInAdmin}/>
                  <RegisterTeamAdmin loggedInAdmin={loggedInAdmin}/>
                  <DeleteTeamAdmin loggedInAdmin={loggedInAdmin}/>
                  <UpdateTeamAdmin loggedInAdmin={loggedInAdmin}/>
                  </div>
              }
            
              else if (teamToken) {
                return <div className="column"> 
                <Table loggedInTeam={loggedInTeam}/> 
                </div>
              }
            })()
          }
        </div>
        <div className="column"></div>
      </div>

    </>

  );
}

export default App;
