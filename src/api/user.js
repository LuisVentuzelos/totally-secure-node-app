const {Router} = require('express');
const User = require('../persistence/users');
//const db = require('../persistence/db');

const {Pool} = require('pg');

const db = new Pool({
  max: 10,
  connectionString: process.env.DATABASE_URL
});


const router = new Router();

router.post('/', async (request, response) => {
  try {
    const {email, password} = request.body;
    if (!email || !password) {
      return response
        .status(400)
        .json({message: 'email and password must be provided'});
    }

    const user = await User.create(email, password);
    if (!user) {
      return response.status(400).json({message: 'User already exists'});
    }

    return response.status(200).json(user);
  } catch (error) {
    console.error(
      `createUser({ email: ${request.body.email} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});


router.post('/login', async (request, response) => {
  try {
    const email = request.body.email;
    if (!email) {
      return response
        .status(400)
        .json({message: 'email and password must be provided'});
    }

    //const user = await User.find(email);
    var sqlQuery = 'SELECT * FROM users WHERE email=' + email + ';'
    const {rows} = await db.query(sqlQuery);
    user =  rows;
    if (!user) {
      return response.status(400).json({message: 'User already exists'});
    }

    return response.status(200).json(user);
  } catch (error) {
    console.error(
      `createUser({ email: ${request.body.email} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }

  
});



module.exports = router;
