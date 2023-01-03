// Header component
//
// @zgr2788
import React, { useContext } from "react";
import { useState } from "react";
import axios from 'axios';

import { AdminContext } from "../context/AdminContext";
import { TeamContext } from "../context/TeamContext";


import { AppBar } from '@mui/material';
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";



const Header = () => {
    const [adminToken, setAdminToken, adminLogin, setAdminLogin] = useContext(AdminContext);

    const [selectedFile, setSelectedFile] = useState(null);
    const [errorMessage, setErrorMessage] = useState("");
    const [teamToken, setTeamToken, teamLogin, setTeamLogin, teamName, setTeamName] = useContext(TeamContext);


    const onFileChange = event => {
     
        // Update the state
        setSelectedFile(event.target.files[0]);
      }

    const onFileUpload = async () => {
     
        // Create an object of formData
        const formData = new FormData();
       
        // Update the formData object
        formData.append(
          "file",
          selectedFile,
          selectedFile.name
        );
       
        const requestOptions = {
            method: "POST",
            headers: {
                Authorization: "Bearer " + adminToken,
            },

            body: formData
        };
        // Details of the uploaded file
        console.log(selectedFile);
       
        // Request made to the backend api
        // Send formData object
        const response = await fetch("/api/admins/profilepics/" + "a@a", requestOptions);
        const data = await response.json();

        if (!response.ok) {
            setErrorMessage(data.detail);
        } else {
            document.getElementById("fileUpload").value = "";
        }
      }

    const fileData = () => {
     
        if (selectedFile) {
            
          return (
            <div>
              <h2>File Details:</h2>
              <p>File Name: {selectedFile.name}</p>
    
              <p>File Type: {selectedFile.type}</p>
    
    
            </div>
          );
        } else {
          return (
            <div>
              <br />
              <h4>Choose before Pressing the Upload button</h4>
            </div>
          );
        }
      }
      
    const handleLogout = () => {
        setAdminToken(null);
        setTeamToken(null);
        setAdminLogin(false);
        setTeamLogin(false);
        setTeamName(null);
    }

    if (adminLogin || teamLogin)
        return (
            <AppBar position="fixed">
        <Toolbar>  
          <Typography variant="h6" 
            component="div" sx={{ flexGrow: 1 }}>
            GeeksforGeeks Header

            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload}>
                  Upload!
                </button>
                {fileData()}
            <img src="https://www.w3schools.com/images/lamp.jpg"/>
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