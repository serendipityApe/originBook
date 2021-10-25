import React from 'react';
import {AddIcon, Box} from 'native-base';
const blankBook = () => {
  return (
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
  );
};

export default blankBook;
