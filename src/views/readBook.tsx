import React from 'react';
import PureBook from '../containers/pureBook';

//@type
import {navigationProp, routeProp} from '../types/navigate';

interface Props {
  route: routeProp<'Details'>;
  navigation: navigationProp;
}
const ReadBook: React.FC<Props> = ({route}) => {
  const {uri} = route.params;
  return <PureBook uri={uri} />;
};
export default ReadBook;
