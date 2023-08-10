import { useEffect, useState } from "react";
import { getParticipants, getResult, vote, getOwnContribution, Participant, ContributionResult, getPicoResult } from "../utils/apiFunctions";
import { ParticipantTable } from './ParticipantTable'
import NavIcons from "./NavIcons";
// import DebouncedInput from "./DebouncedInput";
import { useDropzone } from "react-dropzone";

type LoadableFile = {
    loading: false;
    preview: string;
    previewSize: [number, number];
    stampedPreview: string;
    greyScale: Uint8Array;
    detenctions: number[][];
} | {
    loading: true;
    preview: string;
    previewSize: [number, number];
    progress: number;
    status: string;
    greyScale: Uint8Array;
} | {
    loading: true;
    preview: string;
};

type PreviewableFile = File & LoadableFile

const files: Array<PreviewableFile> = []

export const Dashboard = () => {

    const [myContribution, setMyContribution] = useState<string>('');
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [voteResult, setVoteResult] = useState<ContributionResult>({
        success: false,
        message: 'Les résultat n\'ont pas encore été récupérés.'
    });
    // const [files, setFiles] = useState<Array<PreviewableFile>>([]);
    const [filesMove, setFilesMove] = useState(0);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: acceptedFiles => {

            // files = acceptedFiles.map(file => Object.assign(file, {
            //     loading: true,
            //     preview: URL.createObjectURL(file)
            // }) as PreviewableFile);
            // setFilesMove(filesMove + 1);
            // // Promise.all(
            acceptedFiles.forEach(file => {

                const preview = URL.createObjectURL(file)
                if (!files.find(f => f.name === file.name))
                    files.push(Object.assign(file, {
                        loading: true,
                        preview
                    }) as PreviewableFile);

                const img = document.createElement('img');
                const cvn = document.createElement('canvas');
                const ctx = cvn.getContext('2d');

                if (!ctx)
                    return;

                let greyScale: Uint8Array | null = null;
                img.onload = function () {

                    cvn.height = img.naturalHeight;
                    cvn.width = img.naturalWidth;
                    ctx.drawImage(img, 0, 0);
                    const rgba = ctx.getImageData(0, 0, img.naturalWidth, img.naturalHeight).data;
                    greyScale = rgbaToGrayscale(rgba, img.naturalHeight, img.naturalWidth);

                    if (!greyScale)
                        return;

                    getPicoResult({
                        pixels: Array.from(greyScale),
                        ncols: img.naturalWidth,
                        nrows: img.naturalHeight,
                        ldim: img.naturalWidth
                    }, ((result: any) => {

                        const targetFile = files.find(f => f.name === file.name)
                        if (!targetFile)
                            return;

                        (targetFile as any).progress = result.progress;
                        (targetFile as any).status = result.message;
                        setFilesMove(Math.random())

                    })).then(data => {

                        const { detections }: { detections: number[][] } = (data as any);
                        const targetFile = files.find(f => f.name === file.name)
                        if (!targetFile)
                            return;

                        detections.forEach(detection => {
                            const [r, c, scale, q] = detection;
                            ctx.beginPath();
                            ctx.arc(c, r, scale / 2, 0, 2 * Math.PI, false);
                            ctx.lineWidth = 3;
                            ctx.strokeStyle = 'red';
                            ctx.stroke();
                        });

                        cvn.toBlob(blob => {
                            const stampedPreview = blob ? URL.createObjectURL(blob) : undefined;
                            (targetFile as any).loading = false;
                            (targetFile as any).detenctions = detections;
                            (targetFile as any).stampedPreview = stampedPreview;
                            setFilesMove(Math.random())
                        })
                    })
                }
                img.src = preview;
            })
            // )).then(files => {
            //     setFiles(files.filter(Boolean) as PreviewableFile[])
            // );
        }
    });

    useEffect(() => {
        const timer = setInterval(() => {
            getParticipants()
                .then(data => {
                    setParticipants(data)
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

    const thumbs = files.map(file => (
        <div key={file.name} className="relative w-fit">
            {/* <div className="relative overflow-hidden min-w-0 w-full"> */}
            <img
                alt={file.name}
                src={(file as any).stampedPreview ?? file.preview}
                className="max-w-none max-h-32 min-h-32 h-32 w-auto"
                // Revoke data uri after image is loaded
                onLoad={() => { URL.revokeObjectURL((file as any).stampedPreview ?? file.preview) }}
            />
            {file.loading && (file as any).progress != 100
                ? <span className="absolute left-0 top-0 flex bg-opacity-80 items-center justify-center text-xs bg-slate-100 border h-full w-full">
                    {
                        (file as any).progress
                            ? `${(file as any).progress.toFixed(2)}%`
                            : (file as any).status ?? 'Uploading...'
                    }
                </span>
                : null}
            {/* </div> */}
        </div>
    ));

    return <div className="flex print:block flex-col print:h-[initial] h-full">
        <div className="bg-slate-300 px-5 py-3 flex flex-row">
            <h1 className="flex-grow text-xl font-bold">Image progressing</h1>
            <NavIcons />
        </div>
        <div className="bg-slate-200 px-5 py-4 print:hidden">
            <h2 className="font-bold">Statistiques</h2>
            <div className="flex flex-col">
                <span className="text-sm">Number of participants : <span className="font-bold">{participants.length}</span></span>
                {/* <span className="text-sm">Number of contributions : <span className="font-bold">{participants.filter(p => p.contribution !== undefined).length}</span></span> */}
            </div>
        </div>
        <div className="flex-grow flex flex-col p-4 min-h-0 min-w-0">
            <h2 className="font-bold mb-2">My analyses</h2>
            <div {...getRootProps({ className: 'w-full min-h-20 mb-5' })}>
                <input {...getInputProps()} />
                {thumbs.length
                    ? <div className={`flex flex-wrap gap-3 items-stretch justify-start min-h-40 border-2 border-dashed align-middle p-3 bg-slate-50 ${isDragActive ? 'border-slate-400' : 'border-slate-200'}`}>
                        {thumbs}
                    </div>
                    : <div className={`flex items-center justify-center h-40 border-2 border-dashed align-middle bg-slate-50 ${isDragActive ? 'border-slate-400' : 'border-slate-200'}`}>
                        <span className="block text-sm text-slate-400">Drag 'n' drop some files here, or click to select files</span>
                    </div>
                }
            </div>
            {/* <h2 className="font-bold mb-2">Résultat</h2>
            <div className="h-1/3">
                {voteResult.success
                    ? <div>
                        <span className="text-sm">Moyenne des contributions</span><br />
                        <span className="text-4xl font-bold">{voteResult.average ?? 3}</span>
                    </div>
                    : <div>
                        <span className="text-sm">{voteResult.message}</span><br />
                        <span className="text-4xl font-bold">-</span>
                    </div>
                }
            </div> */}
            <h2 className="font-bold mb-2">List of participants</h2>
            <ParticipantTable participants={participants} />
        </div>
    </div>
}

const rgbaToGrayscale = (rgba: Uint8ClampedArray, nrows: number, ncols: number) => {
    const gray = new Uint8Array(nrows * ncols);
    for (let r = 0; r < nrows; ++r)
        for (let c = 0; c < ncols; ++c)
            // gray = 0.2*red + 0.7*green + 0.1*blue
            gray[r * ncols + c] = (2 * rgba[r * 4 * ncols + 4 * c + 0] + 7 * rgba[r * 4 * ncols + 4 * c + 1] + 1 * rgba[r * 4 * ncols + 4 * c + 2]) / 10;
    return gray;
}

export default Dashboard;