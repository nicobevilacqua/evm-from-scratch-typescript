import { expect, test } from "@jest/globals";
import evm from "./evm";
import tests from "./evm.json";

type Block = {
  number: BigInt;
  coinbase: BigInt;
  timestamp: BigInt;
  difficulty: BigInt;
  gaslimit: BigInt;
  chainid: BigInt;
  basefee: BigInt;
};

type Transaction = {
  gasprice: BigInt;
  value: BigInt;
  data: string;
  from: BigInt;
  to: BigInt;
  origin: BigInt;
};

for (const t of tests as any) {
  test(t.name, () => {
    // Note: as the test cases get more complex, you'll need to modify this
    // to pass down more arguments to the evm function (e.g. block, state, etc.)
    // and return more data (e.g. state, logs, etc.)

    const { code, tx = {}, block, state = {} } = t;

    const result = evm(
      hexStringToUint8Array(code.bin),
      parseTransaction(tx),
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
    gaslimit: BigInt(block.gaslimit || 0),
    chainid: BigInt(block.chainid || 0),
    basefee: BigInt(block.basefee || 0),
  };
}

function parseTransaction(tx: any = {}): Transaction {
  return {
    gasprice: BigInt(tx.gasprice || 0),
    value: BigInt(tx.value || 0),
    data: tx.data,
    from: BigInt(tx.from || 0),
    to: BigInt(tx.to || 0),
    origin: BigInt(tx.origin || 0),
  };
}
