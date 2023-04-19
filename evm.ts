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

const MAX_UINT256 =
  BigInt(0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff);

const ZERO = BigInt(0);
const ONE = BigInt(1);

// TODO: COMPLETE
enum OPCODES {
  STOP = 0x00,
  PUSH0 = 0x5f,
  SGT = 0x13,
  NOT = 0x19,
}

export default function evm(code: Uint8Array): Result {
  let pc = 0;
  let stack: bigint[] = [];

  while (pc < code.length) {
    const opcode = code[pc];
    pc++;

    // STOP
    if (opcode === 0x00) {
      break;
    }

    // PUSH0
    else if (opcode === 0x5f) {
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
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;
      let result = a + b;
      if (result > MAX_UINT256) {
        result -= MAX_UINT256;
      }

      stack.unshift(result);
    }

    // STOP
    else if (opcode === 0x00) {
      break;
    }

    // MUL
    else if (opcode === 0x02) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;
      let result = a * b;
      if (result > MAX_UINT256) {
        result -= MAX_UINT256;
      }

      stack.unshift(result);
    }

    // SUB
    else if (opcode === 0x03) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;
      let result = a - b;
      if (result < 0) {
        result += MAX_UINT256;
      }

      stack.unshift(result);
    }

    // DIV
    else if (opcode === 0x04) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      let result = BigInt(0);
      if (b != ZERO) {
        result = a / b;
      }

      stack.unshift(result);
    }

    // MOD
    else if (opcode === 0x06) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      let result = BigInt(0);
      if (b != ZERO) {
        result = a % b;
      }

      stack.unshift(result);
    }

    // ADDMOD
    else if (opcode === 0x08) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;
      const n: bigint = stack.shift()!;

      let result = BigInt(0);
      if (n != ZERO) {
        result = (a + b) % n;
      }

      stack.unshift(result);
    }

    // MULMOD
    else if (opcode === 0x09) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;
      const n: bigint = stack.shift()!;

      let result = BigInt(0);
      if (n != ZERO) {
        result = (a * b) % n;
      }

      stack.unshift(result);
    }

    // EXP
    else if (opcode === 0x0a) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;
      const result = a ** b;

      stack.unshift(result);
    }

    // SIGNEXTEND
    else if (opcode === 0x0b) {
      // https://ethereum.stackexchange.com/questions/63062/evm-signextend-opcode-explanation
      const size: bigint = stack.shift()!;
      const value: bigint = stack.shift()!;

      const hexCount: number = Number(size + 1n) * 2;
      const hexValue: string = value.toString(16).padStart(hexCount, "0");
      let padWith = "0";

      // negative number
      if (hexValue[0] == "f") {
        padWith = "f";
      }

      stack.unshift(BigInt("0x" + value.toString(16).padStart(64, padWith)));
    }

    // SDIV
    else if (opcode === 0x05) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      let result = BigInt(0);
      if (b != ZERO) {
        result = a / b;
      }

      stack.unshift(result);
    }

    // SMOD
    else if (opcode === 0x07) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      let result = ZERO;
      if (b != ZERO) {
        result = a % b;
      }

      stack.unshift(result);
    }

    // LT
    else if (opcode === 0x10) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      const result = a < b ? ONE : ZERO;

      stack.unshift(result);
    }

    // SLT
    else if (opcode === 0x11) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      const result = a > b ? ONE : ZERO;

      stack.unshift(result);
    }

    // EQ
    else if (opcode === 0x14) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      const result = a === b ? ONE : ZERO;

      stack.unshift(result);
    }

    // ISZERO
    else if (opcode === 0x15) {
      const a: bigint = stack.shift()!;
      const result = a == ZERO ? BigInt(1) : BigInt(0);

      stack.unshift(result);
    }

    // NOT
    else if (opcode === OPCODES.NOT) {
      const a: bigint = stack.shift()!;

      const result = BigInt("0b" + not(a.toString(2).padStart(256, "0")));

      stack.unshift(result);
    }

    // AND
    else if (opcode === 0x16) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      const result = a & b;

      stack.unshift(result);
    }

    // OR
    else if (opcode === 0x17) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      const result = a | b;

      stack.unshift(result);
    }

    // XOR
    else if (opcode === 0x18) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      const result = a ^ b;

      stack.unshift(result);
    }

    // SHL
    else if (opcode === 0x1b) {
      const shift: bigint = stack.shift()!;
      const value: bigint = stack.shift()!;

      if (shift > 255) {
        stack.unshift(ZERO);
      } else {
        let result = value << shift;
        const hexResult = result.toString(16);
        const hexResultLength = hexResult.length;
        if (hexResultLength > 64) {
          result = BigInt("0x" + hexResult.slice(hexResultLength - 64));
        }
        stack.unshift(result);
      }
    }

    // SLT
    else if (opcode === 0x12) {
      let a: bigint = stack.shift()!;
      let b: bigint = stack.shift()!;

      a = getBigIntFromTwoComplement(a);
      b = getBigIntFromTwoComplement(b);

      const result = BigInt(a) < BigInt(b) ? ONE : ZERO;

      stack.unshift(result);
    }

    // SGT
    else if (opcode === OPCODES.SGT) {
      let a: bigint = stack.shift()!;
      let b: bigint = stack.shift()!;

      a = getBigIntFromTwoComplement(a);
      b = getBigIntFromTwoComplement(b);

      const result = BigInt(a) > BigInt(b) ? ONE : ZERO;

      stack.unshift(result);
    }

    pc++;
  }

  return { success: true, stack };
}

// Auxiliary functions
function not(n: string): string {
  return n
    .split("")
    .map((b) => (b === "1" ? "0" : "1"))
    .join("");
}

function getBigIntFromTwoComplement(n: bigint): bigint {
  const isNegative = n.toString(2).padStart(256, "0")[0] == "1";
  if (isNegative) {
    n = -1n * (BigInt("0b" + not(n.toString(2).padStart(256, "0"))) + 1n);
  }
  return n;
}
