import { selectById } from '../store/draftImages';
import React from 'react';
import { Image, ImageProps } from 'react-native-ui-lib';
import { connect, ConnectedProps } from 'react-redux';

interface DraftPhotoProps extends Omit<ImageProps, 'source'> {
  id: string;
}

const DraftPhoto = ({
  draftPhoto,
  borderRadius,
  borderTopLeftRadius,
  borderTopRightRadius,
  borderBottomRightRadius,
  borderBottomLeftRadius,
  ...props
}: PropsFromRedux) => {
  return (
    <Image
      blurRadius={1}
      style={{
        borderRadius,
        borderTopLeftRadius,
        borderTopRightRadius,
        borderBottomRightRadius,
        borderBottomLeftRadius,
      }}
      source={{ uri: draftPhoto?.uri }}
      {...props}
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
