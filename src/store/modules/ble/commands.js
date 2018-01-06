const jsSHA = require("jssha");

const key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];

function hashCommand(command) {
  const shaObj = new jsSHA("SHA-256", "ARRAYBUFFER");
  shaObj.setHMACKey(key, "ARRAYBUFFER");
  shaObj.update(command);
  console.log('hashCommand: return getHMAC');
  return new DataView(shaObj.getHMAC("ARRAYBUFFER"));
}

// returns a byte array to send to the device
export function createCommand(serialNumber, counter, command) {

  const serialCounter = new Uint32Array(2);
  serialCounter[0] = serialNumber; // create serialNumber bytes 4, uint_32_t
  serialCounter[1] = counter; // create counter bytes 4, uint_32_t

  const bytes = new DataView(serialCounter.buffer, 0);
  const result = new Uint8ClampedArray(8+1+11);

  for (let i = 0; i < bytes.byteLength; i++) {
    result[i] = bytes.getUint8(i);
  }

  result[8] = command; // create command byte 1, byte

  const hmac = hashCommand(result);
  console.log(`typeof hmac: ${typeof hmac}`);
  console.log(`hmac: ${hmac}`);

  for(let i = 0; i < 11; i++) {
    console.log((hmac.getUint8(i) & 0xFF).toString(16));
    //use first 11 bytes of hmac
    result[9 + i] = hmac.getUint8(i);
  }

  // console.log(`command: ${result}`);
  // console.log(`command hash: ${hmac}`);
  // return a normal array
  return Array.prototype.slice.call(result); //return plain old array
}
