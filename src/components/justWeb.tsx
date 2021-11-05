import React from 'react';
import WebView from 'react-native-webview';

interface Props {
  uri: string;
}

export const JustWeb: React.FC<Props> = props => {
  const [uri] = React.useState(props.uri);
  // onShouldStartLoadWithRequest
  return <WebView source={{uri}} />;
};
