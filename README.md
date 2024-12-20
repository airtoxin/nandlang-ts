# nandlang

NAND circuit programming language.

## Example

```
MOD START AND
    VAR i0 BITIN
    VAR i1 BITIN
    VAR nand NAND
    WIRE i0 _ TO nand i0
    WIRE i1 _ TO nand i1
    VAR not NAND
    WIRE nand _ TO not i0
    WIRE nand _ TO not i1
    VAR o0 BITOUT
    WIRE not _ TO o0 _
MOD END

MOD START XOR
    VAR i0 BITIN
    VAR i1 BITIN
    
    VAR nand0 NAND
    WIRE i0 _ TO nand0 i0
    WIRE i1 _ TO nand0 i1
    
    VAR nand1 NAND
    WIRE i0 _ TO nand1 i0
    WIRE nand0 _ TO nand1 i1
    
    VAR nand2 NAND
    WIRE nand0 _ TO nand2 i0
    WIRE i1 _ TO nand2 i1
    
    VAR nand3 NAND
    WIRE nand1 _ TO nand3 i0
    WIRE nand2 _ TO nand3 i1
    
    VAR o0 BITOUT
    WIRE nand3 _ TO o0 _
MOD END

# HALF ADDER
VAR a BITIN
VAR b BITIN
VAR xor XOR
VAR and AND

# SUM
VAR sum BITOUT
WIRE a _ TO xor i0
WIRE b _ TO xor i1
WIRE xor _ TO sum _

# CARRY
VAR car BITOUT
WIRE a _ TO and i0
WIRE b _ TO and i1
WIRE and _ TO car _
```

## Basic

nandlang is a programming language for creating circuits by connecting modules, much like constructing real-world
circuits. Users write programs using nandlang's features and compile them. The compiled program functions as a circuit,
which processes input signals at runtime and outputs results.

The only primitive module provided by nandlang is the NAND gate, but users can combine these to define and reuse custom
modules.

## Primitive modules

### NAND module

Just like in real-world circuits, the `NAND` gate is the most fundamental module in nandlang. It takes two bit signals
as
input and produces one bit signal as output. If both input bits are `1`, the output is `0`; otherwise, the output is
`1`.

**Ports**

- `i0`: Input
- `i1`: Another input
- `o0`: Output

### BITIN module

`BITIN` is a special module that allows bit sequences to be input from the external environment at runtime. Each bit in
the sequence is sent as a signal to connected modules at each tick.

**Ports**

- `o0`: Output

### BITOUT module

Similar to BITIN, `BITOUT` is a special module. While BITIN receives bit sequences from the external environment, BITOUT
is used to send the execution results of the circuit to the external environment.

**Ports**

- `i0`: Input

### FLIPFLOP module (RS-Type)

The `FLIPFLOP` is a fundamental memory element that can be used in circuits requiring basic state retention.
In nandlang, this primitive module provides a way to set or reset an output (`q`) based on two control inputs: set (`s`) and reset (`r`).

**Behavior**

- When set (`s`) is `1` and reset (`r`) is `0`, the output (`q`) is set to `1`.
- When set (`s`) is `0` and reset (`r`) is `1`, the output (`q`) is reset to `0`.
- When both set (`s`) and reset (`r`) are `0`, the output (`q`) retains its current state.
- When both set (`s`) and reset (`r`) are `1`, an error occurs.

**Ports**

- `s`: Set input. When `1`, it sets the output (`q`) to `1`.
- `r`: Reset input. When `1`, it resets the output (`q`) to `0`.
- `q`: Output. Holds the current state of the flip-flop.

## Syntax

nandlang is a line-oriented programming language where each line represents either a module definition or a connection.
Lines cannot be split into multiple lines or combined into a single line, unlike conventional programming languages.

### Define variable

In nandlang, a module is treated similarly to a "Class" in traditional programming languages. Variables are instances of
these modules, inheriting the ports defined by the module. These ports are used when wiring, functioning like instance
variables.

Defining a variable in nandlang is analogous to placing a module on a circuit board in the real world.

```
VAR [name] [MODULE]
```

`VAR`: Reserved keyword to define a variable.

`[name]`: User-defined variable name, used when wiring.

`[MODULE]`: The name of the module assigned to this variable, such as NAND or a user-defined module.

**Example Usage**

```
VAR in BITIN
VAR out BITOUT
VAR my_nand NAND
VAR my_module MY_MODULE
```

### Wiring

Variables defined using `VAR` can be connected to each other. A single line can represent the connection between a
specified port on a source module and a specified port on a destination module.

```
FROM [src_var] [src_port] TO [dest_var] [dest_port]
```

`FROM`: Reserved keyword to define the source of a wire.

`[src_var]`: Name of the source variable.

`[src_port]`: Output port name of the source variable. If the source variable has only one output port, the port name can be omitted by using `_`.

`TO`: Reserved keyword to define the destination of a wire.

`[dest_var]`: Name of the destination variable.

`[dest_port]`: Input port name of the destination variable. If the destination variable has only one input port, the port name can be omitted by using `_`.

**Example Usage**

```
FROM in o0 TO my_nand i0
FROM in o0 TO my_nand i1
FROM my_nand o0 TO my_module in
```

### Define module

Although it is theoretically possible to represent a circuit using only NAND modules, combining multiple modules into
meaningful units allows the creation of new, reusable modules. These custom modules have names and I/O ports, just like
the primitive NAND module, and can be instantiated as variables.

```
MOD START [NAME]
    VAR [in_port] BITIN
    VAR [out_port] BITOUT
    [...]
MOD END
```

`MOD START`, `MOD END`: Reserved keywords that define a custom module. The section between these declarations specifies
the module's structure.

`[NAME]`: Name of the module

`VAR [in_port] BITIN`: Declaration for receiving input, where `[in_port]` is the name of the input port. Repeat as
needed for multiple inputs.

`VAR [out_port] BITOUT`: Declaration for sending output, where `[out_port]` is the name of the output port. Repeat as
needed for multiple outputs.

`[...]`: Repeated wiring declarations that wire ports within the module. These can wire internal ports to each other or
wire internal ports to the module's external ports.

**Example Usage**

_Indentation is used for visual clarity only._

```
MOD START NOT
    VAR in BITIN
    VAR out BITOUT
    VAR nand NAND
    FROM in o0 TO nand i0
    FROM in o0 TO nand i1
    FROM nand o0 TO out i0
MOD END
```

### Comment

Lines that start with # are treated as comments.

Only single-line comments are supported.

```
# this is comment line
```
