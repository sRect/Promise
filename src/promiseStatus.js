/**
 * https: //promisesaplus.com/#promise-states
 * Promise States
 * A promise must be in one of three states: pending, fulfilled, or rejected.
 * When pending, a promise:
 * may transition to either the fulfilled or rejected state.
 * When fulfilled, a promise:
 * must not transition to any other state.
 * must have a value, which must not change.
 * When rejected, a promise:
 * must not transition to any other state.
 * must have a reason, which must not change.
 * Here, “must not change” means immutable identity(i.e. === ), but does not imply deep immutability.
 */
export const PENDING = "pending";
export const FULFILLED = "fulfilled";
export const REJECTED = "rejected";
