import React from 'react';
import {JustWeb as Web} from '../components/justWeb';

//@type
import {navigationProp, routeProp} from '../types/navigate';

interface Props {
  route: routeProp<'JustWeb'>;
  navigation: navigationProp;
}
const JustWeb: React.FC<Props> = ({route}) => {
  const {uri} = route.params;
  return <Web uri={uri} />;
};
export default JustWeb;
