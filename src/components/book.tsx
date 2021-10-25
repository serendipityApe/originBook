import React from 'react';
import {Image, Box} from 'native-base';

const Book = () => {
  return (
    <Box
      _dark={{bg: 'blueGray.800', borderColor: 'blueGray.600'}}
      _light={{borderColor: 'muted.200'}}
      marginBottom="5"
      flexBasis="30%"
      flexShrink={0}
      flexGrow={0}
      borderWidth="1">
      <Image
        source={{
          uri: 'https://wallpaperaccess.com/full/317501.jpg',
        }}
        alt="Alternate Text"
        size="xl"
      />
    </Box>
  );
};

export default Book;
