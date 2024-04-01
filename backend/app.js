import express from "express"
import cors from "cors"
import mongoose from "mongoose"

mongoose.connect('mongodb://localhost:27017/').then(() => console.log('Connected to database')).catch((error) => console.log(error))

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 1024,
  }
})

const User = mongoose.model('User', UserSchema)

const QuerySchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
  },
  queryMessage: {
    type: String,
    required: true,
  }
})

const Query = mongoose.model('Query' , QuerySchema)

const app=express()

app.use(cors())
app.use(express.json())

app.post("/" , (req,res) => {
    res.send({
        name : req.body.name,
    })
})

app.post("/auth/create-user" , async (req,res) => {

    // Validate request body
    if (!req.body.name || !req.body.email || !req.body.password) {
      return res.status(400).send({
        message : "Name, email, and password are required fields",
      });
    }
    
  
    // Create a new user
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
  
    try {
      // Save the user to the database
      const result = await user.save();
      
      return res.status(201).send({
        message: "User created successfully",
        user: result,
      });
    } catch (error) {
      // Handle errors
      if (error.code === 11000) {
        // Duplicate email error
        return res.status(400).send({
          message : "Email already exists",
        });
      }
      return res.status(500).send({
        message : "Failed to create user",
      });
    }
});

app.post("/auth/signin" , async (req, res) => {

  const { email, password } = req.body

  if ( !email || !password) {
    return res.status(400).send({
      error: "Email, and password are required fields"
    })
  }

  try{

    const user = await User.findOne({ email})

    if(!user || user.password != password){
      return res.status(404).send({
        message : 'Invalid credentials'
      })
    }

    return res.status(200).send({
      message : 'User logged in  successfully',
      user : user
    })
  }
  catch(error) {
    return res.status(500).send({
      message : 'Failed to sign in'
    })
  }

})



app.post("/contact-us" , async (req,res) => {

  const { email , query : queryMessage } = req.body

  if(!email || !queryMessage){
    return res.status(400).send({
      message : 'Fill all the fields'
    })
  }

  const query = new Query({
    email : email,
    queryMessage : queryMessage
  })

  try{
    const data = await query.save()
    return res.status(201).send({
      message : 'Query raised successfullly'
    })
  }
  catch(error) {
    console.log(error)
    return res.status(500).send({
      message : 'Internal server error... Could not raise query'
    })
  }

})

app.listen(5000,function(){
    console.log("Listening on port 5000");
})