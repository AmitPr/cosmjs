import { Encoding } from "@iov/encoding";

import { decodeBech32Pubkey, encodeAddress, isValidAddress } from "./address";
import { PubKeyEd25519, PubKeySecp256k1 } from "./types";

const { toBase64, fromHex } = Encoding;

describe("address", () => {
  describe("decodeBech32Pubkey", () => {
    it("works", () => {
      expect(
        decodeBech32Pubkey("cosmospub1addwnpepqd8sgxq7aw348ydctp3n5ajufgxp395hksxjzc6565yfp56scupfqhlgyg5"),
      ).toEqual({
        type: "tendermint/PubKeySecp256k1",
        value: "A08EGB7ro1ORuFhjOnZcSgwYlpe0DSFjVNUIkNNQxwKQ",
      });
    });
  });

  describe("isValidAddress", () => {
    it("accepts valid addresses", () => {
      expect(isValidAddress("cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs6")).toEqual(true);
      expect(isValidAddress("cosmosvalcons10q82zkzzmaku5lazhsvxv7hsg4ntpuhdwadmss")).toEqual(true);
      expect(isValidAddress("cosmosvaloper17mggn4znyeyg25wd7498qxl7r2jhgue8u4qjcq")).toEqual(true);
    });

    it("rejects invalid addresses", () => {
      // Bad size
      expect(isValidAddress("cosmos10q82zkzzmaku5lazhsvxv7hsg4ntpuhh8289f")).toEqual(false);
      // Bad checksum
      expect(isValidAddress("cosmos1pkptre7fdkl6gfrzlesjjvhxhlc3r4gmmk8rs7")).toEqual(false);
      // Bad prefix
      expect(isValidAddress("cosmot10q82zkzzmaku5lazhsvxv7hsg4ntpuhd8j5266")).toEqual(false);
    });
  });

  describe("encodeAddress", () => {
    it("works for Secp256k1 compressed", () => {
      const prefix = "cosmos";
      const pubkey: PubKeySecp256k1 = {
        type: "tendermint/PubKeySecp256k1",
        value: "AtQaCqFnshaZQp6rIkvAPyzThvCvXSDO+9AzbxVErqJP",
      };
      expect(encodeAddress(pubkey, prefix)).toEqual("cosmos1h806c7khnvmjlywdrkdgk2vrayy2mmvf9rxk2r");
    });

    it("works for Ed25519", () => {
      const prefix = "cosmos";
      const pubkey: PubKeyEd25519 = {
        type: "tendermint/PubKeyEd25519",
        value: toBase64(fromHex("12ee6f581fe55673a1e9e1382a0829e32075a0aa4763c968bc526e1852e78c95")),
      };
      expect(encodeAddress(pubkey, prefix)).toEqual("cosmos1pfq05em6sfkls66ut4m2257p7qwlk448h8mysz");
    });
  });
});
