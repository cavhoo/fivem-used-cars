/** Wait for a given amount of milliseconds. */
export const Delay = (ms: number) => new Promise(res => setTimeout(res, ms));
