import { PropsWithChildren } from 'react'
import { HelmetProvider } from 'react-helmet-async';
import secretariumHandler from './utils/secretariumHandler';
import { EncryptedKeyPairV2, Key, Utils } from '@secretarium/connector';

// TODO : This is for demo purpose only, do not use this in production
const ENC_PWD = 'demoKlave';
const LOC_KEY = 'demo:portalEncKey';

(window as any).secretariumHandler = secretariumHandler;
secretariumHandler.initialize();

const existingKey = window.localStorage.getItem(LOC_KEY)
if (existingKey) {
    const parsedKey: EncryptedKeyPairV2 = JSON.parse(existingKey)
    secretariumHandler.use(parsedKey, ENC_PWD)
        .then(Key.importKey)
        .then(key => key.getRawPublicKey())
        .then(rawPublicKey => Utils.hash(rawPublicKey))
        .then(hashPublicKey => {
            (window as any).currentDevicePublicKeyHash = Utils.toBase64(hashPublicKey, true)
            return secretariumHandler.connect()
        })
        .catch(console.error);
} else {
    secretariumHandler.createKeyPair({
        password: ENC_PWD
    })
        .then(encKey => {
            window.localStorage.setItem(LOC_KEY, JSON.stringify(encKey));
            return Key.importEncryptedKeyPair(encKey, ENC_PWD)
        })
        .then(key => key.getRawPublicKey())
        .then(rawPublicKey => Utils.hash(rawPublicKey))
        .then(hashPublicKey => {
            (window as any).currentDevicePublicKeyHash = Utils.toBase64(hashPublicKey, true)
            return secretariumHandler.connect()
        })
        .catch(console.error);
}

const Providers: React.FC<PropsWithChildren> = ({ children }) => {
    return <HelmetProvider>
        {children}
    </HelmetProvider>
}

export default Providers;
