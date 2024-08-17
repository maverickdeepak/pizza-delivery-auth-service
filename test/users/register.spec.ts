import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import truncateTables from "../utils";
import { User } from "../../src/entity/User";

describe("POST /auth/register", () => {
  let connection: DataSource;
  beforeAll(async () => {
    connection = await AppDataSource.initialize();
  });

  beforeEach(async () => {
    await truncateTables(connection);
  });

  afterAll(async () => {
    await connection.destroy();
  });

  describe("happy path", () => {
    it("1. should return 201 status code", async () => {
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

    it("2. should return valid JSON", async () => {
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

    it("3. should persist the user in the DB", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };

      await request(app).post("/auth/register").send(userData);

      const userRepository = connection.getRepository(User);
      const users = userRepository.find();
      expect((await users).length).toBe(1);
    });

    it("4. should return an ID of the created user", async () => {
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
      expect(response.body).toHaveProperty("id");
    });
  });
  describe("sad path", () => {});
});
