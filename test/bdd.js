import chai from "https://cdn.skypack.dev/chai@4.3.4?dts";
export {
    assertSpyCall,
    assertSpyCalls,
    spy,
  } from "https://deno.land/std@0.192.0/testing/mock.ts";

export const describe = Deno.test;
export const assert = chai.assert;
export const it = Deno.test;