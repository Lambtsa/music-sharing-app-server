import { BadRequestError } from "@core/errors";
import { createRedisIdentifier, isValidData, sanitiseData } from "./sanitise";
import { z } from "zod";

describe("Sanity test", () => {
  test("1 should equal 1", () => {
    expect(1).toBe(1);
  });
});

describe("isValidData helper for object", () => {
  const testSchema = z.object({
    artist: z.string().min(1),
    title: z.string().min(1),
  });
  test("Empty string for both artist and title should throw an error", () => {
    expect(() => {
      isValidData({ artist: "", title: "" }, testSchema);
    }).toThrow(new BadRequestError());
  });
  test("Empty string for artist should throw an error", () => {
    expect(() => {
      isValidData({ artist: "", title: "Fragile" }, testSchema);
    }).toThrow(new BadRequestError());
  });
  test("Empty string for title should throw an error", () => {
    expect(() => {
      isValidData({ artist: "Last Train", title: "" }, testSchema);
    }).toThrow(new BadRequestError());
  });

  test("Input that has whitespace should be returned without", () => {
    expect(
      isValidData({ artist: "LaSt Train    ", title: "Fragile" }, testSchema),
    ).toHaveProperty("artist", "LaSt Train");
    expect(
      isValidData({ artist: "   Last Train", title: "Fragile" }, testSchema),
    ).toHaveProperty("artist", "Last Train");
    expect(
      isValidData({ artist: "Last Train", title: "    Fragile" }, testSchema),
    ).toHaveProperty("title", "Fragile");
    expect(
      isValidData(
        { artist: "   Last Train", title: "Fragile    " },
        testSchema,
      ),
    ).toHaveProperty("title", "Fragile");
  });

  const urlSchema = z.object({
    url: z.string().min(1),
  });

  test("Input that has no extra whitespace should be returned as the same string", () => {
    const url = "https://open.spotify.com/track/2RUhtNBh43RtSg0WBPPq3m";
    expect(isValidData({ url: url }, urlSchema)).toHaveProperty("url", url);
  });

  test("Input that has too much whitespace should be returned without only one", () => {
    expect(
      isValidData({ artist: "Last  Train", title: "Fragile" }, testSchema),
    ).toHaveProperty("artist", "Last Train");
  });
});

describe("sanitiseData helper function", () => {
  test("should remove unnecessary spaces", () => {
    expect(sanitiseData("Last    TraIn    ")).toBe("Last TraIn");
  });

  test("should remove capitals when option is passed", () => {
    expect(sanitiseData("Last    TraIn    ", { lowerCase: true })).toBe(
      "last train",
    );
  });
});

describe("createRedisIdentifier helper function", () => {
  test("should remove unnecessary spaces and add colons", () => {
    expect(createRedisIdentifier("Last    Train    ")).toBe("last:train");
    expect(createRedisIdentifier("Last    Train    (album cover)")).toBe(
      "last:train:(album:cover)",
    );
  });
});
