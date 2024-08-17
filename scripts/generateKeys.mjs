import crypto from "crypto";
import fs from "fs";

const { privateKey, publicKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: {
    type: "pkcs1",
    format: "pem",
  },
  privateKeyEncoding: {
    type: "pkcs8",
    format: "pem",
  },
});

fs.writeFileSync("certs/public.pem", publicKey);
fs.writeFileSync("certs/private.pem", privateKey);

// eslint-disable-next-line no-undef
console.log(privateKey);
// eslint-disable-next-line no-undef
console.log(publicKey);
