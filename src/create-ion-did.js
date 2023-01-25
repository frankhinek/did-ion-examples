import { anchor, DID } from '@decentralized-identity/ion-tools';
import { readJSONFromDisk, writeJSONToDisk, writeTextToDisk } from './utils.js';

// Read key-1 public key JWK.
const publicKeyURL = new URL(`../key-1-publicKey.json`, import.meta.url);
const publicKeyJwk = await readJSONFromDisk(publicKeyURL, { encoding: 'utf8' });

console.log('👤 Instantiating DID with the public key JWK');
const did = new DID({
  content: {
    publicKeys: [
      {
        id: 'key-1',
        type: 'EcdsaSecp256k1VerificationKey2019',
        publicKeyJwk,
        purposes: ['authentication']
      }
    ]
  }
});

console.log('💁 Generating a create operation request to publish via an ION node');
const createRequest = await did.generateRequest(0); // 0 = Create, same as did.#ops[0]

console.log('🔗 Anchoring the DID on chain');
const anchorResponse = await anchor(createRequest);

// Get did:ion URIs and save to file.
const didLongURI = await did.getURI();
const didShortURI = await did.getURI('short');
const didIonText = `DID URI:\n${didShortURI}\n\nLong Form URI:\n${didLongURI}`
const didIonFilename = 'did-ion-id.txt';
console.log(`💾 Writing did:ion identifiers to ${didIonFilename}`);
await writeTextToDisk(didIonFilename, didIonText);

// Get ION operations for the DID and save to file.
const ionOps = await did.getAllOperations();
const ionOpsFilename = 'did-ion-operations-v1.json';
console.log(`💾 Writing did:ion operations to ${ionOpsFilename}`);
await writeJSONToDisk(ionOpsFilename, { ops: ionOps });
