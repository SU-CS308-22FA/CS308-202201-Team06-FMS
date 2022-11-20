// React context for teams
//
// @zgr2788

import React, { createContext, useEffect, useState } from "react";

export const TeamContext = createContext();

export const TeamProvider = (props) => {
    const [token, setToken] = useState(sessionStorage.getItem("TeamToken"))
    const [login, setLogin] = useState(sessionStorage.getItem("TeamLogin"))
    const [userName, setUserName] = useState(sessionStorage.getItem("TeamUserName"))
    const [rem, setRem] = useState(sessionStorage.getItem("TeamRem"))
    const [alloc, setAlloc] = useState(sessionStorage.getItem("TeamAlloc"))


    useEffect(() => {
        const fetchTeam = async () => {

            // Get options
            const requestOptions = {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };

            // Get response
            const response = await fetch("/api/teams/me", requestOptions);

            if (!response.ok) {
                setToken(null);
                setLogin(false);
                setUserName("");
                setAlloc(null);
                setRem(null);
            }
            else {
                const data = await response.json();
                setUserName(data.name);
                setAlloc(data.budget_alloc);
                setRem(data.budget_rem);
            }


            sessionStorage.setItem("TeamToken", token);
            sessionStorage.setItem("TeamLogin", login);
            sessionStorage.setItem("TeamUserName", userName);
            sessionStorage.setItem("TeamRem", rem);
            sessionStorage.setItem("TeamAlloc", alloc);
        };

        fetchTeam();

    }, [token, login, userName, rem, alloc]);

    return (
        <TeamContext.Provider value={[token, setToken, login, setLogin, userName, setUserName, rem, setRem, alloc, setAlloc]}>
            {props.children}
        </TeamContext.Provider>
    )
};

