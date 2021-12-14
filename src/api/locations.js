const {Router} = require('express');
const Location = require('../persistence/locations');

const {Pool} = require('pg');

const db = new Pool({
  max: 10,
  connectionString: process.env.DATABASE_URL
});


const router = new Router();

router.post('/', async (request, response) => {
  try {
    const {location, street,number} = request.body;
    if (!location || !street || !number) {
      return response
        .status(400)
        .json({message: 'Must provide location, street and number'});
    }

    const result = await Location.create(location, street,number);
    if (!result) {
      return response.status(400).json({message: 'Location already exists'});
    }

    return response.status(200).json(result);
  } catch (error) {
    console.error(
      `createUser({ email: ${request.body.location} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }
});


router.post('/update/location', async (request, response) => {
  try {
    const location = request.body.location;
    const street = request.body.street;
    if (!location || !street) {
      return response
        .status(400)
        .json({message: 'oldLocation and newLocation must be provided'});
    }

    var sqlQuery = `Update locations set street ='`+ street +  `' where location ='`+ location + `';`
    //const {rows} = await db.query(sqlQuery);

    var locationVerified = `SELECT * FROM locations WHERE location ='`+ location + `';`
    const rows2 = await db.query(locationVerified);
    locationQuery =  rows2.rows[0].street;
    if (locationQuery !== street) {
      return response.status(400).json({message: 'Couldn\'t update location'});
    }

    return response.status(200).json({message: 'Location Updated'});
  } catch (error) {
    console.error(
      `updateLocation({ email: ${request.body.oldLocation} }) >> Error: ${error.stack}`
    );
    response.status(500).json();
  }

  
});


module.exports = router;
