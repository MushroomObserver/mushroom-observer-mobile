import React from 'react';
import {FlatList, Text, View} from 'react-native';
import UserContext from '../components/UserContext';
import DatabaseContext from '../components/DatabaseContext';
import {getObservations} from '../api/musroomObserver';

const ListObservations = () => {
  const {user} = React.useContext(UserContext);
  const {Observation} = React.useContext(DatabaseContext);

  const [observations, setObservations] = React.useState();

  React.useEffect(() => {
    const loadObservations = async () => {
      try {
        const loadedObservations = await getObservations(user);
        const savedObservations = await Observation.bulkCreate(
          loadedObservations,
          {
            include: {all: true, nested: true},
          },
        );
        setObservations(savedObservations);
      } catch (error) {
        console.log(error);
      }
    };
    loadObservations();
  }, [Observation, user]);

  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <FlatList
        data={observations}
        renderItem={({item}) => {
          console.log('item', item.toJSON());
          return <Text key={item.uuid}>{item.notes}</Text>;
        }}
      />
    </View>
  );
};

export default ListObservations;
