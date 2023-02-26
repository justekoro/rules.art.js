// Tests using mocha

import * as assert from "assert";
import gqlQuery from "../utils/gqlQuery";

describe("gqlQuery", () => {
    it("should return a string", () => {
        const result = gqlQuery("query", "test", ["test"]);
        assert.equal(typeof result, "string");
    });

    it("should return a valid GraphQL query", () => {
        const result = gqlQuery("query", "test", ["test"]);
        assert.equal(result, "query test { test  }");
    });

    it("should return a valid query with multiple fields", () => {
        const result = gqlQuery("query", "test", ["test", "test2"]);
        assert.equal(result, "query test { test test2  }");
    });

    it("should be able to use objects", () => {
        const result = gqlQuery("query", "test", [{test: ["test", "test2"]}, "foo", {bar: ["hello"]}]);
        assert.equal(result, "query test { test { test test2 } foo bar { hello }  }");
    })
})
