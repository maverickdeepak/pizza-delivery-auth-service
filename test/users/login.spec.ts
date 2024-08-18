import request from "supertest";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import app from "../../src/app";

describe("POST /auth/login", () => {
  let connection: DataSource;
  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await connection.dropDatabase();
    await connection.synchronize();
    // await truncateTables(connection);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("happy path", () => {
    it("should return 200 and a token", async () => {
      // arrange
      const userData = {
        firstName: "test",
        lastName: "test",
        email: "test@example.com",
        password: "XXXXXXXXXXX",
      };

      // act
      // create user first
      await request(app).post("/auth/register").send(userData);

      // login user
      const response = await request(app).post("/auth/login").send(userData);
      expect(response.status).toBe(200);
    });
  });

  describe("sad path", () => {});
});
