import { Request, Response } from '../backend/node_modules/express';
import 'regenerator-runtime/runtime'
import mockAxios from 'axios'
import { getMockReq, getMockRes } from '@jest-mock/express'
import supertest from 'supertest';
import {describe, expect, test} from '@jest/globals'

const request = require('supertest');

const app = require('../backend/app')

const mongoose = require('../backend/node_modules/mongoose');
const User = require("../backend/models/User")

const userControllers = require("../backend/controllers/user");
const auth = require("../backend/controllers/auth")

const ObjectId = require('../backend/node_modules/mongodb').ObjectID;

jest.useRealTimers();

describe("Supertest", ()=>{

    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://admin:1@cluster0.qni0p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
          },
        () => console.log("DB connected"));
    });
    
    afterEach(async () => {
        //await mongoose.connection.dropDatabase();
        //console.log("after Each")
    });
    
    afterAll(async () => {
        await mongoose.connection.close();
        //console.log("after All")
    });

    test('Should return 200', async()=>{

        const signupData = await request(app)
        .post('/api/signup')
        .send({firstName: 'Customer', lastName: 'Customer', email: 'customer1@pizzetta.com', password: 'password'})
        
        const res = await request(app)
        .post('/api/signin')
        .send({email: 'customer1@pizzetta.com', password: 'password'})

        //console.log(res.body.user.name)

        expect(res.statusCode).toEqual(200)
        //done()

        /*request(app)
        .get('/api/user/get-role')
        .expect(200, done);*/
    })
})

describe("test Authentications", ()=>{

    const mockRequest = () => {
        return {
            body: { 
            email: 'admin@pizzetta.com', 
            password: 'password'
            }
        };
    };
    
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        res.cookie = jest.fn().mockReturnValue(res);
        return res;
    };

    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://admin:1@cluster0.qni0p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
          },
        () => console.log("DB connected"));
    });
    
    afterEach(async () => {
        //await mongoose.connection.dropDatabase();
        //console.log("after Each")
    });
    
    afterAll(async () => {
        await mongoose.connection.close();
        //console.log("after All")
    });

    test('SignIn Invalid Email', async ()=>{
        const mockRequest = () => {
            return {
              body: { 
                email: 'admin1@pizzetta.com', 
                password: 'password'
            }
            };
        };
        let req = mockRequest()
        let res = mockResponse()

        const expectedInvalidData = {
            error: "Email/Password is wrong"
        }

        const expectedValidData = {
            user:  {
                email: "admin@pizzetta.com",
                id: ObjectId("61b90c84b701623508c94e01"),
                name: "admin admin",
                role: 1,
            },
        }

        const authenData = await auth.signIn(req, res)
        expect(res.json).toHaveBeenCalledWith(expectedInvalidData)
    })

    test('SignIn Invalid Password', async ()=>{
        const mockRequest = () => {
            return {
              body: { 
                email: 'admin@pizzetta.com', 
                password: 'passwordx'
            }
            };
        };
        let req = mockRequest()
        let res = mockResponse()

        const expectedData = {
            error: "Email/Password is wrong"
        }

        const authenData = await auth.signIn(req, res)
        expect(res.json).toHaveBeenCalledWith(expectedData)
    })

    test('SignIn Valid Input', async ()=>{
    
        let req = mockRequest()
        let res = mockResponse()

        const expectedValidData = {
            user:  {
                email: "admin@pizzetta.com",
                id: ObjectId("61b90c84b701623508c94e01"),
                name: "admin admin",
                role: 1,
            },
        }

        const authenData = await auth.signIn(req, res)

        expect(res.json).toHaveBeenCalled()
        expect(res.json).toHaveBeenCalledTimes(1)
        expect(res.json).toHaveBeenCalledWith(expectedValidData)
    })

    test('SignUp', async ()=>{

        const mockRequest = () => {
            return {
                body: { 
                    firstName: 'SignUp',
                    lastName: 'test',
                email: 'SignUp@pizzetta.com', 
                password: 'password'
                }
            };
        };
    
        let req = mockRequest()
        let res = mockResponse()

        /*const expectedValidData = {
            user:  {
                email: "admin@pizzetta.com",
                id: ObjectId("61b90c84b701623508c94e01"),
                name: "SignUp test",
                role: 1,
            },
        }*/

        const expectedUserAlreadyExists = {
            error: "User already exists! How about signing in?"
        }

        const authenData = await auth.signUp(req, res)
        expect(res.json).toHaveBeenCalledWith(expectedUserAlreadyExists)

    })
})

describe("test UserConstrollers", ()=>{

    const mockRequest = () => {
        return {
          body: { 
            email: 'admin@pizzetta.com', 
            password: 'password'},
          user: { _id: Object('613cdf90c3fd3315c005d992')},
        };
    };
    
    const mockResponse = () => {
        const res = {};
        res.status = jest.fn().mockReturnValue(res);
        res.json = jest.fn().mockReturnValue(res);
        return res;
    };

    /*beforeAll(async () => {
        await mongoose.connect('mongodb+srv://admin:1@cluster0.qni0p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
          },
        () => console.log("DB connected"));
    });
    
    afterEach(async () => {
        //await mongoose.connection.dropDatabase();
        //console.log("after Each")
    });
    
    afterAll(async () => {
        await mongoose.connection.close();
        //console.log("after All")
    });*/

    test("connection", async()=>{
        /*let req = mockRequest();
        let res = mockResponse();*/
        const req = getMockReq({
            body: { 
                email: 'admin@pizzetta.com', 
                password: 'password'},
            user: { id: Object('61b90c84b701623508c94e01')},
        })
        const { res, next, clearMockRes } = getMockRes()

        /*let userProfile = await userControllers.getUserProfile(req, res);
        const { user, statusCode } = res;
        console.log(res)*/

        /*expect(res.json).toHaveBeenCalledWith(
            expect.objectContaining({user: {_id: "61b90c84b701623508c94e01", address: [], email: "admin@pizzetta.com", firstName: "admin", fullName: "admin admin", lastName: "admin"}} ),
        )*/

        /*const email='admin@pizzetta.com'
        const findUser = await User.findOne({ email });
        console.log("Hello "+findUser)*/

        /*const mongooseOpts = {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
        };
        mongoose.connect('mongodb+srv://admin:1@cluster0.qni0p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', mongooseOpts,
        () => console.log("DB connected"));*/

    })
})