import * as CryptoJS from 'crypto-js';
import { ec as EC } from 'elliptic';

const ec = new EC('secp256k1');

export function getEthereumAddresses(bip32ExtendedKey, network, count) {
    let addresses = [];

    for (let index = 0; index < count; index++) {
        let key = bip32ExtendedKey.derive(index);
        let address = key.getAddress().toString();

        let privKeyBuffer = key.keyPair.d.toBuffer();
        let privKey = privKeyBuffer.toString('hex');

        let keyPair = ec.genKeyPair();
        keyPair._importPrivate(privKey, 'hex');

        let compact = false;
        let pubKey = keyPair.getPublic(compact, 'hex').slice(2);

        let pubKeyWordArray = CryptoJS.enc.Hex.parse(pubKey);

        let hash = CryptoJS.SHA3(pubKeyWordArray, { outputLength: 256 });

        let ethereumAddress = address = hash.toString(CryptoJS.enc.Hex).slice(24);

        addresses.push({privKey, pubKey, ethereumAddress});
    }

    return addresses;
}