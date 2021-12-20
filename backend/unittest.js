const {getUserProfile} = require("../backend/controllers/user")
const {signIn, signUp, getUserRole, signOut} = require("../backend/controllers/auth")
const User = require("../backend/models/User")
const user = require("../backend/controllers/user")

//mongoose
const mongoose = require('../backend/node_modules/mongoose');
const { MongoClient } = require('../backend/node_modules/mongodb');

/*const request = require('supertest');
let { describe, test } = global;*/

//const expect = require('chai').expect;
var ObjectId = require('../backend/node_modules/mongodb').ObjectID;

jest.useFakeTimers()
jest.setTimeout(7000);

describe("test user", ()=>{

    /*describe("Addition", () =>{
        test('Adding 5 + 3 equals 8', () => {
            expect(5+3).toBe(8)
        })
    })*/

    /*let res;
    beforeEach(() => {
        res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    });
    afterEach(() => {
        jest.resetAllMocks();
    });*/

    /*test("test getUserProfile", ()=>{
        const req = { body: {}, user: { id: ObjectId('613cdf90c3fd3315c005d992') }};
        
        console.log(getUserProfile(req,res))
    
    })*/
})

const mockRequest = () => {
    return {
      body: { 
        email: 'admin@pizzetta.com', 
        password: 'password'},
        error: {},
      user: { _id: Object('613cdf90c3fd3315c005d992')},
    };
};

/*const mockRequest = {
    body: {},
    user: { id: Object('613cdf90c3fd3315c005d992')},
}*/

const mockResponse = () => {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
};

beforeAll(async () => {
    const uri = "mongodb+srv://admin:1@cluster0.qni0p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
    await mongoose.connect(uri,{
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      },
      () => console.log("DB connected")
    )

    /*await mongoose.connect('mongodb+srv://admin:1@cluster0.qni0p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
      },
    () => console.log("DB connected"));*/
});

afterEach(async () => {
    await mongoose.connection.dropDatabase();
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("test connection", ()=>{
    test("connection", async()=>{

        const email='admin@pizzetta.com'
        const findUser = await User.findOne({ email });
        console.log("Hello "+findUser)

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

describe("test SignIn", ()=>{
    
    /*afterEach(() => {
        jest.resetAllMocks();
    });*/
    
    /*test("Get User Profiles", async()=>{
        const req = mockRequest();
        const res = mockResponse();
        const profiles = await user.getUserProfile(req, res)
    })*/

    /*test("SignIn", async()=>{
        
        const req = mockRequest();
        const res = mockResponse();
        const {email, password} = req.body
        //const err = await signIn(req, res);
        const findUser = await User.findOne({ email });
        if(findUser&&(await findUser.matchPassword(password))){
            res.json({
                _id:findUser._id,
                firstName:findUser.firstName,
                lastName:findUser.lastName,
                email:findUser.email,
            })
        }else{
            res.status(400)
        }
        //expect(res.json).toHaveBeenCalledWith({error: "Email/Password is wrong" })
        //expect(res.status).toHaveBeenCalledWith(200)
        
    })*/

    /*test("Logout", async()=>{
        //console.log("This is an user ID: "+mockRequest.user.id)
        //expect(signOut(mockRequest, mockResponse))
        const req = mockRequest();
        const res = mockResponse();
        await signOut(req, res);
        expect(res.json).toHaveBeenCalledWith({message: "Signout successfully"})
        //console.log(signOut(mockRequest, mockResponse()))
    })*/
})