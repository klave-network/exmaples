import secretariumHandler from './secretariumHandler'

const klaveContract = import.meta.env.VITE_APP_KLAVE_CONTRACT;
let selfId = '';

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

export const sayHello = async (): Promise<boolean> => waitForConnection()
    .then(() => secretariumHandler.request(klaveContract, 'hello', {}, `hello-${Math.random()}`))
    .then(tx =>
        new Promise((resolve, reject) => {
            tx.onResult((result: any) => {
                selfId = result.clientId;
                resolve(result.success)
            })
            tx.onError(error => {
                reject(error);
            })
            tx.send().catch(reject)
        })
    )

export const getSelfId = () => selfId

export type Participant = {
    id: string;
    name?: string;
    hasContributed: boolean;
}

export const getParticipants = async (): Promise<Participant[]> => waitForConnection()
    .then(() => secretariumHandler.request(klaveContract, 'getParticipants', {}, `getParticipants-${Math.random()}`))
    .then(tx =>
        new Promise((resolve, reject) => {
            tx.onResult((result: any) => {
                resolve(result.participants)
            })
            tx.onError(error => {
                reject(error);
            })
            tx.send().catch(reject)
        })
    )

export type ContributionResult = {
    success: false,
    message: string;
} | {
    success: true;
    average: number;
}

export const getResult = async (): Promise<VoteResult> => waitForConnection()
    .then(() => secretariumHandler.request(klaveContract, 'getResult', {}, `getResult-${Math.random()}`))
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

export type VoteResult = {
    success: false,
    message: string;
} | {
    success: true;
    average: number;
}

export const vote = async (contribution: number): Promise<VoteResult> => waitForConnection()
    .then(() => secretariumHandler.request(klaveContract, 'vote', {
        contribution
    }, `vote-${Math.random()}`))
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

export type OwnContributionResult = {
    success: false,
    message: string;
} | {
    success: true;
    contribution: number;
}

export const getOwnContribution = async (): Promise<OwnContributionResult> => waitForConnection()
    .then(() => secretariumHandler.request(klaveContract, 'getOwnContribution', {}, `getOwnContribution-${Math.random()}`))
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
