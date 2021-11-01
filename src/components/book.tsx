import React from 'react';
import {Image, Box, Text, Pressable} from 'native-base';
interface Props {
  name: string;
  pUri: string;
  onPress: Function;
}
const Book: React.FC<Props> = props => {
  return (
    <Pressable
      onPress={() => {
        props.onPress(props.pUri);
      }}
      _dark={{borderColor: 'blueGray.600'}}
      _light={{borderColor: 'muted.200'}}
      flexBasis="30%"
      flexShrink={0}
      flexGrow={0}>
      <Box>
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
    </Pressable>
  );
};

export default Book;
