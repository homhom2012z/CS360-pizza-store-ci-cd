const mongoose = require('../backend/node_modules/mongoose');
const { MongoClient } = require('../backend/node_modules/mongodb');

const User = require("../backend/models/User");
const { signUp } = require('../backend/controllers/auth');

const uri = "mongodb+srv://admin:1@cluster0.qni0p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

mongoose.connect(uri,{
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  },
  () => console.log("DB connected")
)
exports.signUpx = async (req, res) => {
    const email='admin@pizzetta.com'
    const findUser = await User.findOne({ email });
    console.log("Hello "+findUser)
}
this.signUpx()
/*client.connect(err => {
    const collection = client.db("myFirstDatabase").collection("users");
    // perform actions on the collection object
    client.close();
});*/