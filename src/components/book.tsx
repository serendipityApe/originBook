import React from 'react';
import {Image, Box, Text} from 'native-base';
interface Props {
  name: string;
  pUri: string;
}
const Book: React.FC<Props> = props => {
  return (
    <Box
      _dark={{bg: 'blueGray.800', borderColor: 'blueGray.600'}}
      _light={{borderColor: 'muted.200'}}
      flexBasis="30%"
      flexShrink={0}
      flexGrow={0}>
      <Box>
        <Image
          source={{
            uri: 'https://wallpaperaccess.com/full/317501.jpg',
          }}
          alt="Alternate Text"
          size="xl"
        />
      </Box>
      <Text fontWeight="bold" marginBottom="5">
        {props.name}
      </Text>
    </Box>
  );
};

export default Book;
