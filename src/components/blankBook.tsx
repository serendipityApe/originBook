import React from 'react';
import {AddIcon, Box, Pressable} from 'native-base';
interface Props {
  onPress: Function;
}
const blankBook = (props: Props) => {
  return (
    <Pressable
      onPress={() => {
        props.onPress();
      }}>
      <Box
        _dark={{bg: 'blueGray.800', borderColor: 'blueGray.600'}}
        _light={{borderColor: 'muted.200'}}
        px="8"
        py="12"
        marginBottom="5"
        flexBasis="30%"
        flexShrink={0}
        flexGrow={0}
        borderWidth="1">
        <AddIcon
          size="8"
          _dark={{color: 'blueGray.600'}}
          _light={{color: 'muted.200'}}
        />
      </Box>
    </Pressable>
  );
};

export default blankBook;
