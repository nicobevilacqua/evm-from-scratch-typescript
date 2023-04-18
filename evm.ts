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

export default function evm(code: Uint8Array): Result {
  let pc = 0;
  let stack: bigint[] = [];

  while (pc < code.length) {
    const opcode = code[pc];
    pc++;

    // push0
    if (opcode === 0x5f) {
      stack.push(BigInt(0));
      break;
    }

    // pushX opcodes
    if (opcode >= 0x5f && opcode <= 0x7f) {
      const i = opcode - 0x5f;

      console.log("i", i);

      let word = "";
      while (pc <= i) {
        word += BigInt(code[pc]).toString(16);
        pc++;
      }

      console.log("word", word);
      stack.push(BigInt("0x" + word));
    }
  }

  return { success: true, stack };
}
