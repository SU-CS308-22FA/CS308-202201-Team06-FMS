// React context for teams
//
// @zgr2788

import React, { createContext, useEffect, useState } from "react";

export const TeamContext = createContext();

export const TeamProvider = (props) => {
    const [token, setToken] = useState(sessionStorage.getItem("TeamToken"))
    const [login, setLogin] = useState(sessionStorage.getItem("TeamLogin"))


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
            }

            sessionStorage.setItem("TeamToken", token);
            sessionStorage.setItem("TeamLogin", login);
        };

        fetchTeam();

    }, [token, login]);

    return (
        <TeamContext.Provider value={[token, setToken, login, setLogin]}>
            {props.children}
        </TeamContext.Provider>
    )
};

