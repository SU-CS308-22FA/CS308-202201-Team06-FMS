// Header component
//
// @zgr2788
import React, { useContext } from "react";
import { useState, useEffect } from "react";
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
    const [img, setImg] = useState();
    const [teamToken, setTeamToken, teamLogin, setTeamLogin, teamName, setTeamName] = useContext(TeamContext);

    const getPicture = async () =>{
        const requestOptions2 = {
            method: "GET",
            headers: {
                Authorization: "Bearer " + adminToken,
            },
        };
        const response2 = await fetch("/api/admins/getpic/" + "a@a", requestOptions2);
        if (!response2.ok) {
            console.log(response2.detail);
            setErrorMessage(response2.status);
        }
        else {
            const data2 = await response2.blob();
            console.log(data2);
            const imageObjectURL = URL.createObjectURL(data2);
            setImg(imageObjectURL);

        }
    }


    useEffect(() => {
        setTimeout(() => {
            getPicture();
            fileData();
        }, 200)
    }, []);



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

      const handleRemove = async () =>{
        const requestOptions = {
            method: "DELETE",
            headers: {
                Authorization: "Bearer " + adminToken,
            },
        };

        const response = await fetch("/api/admins/deletepic/" + "a@a", requestOptions);
        const data = await response.json();
      }

    const fileData = () => {
     
        if (img) {
            
          return (
            <div>
            <img src={img}/>
            <button onClick={handleRemove}> Remove</button>
            </div>
          );
        } else {
          return (
            <div>
            <input type="file" onChange={onFileChange} />
            <button onClick={onFileUpload}>
                  Upload!
                </button>
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

                {fileData()}

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