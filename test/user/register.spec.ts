import request from "supertest";
import app from "../../src/app";

describe("POST /auth/register", () => {
    describe("Given all fields", () => {
        it("should return 201 status code", async () => {
            // AAA (Arrange, Act, Assert)
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john@email.com",
                password: "1234567",
            };
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            expect(response.statusCode).toBe(201);
        });

        it("should return valid JSON", async () => {
            // AAA (Arrange, Act, Assert)
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john@email.com",
                password: "1234567",
            };
            const response = await request(app)
                .post("/auth/register")
                .send(userData);
            expect(response.headers["content-type"]).toEqual(
                expect.stringContaining("json"),
            );
        });

        it("should persist the user in the database", async () => {
            // AAA (Arrange, Act, Assert)
            const userData = {
                firstName: "John",
                lastName: "Doe",
                email: "john@email.com",
                password: "1234567",
            };
            await request(app).post("/auth/register").send(userData);
        });
    });
    describe("Fields are missing", () => {});
});
