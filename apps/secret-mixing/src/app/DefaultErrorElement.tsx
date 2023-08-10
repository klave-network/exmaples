import { useRouteError } from "react-router";

export const DefaultErrorBoundary = () => {
    const error: any = useRouteError();

    return <div className="flex flex-col bg-slate-50 min-h-full max-h-full h-full">
        <div className="bg-slate-300 px-5 py-3">
            <h1 className="text-xl font-bold">Secret Mixing :: NumAvg</h1>
        </div>
        <div className="bg-slate-200 px-5 py-4">
            <h2 className="font-bold">Oops - {error.status} {error.statusText ?? 'Sorry for that'}</h2>
        </div>
        <div className="flex-grow flex flex-col p-4 min-h-0 min-w-0">
            Sorry you landed on this page. An error must have occurred.<br />
            Please check the address you are trying to reach and retry at a later time.
        </div>
    </div>
}

export default DefaultErrorBoundary;