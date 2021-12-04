import { Image, Observation } from '../types/store';
import { schema } from 'normalizr';

const userProcessStrategy = (value, parent, key) => {
  switch (key) {
    case 'owner':
      return { ...value, observations: [parent.id] };
    case 'commenter':
      return { ...value, comments: [parent.id] };
    default:
      return { ...value };
  }
};

const userMergeStrategy = (entityA, entityB) => {
  return {
    ...entityA,
    ...entityB,
    posts: [...(entityA.posts || []), ...(entityB.posts || [])],
    comments: [...(entityA.comments || []), ...(entityB.comments || [])],
  };
};

const user = new schema.Entity(
  'users',
  {},
  {
    mergeStrategy: userMergeStrategy,
    processStrategy: userProcessStrategy,
  },
);

const naming = new schema.Entity(
  'namings',
  {},
  {
    processStrategy: (value, parent, key) => {
      return { ...value, observation: parent.id };
    },
  },
);
const image = new schema.Entity<Image>(
  'images',
  {
    owner: user,
  },
  {
    processStrategy: (value, parent, key) => {
      return { ...value, observation: parent.id };
    },
  },
);

const comment = new schema.Entity(
  'comments',
  {
    owner: user,
  },
  {
    processStrategy: (value, parent, key) => {
      return { ...value, observation: parent.id };
    },
  },
);

const observation = new schema.Entity<Observation>('observations', {
  owner: user,
  images: [image],
  primary_image: image,
  comments: [comment],
});

export default [observation];
