/* eslint-disable no-bitwise */
import mux from 'mux-embed';

// This must be more than 250 because getPlayheadTime will only update every
// 250ms
export const MIN_REBUFFER_DURATION = 300;

export const secondsToMs = mux.utils.secondsToMs;

// Helper function to generate "unique" IDs for the player if your player does
// not have one built in
export const generateShortId = function () {
  return (
    '000000' + ((Math.random() * Math.pow(36, 6)) << 0).toString(36)
  ).slice(-6);
};
