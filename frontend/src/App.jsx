// Main driver js for React frontend
// 
// @zgr2788


import React, { useEffect, useState } from "react";
import Register from "./components/RegisterAdmin";


const App = () => {
  
  // Print welcome message
  const [message, setMessage] = useState("");

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


  useEffect(() => {
    getWelcomeMessage()
  }, []);


  return (
    <div>
      <h1>{message}</h1>
      <Register />
    </div>
  
  );
}

export default App;
