export function calcBip32ExtendedKey(derivationPath, bip32RootKey) {
    var extendedKey = bip32RootKey;
    // Derive the key from the path
    var pathBits = derivationPath.split("/");
    for (var i=0; i<pathBits.length; i++) {
        var bit = pathBits[i];
        var index = parseInt(bit);
        if (isNaN(index)) {
            continue;
        }
        var hardened = bit[bit.length-1] == "'";
        if (hardened) {
            extendedKey = extendedKey.deriveHardened(index);
        }
        else {
            extendedKey = extendedKey.derive(index);
        }
    }
    return extendedKey;
}
