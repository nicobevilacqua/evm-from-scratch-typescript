/**
 * EVM From Scratch
 * TypeScript template
 *
 * To work on EVM From Scratch in TypeScript:
 *
 * - Install Node.js: https://nodejs.org/en/download/
 * - Go to the `typescript` directory: `cd typescript`
 * - Install dependencies: `yarn` (or `npm install`)
 * - Edit `evm.ts` (this file!), see TODO below
 * - Run `yarn test` (or `npm test`) to run the tests
 * - Use Jest Watch Mode to run tests when files change: `yarn test --watchAll`
 */

type Result = {
  success: boolean;
  stack: bigint[];
};

const MAX_UINT =
  BigInt(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);

export default function evm(code: Uint8Array): Result {
  let pc = 0;
  let stack: bigint[] = [];

  while (pc < code.length) {
    const opcode = code[pc];
    pc++;

    // PUSH0
    if (opcode === 0x5f) {
      stack.unshift(BigInt(0));
    }

    // PUSHX opcodes
    else if (opcode > 0x5f && opcode <= 0x7f) {
      let i = opcode - 0x5f;

      let word = "";
      while (i > 0) {
        word += BigInt(code[pc]).toString(16);
        pc++;
        --i;
      }

      pc--; // workaround

      stack.unshift(BigInt("0x" + word));
    }

    // POP
    else if (opcode === 0x50) {
      stack.shift();
    }

    // ADD
    else if (opcode === 0x01) {
      const a = stack.shift();
      const b = stack.shift();
      let result = a + b;
      if (result > MAX_UINT) {
        result -= MAX_UINT;
      }

      stack.unshift(result);
    }

    // STOP
    else if (opcode === 0x00) {
      break;
    }

    // MUL
    else if (opcode === 0x02) {
      const a = stack.shift();
      const b = stack.shift();
      let result = a * b;
      if (result > MAX_UINT) {
        result -= MAX_UINT;
      }

      stack.unshift(result);
    }

    // SUB
    else if (opcode === 0x03) {
      const a = stack.shift();
      const b = stack.shift();
      let result = a - b;
      if (result < 0) {
        result += MAX_UINT;
      }

      stack.unshift(result);
    }

    // DIV
    else if (opcode === 0x04) {
      const a = stack.shift();
      const b = stack.shift();
      let result = BigInt(0);
      if (b != 0) {
        result = a / b;
      }

      stack.unshift(result);
    }

    // MOD
    else if (opcode === 0x06) {
      const a = stack.shift();
      const b = stack.shift();
      let result = BigInt(0);
      if (b != 0) {
        result = a % b;
      }

      stack.unshift(result);
    }

    // ADDMOD
    else if (opcode === 0x08) {
      const a = stack.shift();
      const b = stack.shift();
      const n = stack.shift();

      let result = BigInt(0);
      if (n != 0) {
        result = (a + b) % n;
      }

      stack.unshift(result);
    }

    // MULMOD
    else if (opcode === 0x09) {
      const a = stack.shift();
      const b = stack.shift();
      const n = stack.shift();

      let result = BigInt(0);
      if (n != 0) {
        result = (a * b) % n;
      }

      stack.unshift(result);
    }

    // EXP
    else if (opcode === 0x0a) {
      const a = stack.shift();
      const b = stack.shift();
      const result = a ** b;

      stack.unshift(result);
    }

    // SIGNEXTEND
    else if (opcode === 0x0b) {
      // TODO
    }

    // SDIV
    else if (opcode === 0x05) {
      const a = stack.shift();
      const b = stack.shift();
      let result = BigInt(0);
      if (b != 0) {
        result = a / b;
      }

      stack.unshift(result);
    }

    pc++;
  }

  return { success: true, stack };
}
