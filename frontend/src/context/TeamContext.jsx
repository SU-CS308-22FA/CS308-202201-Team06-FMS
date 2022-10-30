// React context for teams
//
// @zgr2788

import React, { createContext, useEffect, useState } from "react";

export const TeamContext = createContext();

export const TeamProvider = (props) => {
    const [token, setToken] = useState(localStorage.getItem("TeamToken"))

    useEffect(() => {
        const fetchTeam = async () => {
            
            // Get options
            const requestOptions = {
                method: "GET",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            
            // Get response
            const response = await fetch("/api/teams/me", requestOptions);

            if (!response.ok){
                setToken(null);
            }
            
            localStorage.setItem("TeamToken", token);
        };

        fetchTeam();

    }, [token]);

    return (
        <TeamContext.Provider value = {[token, setToken]}>
            {props.children}
        </TeamContext.Provider>
    )
};

