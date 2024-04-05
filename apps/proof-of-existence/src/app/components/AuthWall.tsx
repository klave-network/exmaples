import { useEffect, useState, FC, PropsWithChildren } from "react";
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { sayHello } from "../utils/apiFunctions";
import { idCollapser } from "../utils/misc";

export const AuthWall: FC<PropsWithChildren> = ({ children }) => {

    const [isLoading, setIsLoading] = useState(true);
    const [isAuthorised, setIsAuthorised] = useState(false);
    const [hasQueried, setHasQueried] = useState(false);

    useEffect(() => {

        if (!hasQueried) {
            setHasQueried(true)
            sayHello()
                .then(data => {
                    setIsLoading(false)
                    setIsAuthorised(data)
                })
                .catch(error => {
                    setIsLoading(false)
                    setIsAuthorised(false)
                    console.error(error)
                });
        }

    }, [hasQueried])

    if (isLoading)
        return <div className="flex flex-col bg-slate-50 min-h-full max-h-full h-full">
            <div className="bg-slate-300 px-5 py-3">
                <h1 className="text-xl font-bold">Connecting</h1>
            </div>
            <div className="bg-slate-200 px-5 py-4">
                <h2 className="font-bold">Your device is being authenticated</h2>
                <div className="flex flex-col">
                    <span className="text-sm">Please wait...</span>
                </div>
            </div>
            <div className="flex-grow flex flex-col p-4 min-h-0 min-w-0">
                <AiOutlineLoading3Quarters className="animate-spin" />
            </div>
        </div>

    if (!isAuthorised) {
        return <div className="flex flex-col bg-slate-50 min-h-full max-h-full h-full">
            <div className="bg-slate-300 px-5 py-3">
                <h1 className="text-xl font-bold">Device login</h1>
            </div>
            <div className="bg-slate-200 px-5 py-4">
                <h2 className="font-bold">Your device is not permitted to connect</h2>
                <div className="flex flex-col">
                    <span className="text-sm">Please contact your administrator to request access.</span>
                </div>
            </div>
            <div className="px-5 pt-4 print:hidden">
                <h2 className="font-bold mb-2">Device identity</h2>
                <div className="gap-3 flex-nowrap overflow-y-auto pb-4 text-xl">
                    {idCollapser((window as any).currentDevicePublicKeyHash)}<br />
                    <span className='font-mono text-xs text-slate-400'>{(window as any).currentDevicePublicKeyHash}</span>
                </div>
            </div>
        </div>
    }

    return <>{children}</>
}

export default AuthWall;