# Chip 8

This repo is the product of the first part of the series "Let's Have Fun With Interpreters and Bytecode VM's," which can be found here:

[Chapter 1](https://medium.com/@davewritescode/lets-have-fun-with-interpreters-and-bytecode-vms-chapter-1-7876ade6bb5c?source=your_stories_page---------------------------)

[Chapter 2](https://medium.com/@davewritescode/lets-have-fun-with-interpreters-and-bytecode-vms-chapter-2-1f6849bb1b55?source=your_stories_page---------------------------)

[Chapter 3](https://medium.com/@davewritescode/lets-have-fun-with-interpreters-and-bytecode-vms-chapter-3-f2392de2e269?source=your_stories_page---------------------------)

## Status

The project as it stands provides a complete assembler / disassembler and emulator for the Chip 8.

The only gap as of right now is that the emulator itself hard-codes ROMS on load.
Which is an easy fix just haven't gotten around to it.

Otherwise, all code is thoroughly unit tested and there are some integration tests in place for ensuring that the transformation from assembly -> bytecode -> assembly maintains the integrity of whatever chip 8 program is being translated.

There are a few things on the horizon:

- Compile a small subset of javascript into bytecode
- Chip 8 runtime ( extended alphabet, variables )
- Watch an assembly file for automatic compilation into bytecode

I've been careful to comment some interesting parts of the code, but please feel free to submit pull requests if any bugs are found or you feel something can be optimized.

## Overview

As mentioned above, the repo provides a complete assembler / disassembler and emulator for the Chip 8. It was designed as a toy for scratching the surface on the topic of Virtual Machines and Interpreters.

### Installing, running

The basics:

```bash
npm install
npm run build
npm run start
```

The default chip8 program is [helloworld](asm/hello-world).


### REPL

Probably the most helpful tool in this repo that isn't mentioned at all in any of the writeups is the REPL, which can be run via `npm run REPL`

This provides an intuitive cli to assemble and disassemble chip8 programs, and preforms other helpful tasks for analyzing existing programs and writing new ones.

Careful when saving assembly / disassembly with the REPL, it provides no warning for overwriting files.

### Writing assembly

Take a look at the files in [asm](asm/) for what the general workflow is for writing valid chip 8 programs using this assembler.

Take a look at [the assembly docs](AssemblyDocs.md) for a quick reference for *how* to write valid assembly.

## Submission guidelines

To run the tests, `npm run test`

If you are going to submit a pr, there are two general rules:

1. Squash your commits.
2. Write any appropriate tests **before** submitting, ensure that existing tests are still passing.

PR's will be rejected if they don't follow the above two guidelines.

Bugs, Comments and Requests are encouraged, the general rule is: Don't be a Dick. Be civil and gracious: this is a toy project that
I build for fun.