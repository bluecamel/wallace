import * as bitcoin from 'bitcoinjs-lib';
import * as config from 'config';
import { calcBip32ExtendedKey } from './helpers/extended-key';
import { getEthereumAddresses } from './helpers/ethereum-address';
import Mnemonic from './bip39';
import * as Web3 from 'web3';

const WEB3_PROVIDER_URL = config.get<string>('web3.provider.url');

const web3 = new Web3(new Web3.providers.HttpProvider(WEB3_PROVIDER_URL));

const MNEMONIC_LANGUAGE = config.get<string>('mnemonic.language');
const MNEMONIC_WORD_COUNT = config.get<number>('mnemonic.wordCount');

const DERIVATION_PATH_BIP44_PURPOSE = config.get<string>('derivationPath.bip44.purpose');
const DERIVATION_PATH_BIP44_COIN = config.get<string>('derivationPath.bip44.coin');
const DERIVATION_PATH_BIP44_ACCOUNT = config.get<string>('derivationPath.bip44.account');

const DERIVED_ADDRESS_COUNT = config.get<number>('derivedAddressCount');

const derivationPath = `m/${DERIVATION_PATH_BIP44_PURPOSE}'/${DERIVATION_PATH_BIP44_COIN}'/${DERIVATION_PATH_BIP44_ACCOUNT}'`;

const network = bitcoin.networks.bitcoin;

const mnemonic = new Mnemonic(MNEMONIC_LANGUAGE);

function scan() {
    const phrase = mnemonic.generate(MNEMONIC_WORD_COUNT / 3 * 32);
    const seed = mnemonic.toSeed(phrase);

    console.log(`phrase: ${phrase}`);

    const bip32RootKey = bitcoin.HDNode.fromSeedHex(seed, network);

    const bip32ExtendedKey = calcBip32ExtendedKey(derivationPath, bip32RootKey);

    const addresses = getEthereumAddresses(bip32ExtendedKey, network, 20);

    for (let index = 0; index < addresses.length; index++) {
        let address = addresses[index];
        let balance = web3.fromWei(web3.eth.getBalance(address.ethereumAddress));
        let transactionCount = web3.eth.getTransactionCount(`0x${address.ethereumAddress}`);

        console.log(`${derivationPath}/${index} - 0x${address.ethereumAddress} - ${balance.toNumber()} ETH - ${transactionCount} tx`);

        if (!balance.isZero() || transactionCount > 0) {
            console.log("\nFUCK FUCK FUCK FUCK\n");

            process.stdout.write('\x07');
            process.exit();
        }
    }

    console.log('');

    setTimeout(scan, 1000);
}

scan();
