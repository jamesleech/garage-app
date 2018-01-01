
// returns a byte array to send to the device
export function createCommand(serialNumber, counter, command) {

  // create serialNumber bytes 4, uint_32_t
  // create counter bytes 4, uint_32_t
  // create command byte 1, byte
  // create MAC bytes, 4, byte[4]

  const serialCounter = new Uint32Array(2);
  serialCounter[0] = serialNumber;
  serialCounter[1] = counter;

  // yield call(console.log, serialCounter);

  const bytes = new DataView(serialCounter.buffer, 0);
  // yield call(console.log, bytes);

  const result = new Uint8ClampedArray(13);

  for (let i = 0; i < bytes.byteLength; i++) {
    result[i] = bytes.getUint8(i);
  }

  result[8] = command;

  result[9] = 0x30;
  result[10] = 0x31;
  result[11] = 0x32;
  result[12] = 0x33;

  // return a normal array
  return Array.prototype.slice.call(result);
}
