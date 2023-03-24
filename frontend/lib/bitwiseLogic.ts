/* eslint-disable no-bitwise */

/*
Bitwise operator in use for 'flags'

key: Hex - Base 10 - Binary

IsVictoryBase
- 0x01 - 01 - 0000 0001
IsBuildSite
- 0x04 - 04 - 0000 0100
IsScorched
- 0x10 - 16 - 0001 0000
IsTownClaimed
- 0x20 - 32 - 0010 0000

examples:
IsVictoryBase AND IsTownClaimed
- 0x29 - 41 - 0010 1001
IsVictoryBase AND IsBuildSite
- 0x24 - 36 - 0010 0100
IsVictoryBase AND IsScorched
- 0x11 - 17 - 0001 0001
*/

function isVictoryBase (flag: number): boolean {
  return (flag & 1) !== 0
}

function isBuildSite (flag: number): boolean {
  return (flag & 4) !== 0
}

function isScorched (flag: number): boolean {
  return (flag & 16) !== 0
}

function isTownClaimed (flag: number): boolean {
  return (flag & 32) !== 0
}

export { isVictoryBase, isBuildSite, isScorched, isTownClaimed }
