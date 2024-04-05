import secretariumHandler from './secretariumHandler'

const klaveContract = import.meta.env.VITE_APP_KLAVE_CONTRACT;
const selfId = '';

export const waitForConnection = () =>
    new Promise<void>(resolve => {
        const loopCondition = () => {
            const isConnected = secretariumHandler.isConnected()
            if (isConnected)
                resolve();
            else
                setTimeout(loopCondition, 1000);
        }
        loopCondition()
    })

export const sayHello = async (): Promise<boolean> => waitForConnection().then(() => true)

export const getSelfId = () => selfId

export type ServiceInfo = {
    success: false,
    message: string;
} | {
    success: true;
    branch: string;
    index: string;
}

export type ProofOfExistenceOutput = {
    success: false,
    message: string;
} | {
    success: true;
    hash: string;
    index: string; //to be modified with trusted time
}

export const getIndexInfo = async (): Promise<ServiceInfo> => waitForConnection()
    .then(() => secretariumHandler.request(klaveContract, 'fetchIndex', {}, `getIndexInfo-${Math.random()}`))
    .then(tx =>
        new Promise((resolve, reject) => {
            tx.onResult((result: any) => {
                resolve(result)
            })
            tx.onError(error => {
                reject(error);
            })
            tx.send()
        })
    )

export const createProofOfExistence = async (hashInput : string): Promise<ProofOfExistenceOutput> => waitForConnection()
    .then(() => secretariumHandler.request(klaveContract, 'storeProof', {"hash":hashInput}, `storeProof-${Math.random()}`))
    .then(tx =>
        new Promise((resolve, reject) => {
            tx.onResult((result: any) => {
                resolve(result)
            })
            tx.onError(error => {
                reject(error);
            })
            tx.send()
        })
    )