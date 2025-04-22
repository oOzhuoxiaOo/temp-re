import { validateBytes } from "gltf-validator";

export function validate(rootFile) {
  // TODO: This duplicates a request of the three.js loader, and could
  // take advantage of THREE.Cache after r90.
  return fetch(rootFile)
    .then(response => response.arrayBuffer())
    .then(buffer => validateBytes(new Uint8Array(buffer)));
}
