// React context for admins
//
// @zgr2788

import React, { createContext, useEffect, useState } from "react";

export const AdminContext = createContext();

export const AdminProvider = (props) => {
    const [token, setToken] = useState(sessionStorage.getItem("AdminToken"))
    const [login, setLogin] = useState(sessionStorage.getItem("AdminLogin"))

    useEffect(() => {
        const fetchAdmin = async () => {
            // Get options
            const requestOptions = {
                method: "GET",
                headers:{
                    "Content-Type": "application/json",
                    Authorization: "Bearer " + token,
                },
            };
            
            // Get response
            const response = await fetch("/api/admins/me", requestOptions);

            if (!response.ok){
                setToken(null);
                setLogin(false);
            }

            sessionStorage.setItem("AdminToken", token);
            sessionStorage.setItem("AdminLogin", login);
        };

        fetchAdmin();

    }, [token, login]);

    return (
        <AdminContext.Provider value = {[token, setToken, login, setLogin]}>
            {props.children}
        </AdminContext.Provider>
    )
};

