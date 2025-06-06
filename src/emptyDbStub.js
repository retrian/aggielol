// src/emptyDbStub.js
// This stub replaces src/db.js in the browser.
export function query() {
  throw new Error("query() is not available in the browser");
}
