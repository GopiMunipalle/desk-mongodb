import request from "supertest";
import userModel from "../models/user";
import app from "../app";
import Jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';


jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("User Authentication API Endpoints", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const user = {
    _id: "65e16af81740521d1a094874",
    name: "gopi",
    email: "gopi@gmail.com",
    password: "hashedPassword",
    number: "9988776655",
  };

  describe("POST /signup", () => {
    it("should sign up a new user", async () => {
      const mockUser = {
        name: "Test User",
        email: "gopi@gmail.com",
        password: "testPassword",
        number: "1234567890",
      };

      jest.spyOn(userModel, "findOne").mockResolvedValueOnce(null);
      jest
        .spyOn(userModel.prototype, "save")
        .mockResolvedValueOnce(true as never);
      jest
        .spyOn(bcrypt, "hash")
        .mockResolvedValueOnce("hashedPassword" as never);

      const response = await request(app).post("/user/signUp").send(mockUser);

      expect(response.status).toBe(201);
      expect(response.body).toEqual({ message: "User Created Successfully" });
    });

    it("should handle user already exists during signup", async () => {
      const mockUser = {
        name: "Test User",
        email: "gopi@gmail.com",
        password: "testPassword",
        number: "1234567890",
      };

      jest.spyOn(userModel, "findOne").mockResolvedValueOnce(mockUser);

      const response = await request(app).post("/user/signUp").send(mockUser);

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "User Exists Already" });
    });
    it("Should return name is required", async () => {
      const response = await request(app).post("/user/signUp").send({
        name: " ",
        email: "gopi@gmail.com",
        password: "test",
        number: "8899889988",
      });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ name: "Enter Name" });
    });
    it("Should return email is required", async () => {
      const res = await request(app).post("/user/signUp").send({
        name: "test",
        email: "",
        password: "test",
        number: "9988776655",
      });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ email: "email is Required" });
    });
    it("Should return password is required", async () => {
      const res = await request(app).post("/user/signUp").send({
        name: "test",
        email: "test@gmail.com",
        password: "",
        number: "9988776655",
      });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ password: "Enter Valid Password" });
    });
    it("Should return number validation", async () => {
      const res = await request(app).post("/user/signUp").send({
        name: "test",
        email: "test@gmail.com",
        password: "test",
        number: "",
      });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({
        number: "Number must be containing 10 digits",
      });
    });
    it("Should return Internal Server Error", async () => {
      jest
        .spyOn(userModel, "findOne")
        .mockRejectedValueOnce(new Error("Db Error"));
      const response = await request(app).post("/user/signUp").send(user);
      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal Server Error" });
    });
  });

  describe("POST /login", () => {
    it("should log in an existing user with correct credentials", async () => {
      const mockUser = {
        email: "gopi@gmail.com",
        password: "testPassword",
      };

      jest.spyOn(userModel, "findOne").mockResolvedValueOnce({
        email: "test@example.com",
        password: await bcrypt.hash("testPassword", 10),
      });

      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(true as never);

      jest.spyOn(Jwt, "sign").mockReturnValueOnce("jwtToken" as never);

      const response = await request(app).post("/user/login").send(mockUser);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ jwtToken: "jwtToken" });
    });

    it("should handle user not found during login", async () => {
      const mockUser = {
        email: "nonexistent@example.com",
        password: "testPassword",
      };

      jest.spyOn(userModel, "findOne").mockResolvedValueOnce(null);

      const response = await request(app).post("/user/login").send(mockUser);

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "User not found" });
    });

    it("Should return email validation", async () => {
      const response = await request(app).post("/user/login").send({
        email: "",
        password: "test",
      });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ email: "email is Required" });
    });

    it("Should return password validation", async () => {
      const response = await request(app).post("/user/login").send({
        email: "test@gmail.com",
        password: "",
      });
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ password: "Enter Valid Password" });
    });
    it("Should return 400 on incorrect password", async () => {
      const mockUser = {
        email: "gopi@gmail.com",
        password: "testPassword",
      };

      jest.spyOn(userModel, "findOne").mockResolvedValueOnce({
        email: "gopi@gmail.com",
        password: await bcrypt.hash("incorrectPassword", 10),
      });

      jest.spyOn(bcrypt, "compare").mockResolvedValueOnce(false as never);
      const response = await request(app).post("/user/login").send(mockUser);
      console.log(response.body);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Incorrect Password" });
    });

    it("Should return Internal Server Error on database error", async () => {
      jest
        .spyOn(userModel, "findOne")
        .mockRejectedValueOnce(new Error("Database error"));

      const response = await request(app).post("/user/login").send({
        email: "test@gmail.com",
        password: "anyPassword",
      });

      expect(response.status).toBe(500);
      expect(response.body).toEqual({ error: "Internal Server Error" });
    });
  });

  describe("GET /user", () => {
    it.only("should get the user details for a logged-in user", async () => {
      const mockUser = {
        _id: "65e16af81740521d1a094874",
        name: "gopi",
        email: "gopi@gmail.com",
        password: "hashedPassword",
        number: "9988776655",
      };
      jest.spyOn(userModel, "findOne").mockResolvedValueOnce(true);
      const response = await request(app)
        .get("/user/getOtp")
        .set("authorization", "Bearer jwtToken")
        .send({email:'gopi@gmail.com'})

      console.log("otp-body--1", response.body)
      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockUser);
    });

    it("should handle user not found during getUser", async () => {

      jest.spyOn(userModel, "findOne").mockResolvedValueOnce(true);
      const response = await request(app)
        .get("/user/getOtp")
        .set('Authorization', "Bearer jwtToken")
        .end((err, res) => {  
            if (err) {
              return (err);
            }
        }) 

      console.log("otp-body--2", response.body);
      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: "User not exists" });
    });

    it("Should return error token value not present", async () => {
      jest.spyOn(userModel, "findOne").mockResolvedValueOnce(true);

      const response = await request(app)
        .get("/user/getLoginUser")
        .set("authorization", "Bearer ");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Token not Provided" });
    });

    it("Should return error token not present", async () => {
      jest.spyOn(userModel, "findOne").mockResolvedValueOnce(true);

      const response = await request(app)
        .get("/user/getLoginUser")
        .set("authorization", "");

      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Provide Token" });
    });

    it("Should return 400 on invalid token", async () => {
      jest.spyOn(userModel, "findOne").mockResolvedValueOnce(true);
      jest.spyOn(Jwt, "verify").mockResolvedValueOnce(false as never);
      let token = `Bearer jwtTok`;
      const response = await request(app)
        .get("/user/getLoginUser")
        .set("authorization", token);
      expect(response.status).toBe(400);
      expect(response.body).toEqual({ error: "Invalid Token" });
    });
  });
});


