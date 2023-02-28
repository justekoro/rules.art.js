import Client from "../Client";
import * as assert from "assert";

describe("Client", () => {
    it("should be a class", () => {
        assert.equal(typeof Client, "function");
    });

    it("should have a constructor", () => {
        assert.equal(typeof Client.prototype.constructor, "function");
    });

    it("should have a login method", () => {
        assert.equal(typeof Client.prototype.login, "function");
    });

    it("should have a getUser method", () => {
        assert.equal(typeof Client.prototype.getUser, "function");
    });

    it("should be able to correctly get a user", async () => {
        const client = new Client();
        const res = await client.getUser("justekoro");
        assert.equal(res.discord.id, "304541381798658048");
    });
});
