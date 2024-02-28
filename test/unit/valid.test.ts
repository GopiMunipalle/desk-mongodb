import request from 'supertest';
import app from '../../src/app'; 
import authMiddleware from '../../src/middlewares/userMiddleware'
import userModel from '../../src/models/user';
import jwt from 'jsonwebtoken';

