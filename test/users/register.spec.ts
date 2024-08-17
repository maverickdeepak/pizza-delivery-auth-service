import request from "supertest";
import app from "../../src/app";
import { DataSource } from "typeorm";
import { AppDataSource } from "../../src/config/data-source";
import { User } from "../../src/entity/User";

describe("POST /auth/register", () => {
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

    it("5. should return a new user with customer role", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
        role: "customer",
      };
      // act
      const response = await request(app).post("/auth/register").send(userData);
      // assert
      expect(response.body).toHaveProperty("role", "customer");
    });

    it("6. should save the password in DB as hashed password", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
      };

      // act
      await request(app).post("/auth/register").send(userData);

      // assert
      const userRepository = connection.getRepository(User);
      const user = await userRepository.findOneBy({ email: userData.email });
      expect(user?.password).not.toBe(userData.password);
      expect(user?.password).toHaveLength(60);
      expect(user?.password).toMatch(/^\$2b\$\d+\$/);
    });

    it("7. should have unique email, if email is already exist return 409", async () => {
      // arrange
      const userData = {
        firstName: "John",
        lastName: "Doe",
        email: "john@example.com",
        password: "XXXXXXXXXXX",
        role: "customer",
      };
      // act
      const userRepository = connection.getRepository(User);
      await userRepository.save(userData);

      const users = await userRepository.find();
      // assert
      const response = await request(app).post("/auth/register").send(userData);
      expect(response.statusCode).toBe(409);
      expect(users.length).toBe(1);
    });
  });
  describe("sad path", () => {
    it("1. should return 400 when no data is provided", async () => {
      const response = await request(app).post("/auth/register").send({});
      expect(response.statusCode).toBe(400);
      const userRepository = connection.getRepository(User);
      const users = await userRepository.find();
      expect(users.length).toBe(0);
    });
  });
});
