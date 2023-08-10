import { useEffect, useState } from "react";
import { getParticipants, getResult, vote, getOwnContribution, Participant, ContributionResult } from "../utils/apiFunctions";
import { ParticipantTable } from './ParticipantTable'
import NavIcons from "./NavIcons";
import DebouncedInput from "./DebouncedInput";

export const Dashboard = () => {

    const [myContribution, setMyContribution] = useState<string>('');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [voteResult, setVoteResult] = useState<ContributionResult>({
        success: false,
        message: 'Les résultat n\'ont pas encore été récupérés.'
    });

    useEffect(() => {
        const timer = setInterval(() => {
            getParticipants()
                .then(data => {
                    setParticipants(data)
                })
                .catch(console.error);
            getResult()
                .then(data => {
                    setVoteResult(data)
                })
                .catch(console.error);
        }, 1000)

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        getOwnContribution()
            .then(data => {
                if (data.success)
                    if (data.contribution === -999)
                        setMyContribution('')
                    else
                        setMyContribution(`${data.contribution}`)
            })
    })

    const handleContribution = (value: string | number) => {
        const strForm = `${value}`;
        setMyContribution(strForm);
        try {
            if (myContribution === strForm)
                return;
            else if (value === '')
                vote(-999)
            else if (!isNaN(parseFloat(strForm)))
                vote(parseFloat(strForm))
        } catch (e) {
            console.error(e);
        }
    }

    return <div className="flex print:block flex-col print:h-[initial] h-full">
        <div className="bg-slate-300 px-5 py-3 flex flex-row">
            <h1 className="flex-grow text-xl font-bold">Contributions</h1>
            <NavIcons />
        </div>
        <div className="bg-slate-200 px-5 py-4 print:hidden">
            <h2 className="font-bold">Statistics</h2>
            <div className="flex flex-col">
                <span className="text-sm">Number of participants : <span className="font-bold">{participants.length}</span></span>
                <span className="text-sm">Nomber of contributions : <span className="font-bold">{participants.filter(p => p.hasContributed).length}</span></span>
            </div>
        </div>
        <div className="flex-grow flex flex-col p-4 min-h-0 min-w-0">
            <h2 className="font-bold mb-2">My contribution</h2>
            <DebouncedInput value={myContribution} onChange={handleContribution} className="bg-white border border-slate-300 px-2 py-1 mb-3" />
            <h2 className="font-bold mb-2">Result</h2>
            <div className="h-1/3">
                {voteResult.success
                    ? <div>
                        <span className="text-sm">Average of contributions</span><br />
                        <span className="text-4xl font-bold">{voteResult.average ?? 3}</span>
                    </div>
                    : <div>
                        <span className="text-sm">{voteResult.message}</span><br />
                        <span className="text-4xl font-bold">-</span>
                    </div>
                }
            </div>
            <h2 className="font-bold mb-2">List of Participants</h2>
            <ParticipantTable participants={participants} />
        </div>
    </div>
}

export default Dashboard;