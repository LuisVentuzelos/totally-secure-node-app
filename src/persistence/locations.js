const sql = require('sql-template-strings');
const db = require('./db');

module.exports = {
  async create(locationValue, street, number) {
    try {
      const {rows} = await db.query(sql`
      INSERT INTO locations(location, street, number)
        VALUES (${locationValue}, ${street}, ${number})
        RETURNING location, street;
      `);

      const [location] = rows;
      return location;
    } catch (error) {
      if (error.constraint === 'locations_location_key') {
        return null;
      }

      throw error;
    }
  },
  async find(location) {
    var sqlQuery = `SELECT * FROM locations WHERE location='` + location + `';`
    const {rows} = await db.query(sqlQuery);
    return rows;
  }
};
