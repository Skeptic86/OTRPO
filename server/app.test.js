const request = require("supertest");
const app = require("./app");

describe("POST /api/result", () => {
  describe("given winner_id loser_id date_time", () => {
    test("should respond with a 200 status code", async () => {
      const response = await request(app)
        .post("/api/result")
        .send({
          winner_id: 1,
          loser_id: 2,
          date_time: new Date().toJSON().slice(0, 10),
        });
      expect(response.statusCode).toBe(200);
    });
    test("should specify json in the content type header", async () => {
      const response = await request(app)
        .post("/api/result")
        .send({
          winner_id: 1,
          loser_id: 2,
          date_time: new Date().toJSON().slice(0, 10),
        });
      expect(response.headers["content-type"]).toEqual(
        expect.stringContaining("json")
      );
    });
  });

  describe("missing data", () => {
    // test("shoould respond with a 400 status code", () => {
    //   const t = async () => {
    //     const response = await request(app)
    //       .post("/api/result")
    //       .send({
    //         winner_id: null,
    //         loser_id: 2,
    //         date_time: new Date().toJSON().slice(0, 10),
    //       });
    //   };
    //   expect(t).toThrow(Error);
    // });
    it("should return an error if winner_id is missing in the request body", async () => {
      const response = await request(app).post("/api/result").send({
        loser_id: 2,
        date_time: "2023-11-17T12:00:00Z",
      });

      expect(response.statusCode).toBe(400); // Assuming you return a 400 Bad Request for missing fields
    });
  });
});
