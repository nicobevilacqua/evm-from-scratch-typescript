import { expect, test } from "@jest/globals";
import evm from "./evm";
import tests from "./evm.json";

type Block = {
  number: BigInt;
  coinbase: BigInt;
  timestamp: BigInt;
  difficulty: BigInt;
  gasLimit: BigInt;
  chainId: BigInt;
  basefee: BigInt;
};

for (const t of tests as any) {
  test(t.name, () => {
    // Note: as the test cases get more complex, you'll need to modify this
    // to pass down more arguments to the evm function (e.g. block, state, etc.)
    // and return more data (e.g. state, logs, etc.)

    const { code, tx = {}, block, state = {} } = t;

    const result = evm(
      hexStringToUint8Array(code.bin),
      tx,
      parseBlock(block),
      state
    );

    expect(result.success).toEqual(t.expect.success);
    expect(result.stack).toEqual(t.expect.stack.map((item) => BigInt(item)));
  });
}

function hexStringToUint8Array(hexString: string) {
  return new Uint8Array(
    (hexString?.match(/../g) || []).map((byte) => parseInt(byte, 16))
  );
}

function parseBlock(block: any = {}): Block {
  return {
    number: BigInt(block.number || 0),
    coinbase: BigInt(block.coinbase || 0),
    timestamp: BigInt(block.timestamp || 0),
    difficulty: BigInt(block.difficulty || 0),
    gasLimit: BigInt(block.gasLimit || 0),
    chainId: BigInt(block.chainId || 0),
    basefee: BigInt(block.basefee || 0),
  };
}
