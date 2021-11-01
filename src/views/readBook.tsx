import React from 'react';
import PureBook from '../containers/pureBook';

//@type
import {navigationProp, routeProp} from '../types/navigate';

interface Props {
  route: routeProp<'Details'>;
  navigation: navigationProp;
}
const ReadBook: React.FC<Props> = ({route, navigation}) => {
  const {uri} = route.params;
  return <PureBook uri={uri} navigation={navigation} />;
};
export default ReadBook;
