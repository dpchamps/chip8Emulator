# Chip 8 Assembler

The assembly for the CHIP 8 is pretty non-standard and wasn't influenced by anything in particular, but took some inspiration from
the more popular references out there.

## Overview

The basic syntax is as follows:

1. Whitespace and newlines are treated the same, except for one caveat listed below.
2. Commas are treated as whitespace and can be used as a visual tool
3. `$` denotes a register. All registered are parsed in hexadecimal
4. All numbers are parsed by default as decimal, `h` `o` and `n` can be used to denote a radix: hexadecimal, octal and binary respectively.
5. Comments start with `;` and must be terminated by a newline. Anything after the `;` Is ignored by the lexer.
6. `:` Denotes a label
    - When used as a command it is considered a *program label*
    - When used as part of a command, it is considered a *label reference*. It must reference a program label
    - Valid programs may contain unused program labels, but may not contain label references that do not reference a program label
7. Commands are not case-sensitive

As such, the following programs are equivalent (they produce the same output)

```
CLS
DRAW $1, $2, 10h
;do something new

--

CLS
DRAW $1 $2 16

--

cls draw $1, $2, 10h ;do something new
```

## Available Commands

```
legend:
$ - register
n - number
: - label
```

### Display

##### DRAW $a, $b, n

Draws a sprite to the screen with it's x-coordinate starting at $a, it's y-coordinate starting at $b and up up n-height in memory. The first byte drawn to the screen is located a $I, and the last byte drawn to the screen is located at I=n

If a pixel is drawn to an already occupied region of the screen, the pixel is turned off anf the $F register is set to 1.

##### CLS

Clears the screen.

### Flow

##### JMP :reference-label

Jump to a program label

##### JSR :reference-label

Enter a sub-routine at a program label

##### JMI nnn

Jump to address nnn + $x

##### RET

Return from a sub-routine.

*note The available stack depth is 16. The assembler will not throw an error if you exceed this limit (as of writing this), but you will cause a stack overflow error in the emulator.*

### Key

##### SKPR $x

Skip the next instruction if the key stored in register x is pressed.

##### SKUP $x

Skip the next instruction if the key stored in register x is not pressed.

##### KEY $x

Halt all execution until key stored in register x is pressed

### Math

##### OR $x, $y

Store the value of $x | $y into register $x

##### AND $x, $y

Store the value of $x & $y into register $x

##### XOR $x, $y

Store the value of $x ^ $y into register $x

##### ADD $x, $y

Store the value of $x + $y into register $x

##### ADD $x, nn

Store the value of $x + nn into x

**$F set 1 one if a carry occurred**

##### SUB $x, $y

Store the value of $x - $y into register $x

**$F set to 1 if a borrow occurred**

##### RSB $x, $y

Store the value of $y - $x into register $x

**$F set to 1 is a borrow does not occur**

##### SHR $x

Shift register x right by one

##### SHL $x

Shift register $x left by one

##### MOV $x, $y

Set the value of $x to $y

##### MOV $x, nn

Set the value of $x to nn

### Memory

##### MVI nnn

Set $I to address in memory

##### ADI $x

Set $I to $I + $x

##### FONT $x

Set $I to the font sprite located in x.

*Font character is 0-F*

##### STR n

Store registers 0-n in memory starting at position $I

*does not alter the position of $I*

##### LDR n

Load registers 0-n from memory starting at $I

*does not alter position of $I*

##### BCD $x

Binary coded decimal of $x.

Store the 100's decimal digit at I+0, 10's decimal digit at I+1 and the 1's decimal digit at I+2

### Rand

##### RAND $x, nn

Store the product of random value between 0-0xFF & nn into $x;

`$x = (0:0xFF) & nn`

### Timer

##### GDEL $x

Load the value of the delay timer into $x

##### SDEL $x

Load the value of $x into the delay timer

##### SSND $x

Load the value of $x into the sound timer


### Data

##### DATA nnn, nn [, nn1...]

Load nn into memory at location nnn. Optionally load every proceeding byte into memory at nnn+n (where n is the number of additional bytes proceeding the first).

##### NOOP nnnn

Write nnnn to memory in it's current position in the program.

*The difference between NOOP and DATA is that the former can be used inside of loops or to place data in an abstract location (when you never have to refer to it explicitly), whereas DATA is program position agnostic. NOOP is typically used immediately proceeding a program-label when the data must be included within that label.*
