// Main page for the app
// 
// @zgr2788


import React, { useContext, useState } from "react";
import RegisterAdmin from "./components/RegisterAdmin"; 
import Header from "./components/Header";
import Login from "./components/Login";
import { AdminContext } from "./context/AdminContext";


const App = () => {
  
  // Print welcome message
  const [message, setMessage] = useState("");
  const [token,] = useContext(AdminContext);

  const getWelcomeMessage = async () => {
    const requestOptions = {
      method : "GET",
      headers: {
        "Content-Type" : "application/json",
      },
    };

    const response = await fetch("/api", requestOptions); 
    const data = await response.json();

    if (!response.ok){
      console.log("Error encountered when getting welcome message.");
    } else {
      setMessage(data.message);
    }
  };


  return (
    <>
      <Header title = {message} />
      
      <div className="columns">
        <div className="column"></div>
        <div className="column m-5 is-two-thirds">
          {
            !token ? (
              <div className="columns">
                <Login />
              </div>
            ) : (

              <RegisterAdmin />
            )
          }
        </div>
        <div className="column"></div>
      </div>
    
    </>
  
  );
}

export default App;
