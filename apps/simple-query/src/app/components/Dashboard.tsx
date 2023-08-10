import { useEffect, useState } from "react";
import { ServiceInfo, getServiceInfo } from "../utils/apiFunctions";
import NavIcons from "./NavIcons";

export const Dashboard = () => {

    const [serviceInfo, setServiceInfo] = useState<ServiceInfo>();

    useEffect(() => {
        const timer = setInterval(() => {
            getServiceInfo()
                .then(data => {
                    setServiceInfo(data)
                })
                .catch(console.error);
            // getResult()
            //     .then(data => {
            //         setVoteResult(data)
            //     })
            //     .catch(console.error);
        }, 1000)

        return () => {
            clearInterval(timer);
        };
    }, []);

    if (!serviceInfo || serviceInfo.success === false) return;

    return <div className="flex print:block flex-col print:h-[initial] h-full">
        <div className="bg-slate-300 px-5 py-3 flex flex-row">
            <h1 className="flex-grow text-xl font-bold">Service Info</h1>
            <NavIcons />
        </div>
        {/* <div className="bg-slate-200 px-5 py-4 print:hidden">
            <h2 className="font-bold">Statistics</h2>
            <div className="flex flex-col">
                <span className="text-sm">Branch: <span className="font-bold">{serviceInfo.branch}</span></span>
            </div>
        </div> */}
        <div className="flex-grow flex flex-col p-4 min-h-0 min-w-0">
            <div className="text-[30vh]">{serviceInfo.mood}</div>
        </div>
    </div>
}

export default Dashboard;