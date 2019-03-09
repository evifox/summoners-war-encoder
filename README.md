# summoners-war-encoder
Provides encoding requests, decoding requests and responses methods

Usage:
```
import { encryptRequest, decryptRequest } from 'summoners-war-encoder';

const request = { game_index: 2624 };

const encryptedRequest = encryptRequest(JSON.stringlify(request));
console.log(encryptedRequest);
console.log(decryptRequest(encryptedRequest));
```
