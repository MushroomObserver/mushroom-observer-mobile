import {enablePromise, openDatabase} from 'react-native-sqlite-storage';

const tableName = 'Observations';

enablePromise(true);

export const getDBConnection = async () => {
  return openDatabase({name: 'mushroom-observer.db', location: 'default'});
};

/* SQLite Data Types
    NULL. The value is a NULL value.
    INTEGER. The value is a signed integer, stored in 1, 2, 3, 4, 6, or 8 bytes depending on the magnitude of the value.
    REAL. The value is a floating point value, stored as an 8-byte IEEE floating point number.
    TEXT. The value is a text string, stored using the database encoding (UTF-8, UTF-16BE or UTF-16LE).
    BLOB. The value is a blob of data, stored exactly as it was input.
*/
export const createTable = async db => {
  const query = `CREATE TABLE IF NOT EXISTS ${tableName}(
        name TEXT
        date INTEGER
        location TEXT
        is_collection_location INTEGER
        latitude TEXT
        longitude TEXT
        altitude TEXT
        gps_hidden INTEGER
        has_specimen INTEGER
        notes TEXT
        confidence INTEGER
    );`;
  await db.executeSql(query);
};

export const getObservations = async db => {
  try {
    const observations = [];
    const results = await db.executeSql(`SELECT rowid FROM ${tableName}`);
    console.log('results', results);
    results.forEach(result => {
      for (let index = 0; index < result.rows.length; index++) {
        observations.push(result.rows.item(index));
      }
    });
    return observations;
  } catch (error) {
    console.error(error);
    throw Error('Failed to get observations !!!');
  }
};

export const saveObservations = async (db, observation) => {
  //   const insertQuery =
  //     `INSERT OR REPLACE INTO ${tableName}(rowid, value) values` +
  //     observations.map(i => `(${i.id}, '${i.value}')`).join(',');
  //   return db.executeSql(insertQuery);
};

export const deleteObservation = async (db, id) => {
  const deleteQuery = `DELETE from ${tableName} where rowid = ${id}`;
  await db.executeSql(deleteQuery);
};

export const deleteTable = async db => {
  const query = `drop table ${tableName}`;

  await db.executeSql(query);
};
