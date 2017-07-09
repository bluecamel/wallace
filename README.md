# Wallace

## What do?

Wallace generates a BIP39 phrase and BIP32 seed.  It then generates the corresponding key pair and a number of derived Ethereum addresses.  If any of the addresses has a balance or a transaction count, it freaks right the fuck out, beeps, and exits.  Otherwise, it keeps generating keys and checking addresses until you kill it.

## Ethereum Node

You'll need an Ethereum node with RPC enabled for web3 to connect to in order to check balances and transaction counts.  For geth, start with:

`geth --rpc`

## Usage

All of the fiddly bits are in `config/default.yaml`.  Once you have geth running, you should be able to just build and run.  The npm start script will install, compile, and run everything for you:

`npm run start`


# Thanks

A lot has been borrowed from [Ian Coleman's awesome BIP39 tool](https://github.com/iancoleman/bip39).

