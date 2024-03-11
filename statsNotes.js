import axios from "axios";
import { getAllNote } from "./notes.js";

import dotenv from "dotenv";
dotenv.config();

const API_Stats = process.env.API_STATS;
const TOKEN_JUNIANALYTICS = process.env.TOKEN_JUNIANALYTICS;

// console.log(API_Stats);
// console.log(TOKEN_JUNIANALYTICS);


async function PostStatsNotes(username, password, shared = false) {
    let response = await getAllNote(username, password);

    // console.log(username);

    // if (shared) {
    //     try {
    //         axios(API_Stats + "/update-grades", {
    //             method: "POST",
    //             headers: {
    //                 "Content-Type": "application/json",
    //                 "Authorization": "Bearer " + TOKEN_JUNIANALYTICS,
    //             },
    //             data: JSON.stringify({
    //                 "email": username,
    //                 "grades": response,
    //             }),
    //         })

    //     }
    //     catch (e) {
    //         console.log(e, "PROBLEME CHEZ JUNIANALYTICS");
    //     }
    // }

    return response;
}





async function GetStatsNotes(username, password) {
    // let USERNAME = username.substring(0, username.indexOf("@"));

    // const response = await axios(API_Stats + "/grades-stats?user=" + USERNAME, {
    //     headers: {
    //         "Authorization": "Bearer " + TOKEN_JUNIANALYTICS,
    //     },
    // });
    // if (response.data) {
    //     let noteStats = response.data;
    //     return noteStats;
    // }

    // if (response.data.error) {
    //     await PostStatsNotes(username, password, true);
    //     return GetStatsNotes(username, password);
    // }

    return(await PostStatsNotes(username, password, true));

}

export { PostStatsNotes, GetStatsNotes };
