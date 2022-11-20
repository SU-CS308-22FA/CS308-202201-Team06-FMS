// Main page for the app
// 
// @zgr2788


import React, { useContext, useState, useEffect } from "react";
import RegisterAdmin from "./components/RegisterAdmin";
import RegisterTeamAdmin from "./components/RegisterTeamAdmin";
import DeleteTeamAdmin from "./components/DeleteTeamAdmin";
import UpdateTeamAdmin from "./components/UpdateTeamAdmin";
import Header from "./components/Header";
import AdminLogin from "./components/LoginAdmin";
import { AdminContext } from "./context/AdminContext";
import { TeamContext } from "./context/TeamContext";
import TeamLogin from "./components/LoginTeam";
import AdminTeamTable from "./components/AdminTeamTable";
import FAQ from "./components/FrequentlyAskedQs";
import TeamBudgetTable from "./components/TeamBudgetTable";
import TeamBalance from "./components/TeamBalance";
import AdminItemTable from "./components/AdminItemTable";

const App = () => {

  // Print welcome message
  const [adminToken, setAdminToken, adminLogin, setAdminLogin] = useContext(AdminContext);
  const [teamToken, setTeamToken, teamLogin, setTeamLogin, teamName, setTeamName] = useContext(TeamContext);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 1000)
  }, [setAdminToken, setTeamToken, setAdminLogin, setTeamLogin])



  return (
    <>


      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
          {loading ? (
            <div className="column">
              Retrieving API Data - TODO: Place Spinner Here

            </div>) :
            (() => {


              if (!adminToken && !teamToken) {
                return <div className="columns">
                  <AdminLogin />
                  <TeamLogin />
                  <FAQ />
                  </div>
              }

              else if (adminToken) {
                return <div className="column">
                  <Header />
                  <div className= "rows">
                    <div className="columns">
                    <AdminTeamTable loggedInAdmin={adminLogin}/>
                    <AdminItemTable loggedInAdmin={adminLogin}/>
                    </div>
                    <div className="columns">
                    <RegisterAdmin loggedInAdmin={adminLogin}/>
                    <RegisterTeamAdmin loggedInAdmin={adminLogin}/>
                    <DeleteTeamAdmin loggedInAdmin={adminLogin}/>
                    <UpdateTeamAdmin loggedInAdmin={adminLogin}/>
                    </div>   
                  </div>
                  </div>
              }

              else if (teamToken) {
                return <div className="column">
                  <Header />
                  <TeamBalance loggedInTeam={teamLogin} />
                  <TeamBudgetTable loggedInTeam={teamLogin} />
                  
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
