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

describe("Test Authentication", ()=>{

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

    test("SignUp Should return 200 and as expected", async()=>{

        const signUpResponse = await request(app)
        .post('/api/signup')
        .send({firstName: 'test', lastName: 'test', email: 'test@admin.com', password: 'password'})
        expect(signUpResponse.statusCode).toEqual(200)
    })

    test("SignUp error 'User already existed'", async()=>{

        const expectedValue = 'User already exists! How about signing in?';

        const signUpResponse = await request(app)
        .post('/api/signup')
        .send({firstName: 'test', lastName: 'test', email: 'test@admin.com', password: 'password'})

        expect(signUpResponse.body.error).toEqual(expectedValue)
    })

    test("SignIn Should return 200 and as expected", async()=>{

        const expectedValues = {
            user:{
                name: 'test test',
                email: 'test@admin.com',
                role: 0
            }
        }

        const signInResponse = await request(app)
        .post('/api/signin')
        .send({email: 'test@admin.com', password: 'password'})

        expect(signInResponse.statusCode).toEqual(200)

        expect(signInResponse.body.user.name).toEqual(expectedValues.user.name)
        expect(signInResponse.body.user.email).toEqual(expectedValues.user.email)
        expect(signInResponse.body.user.role).toEqual(expectedValues.user.role)
    })

    test("SignIn Error 'Email/Password is wrong'", async()=>{

        //correct input is: email: 'test@admin.com', password: 'password'

        const expectedValue = 'Email/Password is wrong';

        const signInResponseWrongEmail = await request(app)
        .post('/api/signin')
        .send({email: 'test@admin.com', password: 'wrongpassword'})

        expect(signInResponseWrongEmail.statusCode).toEqual(200)
        expect(signInResponseWrongEmail.body.error).toEqual(expectedValue)

        const signInResponseWrongPassword = await request(app)
        .post('/api/signin')
        .send({email: 'wrongEmail@admin.com', password: 'password'})

        expect(signInResponseWrongPassword.statusCode).toEqual(200)
        expect(signInResponseWrongPassword.body.error).toEqual(expectedValue)
    })

    test("SignOut Should return 200 and as expected", async()=>{

        const expectedValue = 'Signout successfully';

        const signOutResponse = await request(app)
        .post('/api/signout')

        expect(signOutResponse.statusCode).toEqual(200)
        expect(signOutResponse.body.message).toEqual(expectedValue)
    })

})

describe("Test User", ()=>{

    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://admin:1@cluster0.qni0p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
          });
    });
    
    afterEach(async () => {
        //await mongoose.connection.dropDatabase();
        //console.log("after Each")
    });
    
    afterAll(async () => {
        await mongoose.connection.close();
        //console.log("after All")
    });

    test("Get User Profile Should return 200 and as expected", async()=>{

        const expectedValues = {
            user:{
                email: 'test@admin.com',
                firstName: 'test',
                lastName: 'test',
                fullName: 'test test',
                email: 'test@admin.com',
            }
        }

        //get user id before get user profile
        const signInResponse = await request(app)
        .post('/api/signin')
        .send({email: 'test@admin.com', password: 'password'})

        const userID = signInResponse.body.user.id;
        

        const getUserProfileResponse = await request(app)
        .post('/api/user/profile')
        .send({user:{id: Object(userID)}})

        expect(getUserProfileResponse.statusCode).toEqual(200)

        expect(getUserProfileResponse.body.user.email).toEqual(expectedValues.user.email)
        expect(getUserProfileResponse.body.user.firstName).toEqual(expectedValues.user.firstName)
        expect(getUserProfileResponse.body.user.lastName).toEqual(expectedValues.user.lastName)
        expect(getUserProfileResponse.body.user.fullName).toEqual(expectedValues.user.fullName)
        expect(getUserProfileResponse.body.user._id).toEqual(userID)
    })

    test("addAddress Should return 200 and as expected", async()=>{

        const expectedValue = "Address added";

         //get user ID
         const signInResponse = await request(app)
         .post('/api/signin')
         .send({email: 'test@admin.com', password: 'password'})
 
         const userID = signInResponse.body.user.id;

        const addAddressRes = await request(app)
        .post('/api/user/address/add')
        .send({
            address:{
                buildingNumber: "testBuilding",
                streetName: 'test St',
                area: 'test Area',
                city: 'test City',
                zipcode: '123456',
                phoneNumber: '0123456789'
            },
            user:{id: Object(userID)}
        })

        expect(addAddressRes.statusCode).toEqual(200)
        expect(addAddressRes.body.message).toEqual(expectedValue)
    })

})

describe("Test Admin", ()=>{

    beforeAll(async () => {
        await mongoose.connect('mongodb+srv://admin:1@cluster0.qni0p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
          });
    });
    
    afterEach(async () => {
        //await mongoose.connection.dropDatabase();
        //console.log("after Each")
    });
    
    afterAll(async () => {
        //await mongoose.connection.dropDatabase();
        await mongoose.connection.db.collection('users').remove({'email': 'test@admin.com'})
        //await mongoose.connection.db.collection('categories').remove({'email': 'test@admin.com'})
        await mongoose.connection.db.collection('categories').remove({'categoryName': 'testCategory'})
        await mongoose.connection.close();
        //console.log("after All")
    });

    test("Admin add category Should return 200 and as expected", async()=>{

        const expectedValues = {
            user:{
                email: 'test@admin.com',
                firstName: 'test',
                lastName: 'test',
                fullName: 'test test',
                email: 'test@admin.com',
            }
        }

        //get user ID
        const signInResponse = await request(app)
        .post('/api/signin')
        .send({email: 'admin@pizzetta.com', password: 'password'})

        const userID = signInResponse.body.user.id;

        const addCategoryRes = await request(app)
        .post('/api/admin/category/create')
        .set('Cookie', [
            'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYzBiYjcwZjNjM2U4MzRiOGU5NmQzOCIsInJvbGUiOjEsImlhdCI6MTY0MDAyMzk4MX0.MXyYdWaTEgO6J6ApRpCB913X1bGjFBxaNsNbD1c3ugI',
        ])
        .send({
            user:{
                id: Object(userID),
                role: 1,
            },
            categoryName: "testCategory",
        })

        expect(addCategoryRes.body.message).toEqual("Category: 'testCategory' created")

        expect(addCategoryRes.statusCode).toEqual(200)
    })

    /*test("addAddress Should return 200 and as expected", async()=>{

        const expectedValue = "Address added";

         //get user ID
         const signInResponse = await request(app)
         .post('/api/signin')
         .send({email: 'test@admin.com', password: 'password'})
 
         const userID = signInResponse.body.user.id;

        const addAddressRes = await request(app)
        .post('/api/user/address/add')
        .set('Authorization', `Bearer${"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxYmNhYjQxMTljMzFhNGJjNGQ2ZDNkMCIsImlhdCI6MTYzOTgyODY3NSwiZXhwIjoxNjQyNDIwNjc1fQ.AfXBIpusZa9w0Lo7ZT4CDLma4‐7Km93J_MlC8WIPKTk"}`)
        .send(givenRequest)
        .end((err, res) => {                       
            res.body.should.have.property('name').eql("John Doe")
            stub.restore()
            done();
        })
        .send({
            address:{
                buildingNumber: "testBuilding",
                streetName: 'test St',
                area: 'test Area',
                city: 'test City',
                zipcode: '123456',
                phoneNumber: '0123456789'
            },
            user:{id: Object(userID)}
        })

        expect(addAddressRes.statusCode).toEqual(200)
        expect(addAddressRes.body.message).toEqual(expectedValue)
    })*/

})