import { generateKeyPair } from '@decentralized-identity/ion-tools';
import { writeJSONToDisk } from './utils.js';

console.log('🗝️  Generating secp256k1 key pair');
const authnKeys = await generateKeyPair('secp256k1');

console.log('\n🖨️ Public key:', authnKeys.publicJwk);

const publicKeyFilename = 'key-2-publicKey.json';
console.log(`\n💾 Writing public key to ${publicKeyFilename}`);
await writeJSONToDisk(publicKeyFilename, authnKeys.publicJwk)

const privateKeyFilename = 'key-2-privateKey.json';
console.log(`💾 Writing private key to ${privateKeyFilename}`);
await writeJSONToDisk(privateKeyFilename, authnKeys.privateJwk);