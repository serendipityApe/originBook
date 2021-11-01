import {StackNavigationProp} from '@react-navigation/stack';
import {RouteProp} from '@react-navigation/native';

//路由及参数
export type stackParamsList = {
  Details: {
    uri: string;
  };
  Home: {};
};

export type navigationProp = StackNavigationProp<stackParamsList>;

//原本的routeProps获取方式，在这里再封装一下，更加简便
// import {RouteProp} from '@react-navigation/native';
// type routeProp = RouteProp<stackParamsList, 'Details'>;
export type routeProp<T extends keyof stackParamsList> = RouteProp<
  stackParamsList,
  T
>;

// export declare type RouteProp<ParamList extends ParamListBase, RouteName extends keyof ParamList = Keyof<ParamList>> = Route<Extract<RouteName, string>, ParamList[RouteName]>;
