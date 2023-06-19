// import assert from "assert";
// import sinon from "sinon";
import { describe, it, assert, spy, assertSpyCalls } from "./bdd.js";
import createTranspiler from "../src/mod.ts";

describe("createTranspiler", () => {
  it("should return a function", () => {
    assert.equal(typeof createTranspiler(), "function");
  });
});

describe("transpile", () => {
  it("should call callback based on type", () => {
    const mappers = {
      mystatement: spy()
    };

    const transpile = createTranspiler({ mappers });
    transpile({
      type: "mystatement"
    });

    assertSpyCalls(mappers.mystatement, 1);
  });

  it("should recursively call callback based on type", () => {
    const mappers = {
      ReturnStatement: spy(({ argument }) => `return ${argument}`),

      IfStatement: spy(({ test, consequent }, { transpile }) => {
        return `if ${test} then
          ${transpile(consequent)}
        end`;
      })
    };

    const expectedResult = `if true then
          return false
        end`;

    const ast = {
      type: "IfStatement",
      test: "true",
      consequent: {
        type: "ReturnStatement",
        argument: "false"
      }
    };

    const transpile = createTranspiler({ mappers });
    const result = transpile(ast);

    assertSpyCalls(mappers.ReturnStatement, 1);
    assertSpyCalls(mappers.IfStatement, 1);

    assert.equal(result, expectedResult);
  });

  it("should throw and exception when an unsupported handler is deteced", () => {
    const mappers = {};
    const transpile = createTranspiler({ mappers });

    assert.throws(() => {
      transpile({
        type: "mystatement"
      });
    });
  });
});
