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

enum OPCODES {
  STOP = 0x00,
  ADD = 0x01,
  MUL = 0x02,
  SUB = 0x03,
  DIV = 0x04,
  SDIV = 0x05,
  MOD = 0x06,
  SMOD = 0x07,
  ADDMOD = 0x08,
  MULMOD = 0x09,
  EXP = 0x0a,
  SIGNEXTEND = 0x0b,
  LT = 0x10,
  GT = 0x11,
  SLT = 0x12,
  SGT = 0x13,
  EQ = 0x14,
  ISZERO = 0x15,
  AND = 0x16,
  OR = 0x17,
  XOR = 0x18,
  NOT = 0x19,
  SHA3 = 0x20,
  BYTE = 0x1a,
  SHL = 0x1b,
  SHR = 0x1c,
  SAR = 0x1d,
  ADDRESS = 0x30,
  BALANCE = 0x31,
  ORIGIN = 0x32,
  CALLER = 0x33,
  CALLVALUE = 0x34,
  CALLDATALOAD = 0x35,
  CALLDATASIZE = 0x36,
  CALLDATACOPY = 0x37,
  CODESIZE = 0x38,
  CODECOPY = 0x39,
  GASPRICE = 0x3a,
  EXTCODESIZE = 0x3b,
  EXTCODECOPY = 0x3c,
  RETURNDATASIZE = 0x3d,
  RETURNDATACOPY = 0x3e,
  EXTCODEHASH = 0x3f,
  COINBASE = 0x41,
  TIMESTAMP = 0x42,
  NUMBER = 0x43,
  DIFFICULTY = 0x44,
  GASLIMIT = 0x45,
  CHAINID = 0x46,
  SELFBALANCE = 0x47,
  BASEFEE = 0x48,
  POP = 0x50,
  MLOAD = 0x51,
  MSTORE = 0x52,
  MSTORE8 = 0x53,
  SLOAD = 0x54,
  SSTORE = 0x55,
  JUMP = 0x56,
  JUMPI = 0x57,
  PC = 0x58,
  MSIZE = 0x59,
  GAS = 0x5a,
  JUMPDEST = 0x5b,
  PUSH0 = 0x5f,
  PUSH1 = 0x60,
  PUSH32 = 0x7f,
  DUP1 = 0x80,
  DUP16 = 0x8f,
  SWAP1 = 0x90,
  SWAP16 = 0x9f,
  LOG0 = 0xa0,
  LOG1 = 0xa1,
  LOG2 = 0xa2,
  LOG3 = 0xa3,
  LOG4 = 0xa4,
  CREATE = 0xf0,
  CALL = 0xf1,
  RETURN = 0xf3,
  DELEGATECALL = 0xf4,
  STATICCALL = 0xfa,
  REVERT = 0xfd,
  SELFDESTRUCT = 0xff,
  INVALID = 0xfe,
  BLOCKHASH = 0x40,
}

export default function evm(
  code: Uint8Array,
  tx: any,
  block: Block,
  state: any
): Result {
  let pc = 0;
  let stack: bigint[] = [];
  let memory: string = "";

  function mload(offset: BigInt): BigInt {
    // memory.slice(offset, 32)
    // BigInt("0b" + a.toString(2).padStart(256, "0"));
  }

  function mstore(offset: BigInt, value: BigInt) {}

  while (pc < code.length) {
    const opcode = code[pc];
    pc++;

    // STOP
    if (opcode === OPCODES.STOP) {
      break;
    }

    // PUSH0
    else if (opcode === OPCODES.PUSH0) {
      stack.unshift(BigInt(0));
    }

    // PUSHX opcodes
    else if (opcode > OPCODES.PUSH0 && opcode <= OPCODES.PUSH32) {
      let i = opcode - OPCODES.PUSH0;

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
    else if (opcode === OPCODES.POP) {
      stack.shift();
    }

    // ADD
    else if (opcode === OPCODES.ADD) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;
      let result = a + b;
      if (result > MAX_UINT256) {
        result -= MAX_UINT256;
      }

      stack.unshift(result);
    }

    // STOP
    else if (opcode === OPCODES.STOP) {
      break;
    }

    // MUL
    else if (opcode === OPCODES.MUL) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;
      let result = a * b;
      if (result > MAX_UINT256) {
        result -= MAX_UINT256;
      }

      stack.unshift(result);
    }

    // SUB
    else if (opcode === OPCODES.SUB) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;
      let result = a - b;
      if (result < 0) {
        result += MAX_UINT256;
      }

      stack.unshift(result);
    }

    // DIV
    else if (opcode === OPCODES.DIV) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      let result = BigInt(0);
      if (b != ZERO) {
        result = a / b;
      }

      stack.unshift(result);
    }

    // MOD
    else if (opcode === OPCODES.MOD) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      let result = BigInt(0);
      if (b != ZERO) {
        result = a % b;
      }

      stack.unshift(result);
    }

    // ADDMOD
    else if (opcode === OPCODES.ADDMOD) {
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
    else if (opcode === OPCODES.MULMOD) {
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
    else if (opcode === OPCODES.EXP) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;
      const result = a ** b;

      stack.unshift(result);
    }

    // SIGNEXTEND
    else if (opcode === OPCODES.SIGNEXTEND) {
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
    else if (opcode === OPCODES.SDIV) {
      const a: bigint = getBigIntFromTwoComplement(stack.shift()!);
      const b: bigint = getBigIntFromTwoComplement(stack.shift()!);

      let result = ZERO;
      if (a != ZERO && b != ZERO) {
        result = getBigIntFromTwoComplement(a / b);
      }

      stack.unshift(result);
    }

    // SMOD
    else if (opcode === OPCODES.SMOD) {
      const a: bigint = getBigIntFromTwoComplement(stack.shift()!);
      const b: bigint = getBigIntFromTwoComplement(stack.shift()!);

      let result = ZERO;
      if (a != ZERO && b != ZERO) {
        result = getBigIntFromTwoComplement(a % b);
      }

      stack.unshift(result);
    }

    // LT
    else if (opcode === OPCODES.LT) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      const result = a < b ? ONE : ZERO;

      stack.unshift(result);
    }

    // GT
    else if (opcode === OPCODES.GT) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      const result = a > b ? ONE : ZERO;

      stack.unshift(result);
    }

    // SLT
    else if (opcode === OPCODES.SLT) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      const result = a > b ? ONE : ZERO;

      stack.unshift(result);
    }

    // EQ
    else if (opcode === OPCODES.EQ) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      const result = a === b ? ONE : ZERO;

      stack.unshift(result);
    }

    // ISZERO
    else if (opcode === OPCODES.ISZERO) {
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
    else if (opcode === OPCODES.AND) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      const result = a & b;

      stack.unshift(result);
    }

    // OR
    else if (opcode === OPCODES.OR) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      const result = a | b;

      stack.unshift(result);
    }

    // XOR
    else if (opcode === OPCODES.XOR) {
      const a: bigint = stack.shift()!;
      const b: bigint = stack.shift()!;

      const result = a ^ b;

      stack.unshift(result);
    }

    // SHL
    else if (opcode === OPCODES.SHL) {
      console.log("stack", stack);

      const shift: bigint = stack.shift()!;
      const value: bigint = stack.shift()!;

      console.log(value.toString(16));

      // if (shift > 255) {
      //   stack.unshift(ZERO);
      // } else {
      let result = value << shift;
      const hexResult = result.toString(16);
      const hexResultLength = hexResult.length;
      console.log(hexResultLength);
      if (hexResultLength > 64) {
        result = BigInt("0x" + hexResult.slice(hexResultLength - 64));
      }

      // 111111110000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000;
      // 1111111100000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000;
      // ff00000000000000000000000000000000;
      // 0xf000000000000000000000000000000000000000000000000000000000000000;

      console.log(value.toString(16), value.toString(2));
      console.log(result.toString(16), result.toString(2));

      stack.unshift(result);
      // }
    }

    // SLT
    else if (opcode === OPCODES.SLT) {
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

    // SHR
    else if (opcode === OPCODES.SHR) {
    }

    // SAR
    else if (opcode === OPCODES.SAR) {
    }

    // BYTE
    else if (opcode === OPCODES.BYTE) {
    }

    // DUPX opcodes
    else if (opcode >= OPCODES.DUP1 && opcode <= OPCODES.DUP16) {
      const i = opcode - OPCODES.DUP1;

      const a: bigint = stack[i]!;

      stack.unshift(a);
    }

    // SWAPX opcodes
    else if (opcode >= OPCODES.SWAP1 && opcode <= OPCODES.SWAP16) {
      const i = opcode - OPCODES.SWAP1 + 1;

      const a: bigint = stack[0]!;
      const b: bigint = stack[i]!;

      stack[0] = b;
      stack[i] = a;
    }

    // INVALID
    else if (opcode === OPCODES.INVALID) {
      return { success: false, stack };
    }

    // PC
    else if (opcode === OPCODES.PC) {
      stack.unshift(BigInt(pc));
    }

    // GAS
    else if (opcode === OPCODES.GAS) {
      stack.unshift(MAX_UINT256);
    }

    // JUMP
    else if (opcode === OPCODES.JUMP) {
      const counter = stack.shift()!;
      const dest = code[counter]!;
      if (dest !== OPCODES.JUMPDEST) {
        return { success: false, stack };
      }
      pc = counter;
    }

    // JUMPI
    else if (opcode === OPCODES.JUMPI) {
      const counter = stack.shift()!;
      const b = stack.shift()!;
      if (b) {
        const dest = code[counter]!;
        if (dest !== OPCODES.JUMPDEST) {
          return { success: false, stack };
        }
        pc = counter;
      }
    }

    // COINBASE
    else if (opcode === OPCODES.COINBASE) {
      stack.unshift(block.coinbase);
    }

    // TIMESTAMP
    else if (opcode === OPCODES.TIMESTAMP) {
      stack.unshift(block.timestamp);
    }

    // NUMBER
    else if (opcode === OPCODES.NUMBER) {
      stack.unshift(block.number);
    }

    // DIFFICULTY
    else if (opcode === OPCODES.DIFFICULTY) {
      stack.unshift(block.difficulty);
    }

    // GASLIMIT
    else if (opcode === OPCODES.GASLIMIT) {
      stack.unshift(block.gaslimit);
    }

    // CHAINID
    else if (opcode === OPCODES.CHAINID) {
      stack.unshift(block.chainid);
    }

    // BLOCKHASH
    else if (opcode === OPCODES.BLOCKHASH) {
      const blocknumber = stack.shift()!;
      stack.unshift(ZERO);
    }

    // BALANCE
    else if (opcode === OPCODES.BALANCE) {
      const address = stack.shift()!;
      const { balance = 0 } = state[address] || {};
      stack.unshift(BigInt(balance));
    }

    // CALLVALUE
    else if (opcode === OPCODES.CALLVALUE) {
      stack.unshift(BigInt(tx.value || 0));
    }

    // BASEFEE
    else if (opcode === OPCODES.BASEFEE) {
      stack.unshift(BigInt(block.basefee));
    }

    // GASPRICE
    else if (opcode === OPCODES.GASPRICE) {
      stack.unshift(BigInt(tx.gasprice));
    }

    // CALLER
    else if (opcode === OPCODES.CALLER) {
      stack.unshift(BigInt(tx.from));
    }

    // ORIGIN
    else if (opcode === OPCODES.ORIGIN) {
      stack.unshift(BigInt(tx.origin));
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
