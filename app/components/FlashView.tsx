import {
  setError as setErrorAction,
  setWarning as setWarningAction,
  setInfo as setInfoAction,
} from '../store/flash';
import React, { useEffect, useState } from 'react';
import { Colors, Toast } from 'react-native-ui-lib';
import { connect, ConnectedProps } from 'react-redux';

interface FlashViewProps extends PropsFromRedux {
  error?: string;
  warning?: string;
  info?: string;
}

const FlashView = ({
  error,
  warning,
  info,
  setInfo,
  setWarning,
  setError,
}: FlashViewProps) => {
  const [message, setMessage] = useState<string | undefined>();
  const [color, setColor] = useState<string | undefined>();

  useEffect(() => {
    const m = error || info || warning;
    setMessage(m);
    const c = error
      ? Colors.red30
      : warning
      ? Colors.orange30
      : info
      ? Colors.blue30
      : undefined;
    setColor(c);
  }, [error, info, warning]);

  return (
    <Toast
      backgroundColor={color}
      position="top"
      visible={message != undefined}
      message={message}
      autoDismiss={1500}
      showDismiss
      onDismiss={() => {
        error
          ? setError(undefined)
          : warning
          ? setWarning(undefined)
          : info
          ? setInfo(undefined)
          : undefined;
      }}
    />
  );
};

const mapDispatchToProps = {
  setError: setErrorAction,
  setWarning: setWarningAction,
  setInfo: setInfoAction,
};

const connector = connect(undefined, mapDispatchToProps);

export default connector(FlashView);

type PropsFromRedux = ConnectedProps<typeof connector>;
