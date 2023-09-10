import secretariumHandler from './secretariumHandler'

export const klaveContract = import.meta.env.VITE_APP_KLAVE_CONTRACT;
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

export const getChat = async (): Promise<Chat> => waitForConnection()
    .then(() => secretariumHandler.request(klaveContract, 'getChat', {}, `getChat-${Math.random()}`))
    .then(tx =>
        new Promise((resolve, reject) => {
            tx.onResult((result: any) => {
                resolve(result)
            })
            tx.onError(error => {
                reject(error);
            })
            tx.send().catch(reject)
        })
    )

export const clearChat = async (): Promise<TransactionResult> => waitForConnection()
    .then(() => secretariumHandler.request(klaveContract, 'clearChat', {}, `clearChat-${Math.random()}`))
    .then(tx =>
        new Promise((resolve, reject) => {
            tx.onResult((result: any) => {
                resolve(result)
            })
            tx.onError(error => {
                reject(error);
            })
            tx.send().catch(reject)
        })
    )

export const writeMessage = async (input: ChatMessage): Promise<TransactionResult> => waitForConnection()
    .then(() => secretariumHandler.request(klaveContract, 'writeMessage', { sender: input.sender, message: input.message, timestamp: input.timestamp }, `writeMessage-${Math.random()}`))
    .then(tx =>
        new Promise((resolve, reject) => {
            tx.onResult((result: any) => {
                selfId = result.clientId
                resolve(result)
            })
            tx.onError(error => {
                reject(error);
            })
            tx.send()
        })
    )

export const getSelfId = () => selfId

export type ChatMessage = {
    sender: string;
    message: string;
    timestamp: string;
}

export type Chat = {
    messages: ChatMessage[];
}

export type TransactionResult = {
    success: false,
    message: string;
} | {
    success: true;
    message: string;
}
