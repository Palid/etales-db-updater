import * as admin from "firebase-admin";
import { readFileSync } from "fs";
import { join } from "path";

function readSecrets() {
  const secretsFile = "firebase-secret.json";
  const rootPath = process.env.PWD ?? "";
  const p = join(rootPath, secretsFile);
  let json = "";
  try {
    json = readFileSync(p, "utf-8");
  } catch (error) {
    throw new Error(
      'Secrets file named "firebase-secret.json" was not found in the root directory.'
    );
  }
  const secrets = JSON.parse(json);
  return secrets;
}

export function initFirebase() {
  const secrets = readSecrets();
  admin.initializeApp({
    credential: admin.credential.cert(secrets),
  });
}
