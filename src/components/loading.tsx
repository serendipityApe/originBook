import React from 'react';
import {Spinner, Modal} from 'native-base';

interface Props {
  isOpen: boolean;
}
const Loading: React.FC<Props> = props => {
  return (
    <Modal isOpen={props.isOpen}>
      <Spinner color="emerald.500" />
    </Modal>
  );
};

export default Loading;
