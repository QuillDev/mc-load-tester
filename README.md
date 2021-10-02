# Load Tester

A load tester for minecraft servers

## How to use

```bash
# Bash
https://github.com/QuillDev/mc-load-tester.git
cd mc-load-tester
yarn install
yarn start
```

## Command Line Arguments

### All Arguments are optional.

* ``amount`` - the total amount of bots to spawn
* ``sessions`` - the amount of sessions to split these bots into
* ``host`` - the hostname to use for connecting
* ``port`` - the port to use for connecting
* ``namePath`` - the path to read names from for bots

## Example CLI
```bash
yarn start --amount=60 --sessions=6 --host=localhost --port=25565
```