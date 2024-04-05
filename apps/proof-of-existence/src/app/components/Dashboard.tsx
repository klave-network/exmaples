import { useEffect, useState } from "react";
import { ServiceInfo, getIndexInfo, createProofOfExistence, ProofOfExistenceOutput, stampToDate } from "../utils/apiFunctions";
import NavIcons from "./NavIcons";
import {useDropzone} from "react-dropzone";
import { getFileHash } from "../utils/misc";
import { set } from "date-fns";
import { Underline } from "lucide-react";

export const Dashboard = () => {

    const [serviceInfo, setServiceInfo] = useState<ServiceInfo>();
    const [hashCode, setHashCode] = useState<string>();
    const [resultSum, setResultSum] = useState<ProofOfExistenceOutput>();

    const {acceptedFiles, getRootProps, getInputProps, isDragActive} = useDropzone({
        onDrop: acceptedFiles => {
            acceptedFiles.forEach(file => {

                const reader = new FileReader();
                // Event listener for when the file has been read
                reader.onload = async (event) => {
                  // The result attribute contains the contents of the file as a text string
                  if (!event.target) return;
                  if (!event.target.result) return;
                  setHashCode(await getFileHash(event.target.result.toString()));
                };
                // Read the file as text
                reader.readAsText(file);
              });
        }
    });

    useEffect(() => {
        const timer = setInterval(() => {
            getIndexInfo()
                .then(data => {
                    setServiceInfo(data)
                })
                .catch(console.error);
        }, 10000)

        return () => {
            clearInterval(timer);
        };
    }, []);

    useEffect(() => {
        if (hashCode) {
            createProofOfExistence(hashCode).then(
                data => {setResultSum(data)})
        }
    }, [hashCode]);

    if (!serviceInfo || serviceInfo.success === false) return;

    return <div className="flex print:block flex-col print:h-[initial] h-full">
        <div className="bg-slate-300 px-5 py-3 flex flex-row">
            <h1 className="flex-grow text-xl font-bold">Proof of Existence</h1>
            <NavIcons />
        </div>
        <div className="bg-slate-200 px-5 py-4 print:hidden">
            <h2 className="font-bold">Number of documents certified: <span className="font-bold" style={{ color: "#222445" }}>{serviceInfo.index}</span></h2>
        </div>
        <div className="flex-grow flex flex-col p-4 min-h-0 min-w-0">
            <h2 className="font-bold mb-2">My document</h2>
            <div {...getRootProps({ className: 'w-full min-h-20 mb-5' })}>
                <input {...getInputProps()} />
                {hashCode
                    ? <div className={`flex flex-wrap gap-3 items-stretch justify-start min-h-40 border-2 border-dashed align-middle p-3 bg-slate-50 ${isDragActive ? 'border-slate-400' : 'border-slate-200'}`}>
                        {hashCode}
                    </div>
                    : <div className={`flex items-center justify-center h-40 border-2 border-dashed align-middle bg-slate-50 ${isDragActive ? 'border-slate-400' : 'border-slate-200'}`}>
                        <span className="block text-sm text-slate-400">Drag 'n' drop some files here, or click to select files</span>
                    </div>
                }
            </div>
            <h2 className="font-bold mb-2">Result</h2>
            <div className="h-1/3">
                {resultSum ?
                    resultSum.success
                    ? <div>
                        <span className="text-sm">Your document has been certified on the following date: <span className="text-sm" style={{ color: 'blue' }}>{stampToDate(resultSum.timestamp)}</span> and index: <span className="text-sm" style={{ color: 'blue' }}>{resultSum.index}</span></span><br />
                    </div>
                    : <div>
                        <span className="text-sm">Your document has already been certified on the following date: <span className="text-sm" style={{ color: 'blue' }}>{stampToDate(resultSum.timestamp)}</span> and index: <span className="text-sm" style={{ color: 'blue' }}>{resultSum.index}</span></span><br />
                    </div>
                    : null
                }
            </div>
        </div>
    </div>
}

export default Dashboard;