import * as aesjs from 'aes-js';

const key = [ 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 ];

// returns a byte array to send to the device
export function createCommand(serialNumber, counter, command) {

  const serialCounter = new Uint32Array(2);
  serialCounter[0] = serialNumber; // create serialNumber bytes 4, uint_32_t
  serialCounter[1] = counter; // create counter bytes 4, uint_32_t

  // yield call(console.log, serialCounter);

  const bytes = new DataView(serialCounter.buffer, 0);
  // yield call(console.log, bytes);

  const result = new Uint8ClampedArray(13);

  for (let i = 0; i < bytes.byteLength; i++) {
    result[i] = bytes.getUint8(i);
  }

  result[8] = command; // create command byte 1, byte

  result[9] = 0x30; // create MAC bytes, 4, byte[4]
  result[10] = 0x31;
  result[11] = 0x32;
  result[12] = 0x33;

  // return a normal array
  return Array.prototype.slice.call(result); //return plain old array
}

export function encryptCommand(command) {
  // The counter is optional, and if omitted will begin at 1
  const aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
  const encryptedBytes = aesCtr.encrypt(command);

  // To print or store the binary data, you may convert it to hex
  const commandHex = aesjs.utils.hex.fromBytes(command);
  console.log(`command Hex: ${commandHex}`);

  // To print or store the binary data, you may convert it to hex
  const encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  console.log(`encryptedHex: ${encryptedHex}`);
  console.log(`encryptedBytes.length: ${encryptedHex.length}`);
  console.log(`encryptedBytes: ${encryptedBytes}`);

  return Array.prototype.slice.call(encryptedBytes); //return plain old array
}
