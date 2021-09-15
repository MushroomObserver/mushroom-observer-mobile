import React from 'react';
import * as SQLite from 'expo-sqlite';
import Sequelize, {DataTypes} from 'rn-sequelize';

const database = new Sequelize({
  dialectModule: SQLite,
  database: 'mushroom-observer',
  define: {
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    deletedAt: 'deleted_at',
  },
  dialectOptions: {
    version: '1.0',
    description: 'Observation DB',
  },
});

const Image = database.define('Image', {
  uuid: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
  },
  id: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  date: DataTypes.STRING,
  license: DataTypes.STRING,
});

const User = database.define('User', {
  uuid: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
  },
  id: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  login_name: DataTypes.STRING,
  legal_name: DataTypes.STRING,
});

const Name = database.define('Name', {
  uuid: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
  },
  id: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  name: DataTypes.STRING,
  author: DataTypes.STRING,
  rank: DataTypes.STRING,
  synonym_id: DataTypes.INTEGER,
});

const Naming = database.define('Naming', {
  uuid: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
  },
  id: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  confidence: DataTypes.FLOAT,
});
const Location = database.define('Location', {
  uuid: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
  },
  id: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  name: DataTypes.STRING,
  latitude_north: DataTypes.FLOAT,
  latitude_south: DataTypes.FLOAT,
  longitude_east: DataTypes.FLOAT,
  longitude_west: DataTypes.FLOAT,
});

const Observation = database.define('Observation', {
  uuid: {
    primaryKey: true,
    type: DataTypes.UUID,
    defaultValue: Sequelize.UUIDV4,
    unique: true,
  },
  id: {
    type: DataTypes.INTEGER,
    unique: true,
  },
  date: DataTypes.STRING,
  latitude: DataTypes.FLOAT,
  longitude: DataTypes.FLOAT,
  altitude: DataTypes.FLOAT,
  gps_hidden: DataTypes.BOOLEAN,
  specimen_available: DataTypes.BOOLEAN,
  is_collection_location: DataTypes.BOOLEAN,
  confidence: DataTypes.FLOAT,
  notes: DataTypes.TEXT,
  number_of_views: DataTypes.INTEGER,
  last_viewed: DataTypes.STRING,
});

User.hasMany(Image);
Image.belongsTo(User, {
  as: 'owner',
  targetKey: 'id',
  foreignKey: 'owner_id',
});

User.hasMany(Observation);
Observation.belongsTo(User, {
  as: 'owner',
  targetKey: 'id',
  foreignKey: 'owner_id',
});

Name.hasMany(Observation);
Observation.belongsTo(Name, {
  as: 'consensus',
  targetKey: 'id',
  foreignKey: 'consensus_id',
});

Image.hasMany(Observation);
Observation.belongsTo(Image, {
  as: 'primary_image',
  targetKey: 'id',
  foreignKey: 'primary_image_id',
});

const ObservationImages = database.define('ObservationImages', {
  image_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Image,
      key: 'id',
    },
  },
  observation_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Observation,
      key: 'id',
    },
  },
});
Image.belongsToMany(Observation, {
  as: 'observations',
  through: ObservationImages,
});
Observation.belongsToMany(Image, {
  as: 'images',
  through: ObservationImages,
});

Location.hasMany(Observation);
Observation.belongsTo(Location, {
  as: 'location',
  targetKey: 'id',
  foreignKey: 'location_id',
});

const DatabaseContext = React.createContext();

export const DatabaseProvider = props => {
  React.useEffect(() => {
    async function syncDatabase() {
      try {
        await database.sync({
          force: true,
        });
      } catch (error) {
        console.log('load user error', error);
      }
    }
    syncDatabase();
  }, []);

  return (
    <DatabaseContext.Provider
      value={{
        database,
        Image,
        User,
        Name,
        Location,
        Observation,
      }}>
      {props.children}
    </DatabaseContext.Provider>
  );
};

export const DatabaseConsumer = DatabaseContext.Consumer;

export default DatabaseContext;
