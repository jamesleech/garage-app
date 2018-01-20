// @flow
import * as forge from 'node-forge';

const key = '0123456789abcdef';

function getMsgHMAC(deviceKey, msgArray) {
  const binaryStr = String.fromCharCode.apply(null, msgArray); // convert the command
  const hmac = forge.hmac.create();

  hmac.start('sha256', deviceKey);
  hmac.update(binaryStr);
  const hash = hmac.digest().data;

  return Array.from(hash, char => char.charCodeAt(0));
}

// returns a byte array to send to the device
export function createMsg(serialNumber: number, counter: number, command: number) {
  // use a Uint32Array to create a buffer of bytes from the serial number and counter
  const serialCounter = new Uint32Array(2);
  serialCounter[0] = serialNumber;  // create serialNumber bytes 4, uint_32_t
  serialCounter[1] = counter;       // create counter bytes 4, uint_32_t
  const bytes = new DataView(serialCounter.buffer, 0);
  const msg = new Uint8ClampedArray(8+1);

  for (let i = 0; i < bytes.byteLength; i++) {
    msg[i] = bytes.getUint8(i);
  }
  msg[8] = command; // 1 byte command

  const hmac = getMsgHMAC(key, msg);
  const msgWithHmac = new Uint8ClampedArray(20); // MAX bluetooth characteristic message size
  msgWithHmac.set(msg, 0);
  for (let i = 0; i<11; i++) {
    msgWithHmac[9+i] = hmac[i];
  }
  // use first 11 bytes of hmac
  // for(let i = 0; i < 11; i++) {
  //   msg[9 + i] = hmac[i];
  // }

  return Array.prototype.slice.call(msgWithHmac); // return plain array
}
