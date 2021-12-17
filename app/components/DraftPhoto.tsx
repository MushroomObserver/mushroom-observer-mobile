import { selectById } from '../store/draftImages';
import React from 'react';
import { Image, ImageProps } from 'react-native-ui-lib';
import { connect, ConnectedProps } from 'react-redux';

interface DraftPhotoProps extends Omit<ImageProps, 'source'> {
  id: string;
}

const DraftPhoto = ({
  draftPhoto,
  width,
  height,
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomRightRadius,
  borderBottomLeftRadius,
}: PropsFromRedux) => {
  return (
    <Image
      style={{
        resizeMode: 'cover',
        width,
        height,
        borderRadius,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomRightRadius,
        borderBottomLeftRadius,
      }}
      resizeMethod="auto"
      source={{ uri: draftPhoto?.uri }}
    />
  );
};

const mapStateToProps = (state: any, ownProps: DraftPhotoProps) => ({
  ...ownProps,
  draftPhoto: selectById(state, ownProps.id),
});

const connector = connect(mapStateToProps);

const ConnectedDraftPhoto = connector(DraftPhoto);

type PropsFromRedux = ConnectedProps<typeof connector>;

export default ConnectedDraftPhoto;
