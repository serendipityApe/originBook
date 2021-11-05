import React from 'react';
import {AddIcon, SearchIcon, Box, Input} from 'native-base';
import MyMenu from './myMenu';
const search = () => {
  return (
    <Input
      isReadOnly
      variant="rounded"
      overflow="visible"
      position="absolute"
      top="8"
      w={{
        base: '96%',
        md: '25%',
      }}
      InputLeftElement={
        <SearchIcon
          size="4"
          ml="4"
          _dark={{color: 'muted.300'}}
          _light={{color: 'blueGray.500'}}
        />
      }
      InputRightElement={<MyMenu />}
    />
  );
};

export default search;
