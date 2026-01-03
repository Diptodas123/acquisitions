import request from "supertest";
import app from "../src/app.js";

describe("API Endpoints", () => {
  describe("GET /health", () => {
    it("should return status OK", async () => {
      const res = await request(app).get("/health").expect(200);
      expect(res.body).toHaveProperty("status", "OK");
      expect(res.body).toHaveProperty("timestamp");
      expect(res.body).toHaveProperty("uptime");
    });
  });

  describe("GET /api", () => {
    it("should return API running message", async () => {
      const res = await request(app).get("/api").expect(200);
      expect(res.body).toHaveProperty("message", "Kubernetes Demo API is running.");
    });
  });

  describe("GET /nonexistent", () => {
    it("should return 404 for unknown endpoints", async () => {
      const res = await request(app).get("/nonexistent").expect(404);
      expect(res.body).toHaveProperty("error", "Endpoint not found.");
    });
  });
});
