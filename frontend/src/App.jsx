// Main page for the app
// 
// @zgr2788


import React, { useContext, useState, useEffect, CSSProperties } from "react";
import RegisterAdmin from "./components/RegisterAdmin";
import RegisterTeamAdmin from "./components/RegisterTeamAdmin";
import DeleteTeamAdmin from "./components/DeleteTeamAdmin";
import UpdateTeamAdmin from "./components/UpdateTeamAdmin";
import Header from "./components/Header";
import AdminLogin from "./components/LoginAdmin";
import { AdminContext } from "./context/AdminContext";
import { TeamContext } from "./context/TeamContext";
import TeamLogin from "./components/LoginTeam";
import AdminTable from "./components/AdminTable";
import FAQ from "./components/FrequentlyAskedQs";
import TeamBudgetTable from "./components/TeamBudgetTable";
import TeamBalance from "./components/TeamBalance";
import BounceLoader from "react-spinners/BounceLoader";
import BalanceDashboard from "./components/BalanceDashboard";


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
            <div className="column" style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100vh',
            }}>
              <div className="rows">

                <div className="row">
                  <BounceLoader color="#00d1b2" size="250" />
                </div>
                <div className="row">&nbsp;</div>
                <div className="row">&nbsp;</div>

                <div className="row" style={{ fontSize: "25px" }}>&nbsp;Loading Login Screen</div>

              </div>


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
                    <BalanceDashboard loggedInAdmin={adminLogin}/>
                    <AdminTable loggedInAdmin={adminLogin}/>
                    <div className="columns">
                      <RegisterAdmin loggedInAdmin={adminLogin} />
                      <RegisterTeamAdmin loggedInAdmin={adminLogin} />
                      <DeleteTeamAdmin loggedInAdmin={adminLogin} />
                      <UpdateTeamAdmin loggedInAdmin={adminLogin} />
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
