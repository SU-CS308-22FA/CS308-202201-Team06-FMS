import React from "react";
import { TeamContext } from "../context/TeamContext";
import { useContext } from "react";
import { useState, useEffect } from "react";


const TeamBalance = ({ loggedInTeam }) => {
    const [teamToken, setTeamToken, teamLogin, setTeamLogin, teamName, setTeamName, total, setTotal, rem, setRem, alloc, setAlloc] = useContext(TeamContext);

    if (teamLogin)
        return (
            <div>
                Total : {total}
                Allocated : {alloc}
                Remaining : {rem} 
            

            </div>

        );

    return (null);

}
