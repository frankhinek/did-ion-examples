import { anchor, DID } from '@decentralized-identity/ion-tools';
import { readJSONFromDisk, writeJSONToDisk } from './utils.js';

// Read in did:ion operations.
const didIonOpsURL = new URL(`../did-ion-operations-v1.json`, import.meta.url);
const didIonOps = await readJSONFromDisk(didIonOpsURL, { encoding: 'utf8' });

// Instantiate DID using previously saved state.
const did = new DID(didIonOps);

// Read key-2 public key JWK.
const publicKeyURL = new URL(`../key-2-publicKey.json`, import.meta.url);
const publicKeyJwk = await readJSONFromDisk(publicKeyURL, { encoding: 'utf8' });

// Generate update operation to remove key-1 and add key-2.
let updateOperation = await did.generateOperation('update', {
  removePublicKeys: ['key-1'],
  addPublicKeys: [
    {
      id: 'key-2',
      type: 'EcdsaSecp256k1VerificationKey2019',
      publicKeyJwk: publicKeyJwk,
      purposes: [ 'authentication' ]
    }
  ],
});

console.log('💁 Generating an update operation request to publish via an ION node');
let updateRequest = await did.generateRequest(updateOperation);

console.log('🔗 Publishing the update operation on chain');
const anchorRespons = await anchor(updateRequest);

// Get updated ION operations for the DID and save to file.
const ionOps = await did.getAllOperations();
const ionOpsFilename = 'did-ion-operations-v2.json';
console.log(`💾 Writing did:ion operations to ${ionOpsFilename}`);
await writeJSONToDisk(ionOpsFilename, { ops: ionOps });
