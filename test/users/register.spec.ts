import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
  describe("happy path", () => {
    it("should return 201 status code", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };
      // act
      const response = await request(app).post("/auth/register").send(userData);
      // assert
      expect(response.statusCode).toBe(201);
    });

    it("should return valid JSON", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };
      // act
      const response = await request(app).post("/auth/register").send(userData);
      // assert
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json"),
      );
    });
  });
  describe("sad path", () => {});
});
