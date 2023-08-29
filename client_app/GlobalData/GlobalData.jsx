import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const GlobalContext = createContext()

export default function GlobalData(props) {

    const apiUrlUser = "https://proj.ruppin.ac.il/cgroup36/prod/api/User/";
    const apiUrlMedRequest = "https://proj.ruppin.ac.il/cgroup36/prod/api/MedRequest/";
    const apiUrlMeds = "https://proj.ruppin.ac.il/cgroup36/prod/GetActiveMeds/";
    const apiUrlPullOrder = "https://proj.ruppin.ac.il/cgroup36/prod/api/PullOrder/";
    const apiUrlPushOrder = "https://proj.ruppin.ac.il/cgroup36/prod/api/PushOrder/";
    const apiUrlNotification = "https://proj.ruppin.ac.il/cgroup36/prod/api/Message/";
    const apiUrlPutToken = "https://proj.ruppin.ac.il/cgroup36/prod/PutToken/";
    const apiUrlGetToken = "https://proj.ruppin.ac.il/cgroup36/prod/GetToken/";
    const apiUrlGetNorm = "https://proj.ruppin.ac.il/cgroup36/prod/api/Norm/";
    const apiUrlGetNormReq = "https://proj.ruppin.ac.il/cgroup36/prod/api/NormRequest/";
    const apiUrlGetStock = "https://proj.ruppin.ac.il/cgroup36/prod/api/Stock/"; 

    const [depId, setDepId] = useState('');
    const [meds, setMeds] = useState([]);
    const [myMedReqs, setMyMedReqs] = useState([]);
    const [othersMedReqs, setOthersMedReqs] = useState([]);
    const [medsInNormReq, setMedsInNormReq] = useState([]);//מערך שאותו נשנה לבקשה לשינוי התקן
    const [medsInStockUpdate, setMedsInStockUpdate] = useState([]);//מערך שאותו נשנה לבקשה לשינוי התקן


    const [DepTypes, setDepTypes] = useState([
        { name: 'אורתופדיה', isChecked: true },
        { name: 'כירורגיה', isChecked: true },
        { name: 'פנימית', isChecked: true },
    ]);

    const getUserData = async () => {
        try {
            const result = await AsyncStorage.getItem('User');
            return result != null ? JSON.parse(result) : null;
        } catch (e) {
            // handle errors here
            console.log(e);
            return null;
        }
    }

    return (
        <GlobalContext.Provider
            value={{
                apiUrlUser, apiUrlMedRequest, apiUrlMeds, apiUrlPullOrder, apiUrlPushOrder, apiUrlNotification,
                apiUrlPutToken, apiUrlGetToken, apiUrlGetNorm, apiUrlGetNormReq, apiUrlGetStock,
                depId, setDepId, meds, setMeds, medsInNormReq, medsInStockUpdate,
                DepTypes, setDepTypes, myMedReqs, setMyMedReqs, othersMedReqs, setOthersMedReqs,
                getUserData, setMedsInNormReq, setMedsInStockUpdate
            }}>
            {props.children}
        </GlobalContext.Provider>
    )
}