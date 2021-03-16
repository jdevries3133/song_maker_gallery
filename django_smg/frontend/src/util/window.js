/**
 * Is there really no better way to use basic browser apis and also be able
 * to test code without causing an implosion other than wrapping every
 * browser API in a function?
 */

export const windowLocation = (property) => {
  return window.location[property] || `window.location.${property} not defined`;
};
