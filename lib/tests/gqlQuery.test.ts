// Tests using mocha

import * as assert from "assert";
import gqlQuery from "../utils/gqlQuery";
import {buildSchema, graphql} from "graphql";

describe("gqlQuery", () => {
    it("should return a string", () => {
        const result = gqlQuery("query", "test", ["test"]);
        assert.equal(typeof result, "string");
    });

    it("should return a valid GraphQL query", () => {
        const result = gqlQuery("query", "test", ["test"]);
        assert.equal(result, "query { test { test  } }");
    });

    it("should return a valid query with multiple fields", () => {
        const result = gqlQuery("query", "test", ["test", "test2"]);
        assert.equal(result, "query { test { test test2  } }");
    });

    it("should be able to use objects", () => {
        const result = gqlQuery("query", "test", [{test: ["test", "test2"]}, "foo", {bar: ["hello"]}]);
        assert.equal(result, "query { test { test { test test2 } foo bar { hello }  } }");
    });

    it("should make a correct graphql request", async () => {
        const query = gqlQuery("query", "hello", ["world", {"foo": ["bar", "hello"]}]);
        const schema = buildSchema(`
            type Query {
                hello: HelloQuery
            }

            type HelloQuery {
                world: String!
                foo: FooType!
            }

            type FooType {
                bar: String!
                hello: String!
            }
        `);

        const resolver = {
            hello: () => {
                return {
                    "world": "Pass",
                    "foo": {
                        "bar": "Pass",
                        "hello": "Pass"
                    }
                }
            }
        };

        const res = await graphql({
            schema,
            source: query,
            rootValue: resolver
        })

        // @ts-ignore
        assert.equal(res.data.hello.foo.bar, "Pass")

    })

})
