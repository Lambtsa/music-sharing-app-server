import request from "supertest";
import app from "../app";

describe("Sanity test", () => {
  test("1 should equal 1", () => {
    expect(1).toBe(1);
  });
});

describe("Links endpoint", () => {
  test("should return Hello World", async () => {
    const res = await request(app).get("/api/links");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toEqual({
      message: "Hello World",
    });
  });
});
