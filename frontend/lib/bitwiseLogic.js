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

const isVictoryBase = (flag) => (!!(flag & 1));

const isBuildSite = (flag) => (!!(flag & 4));

const isScorched = (flag) => (!!(flag & 16));

const isTownClaimed = (flag) => (!!(flag & 32));

export {
  isVictoryBase, isBuildSite, isScorched, isTownClaimed,
};
