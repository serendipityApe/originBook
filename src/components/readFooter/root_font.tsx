import React from 'react';
import {View, Actionsheet, Stack, Slider, Progress, Text} from 'native-base';
// import {store} from '../redux/store';
interface Props {
  isOpen: boolean;
  onClose: Function;
  fontSize: [number, React.Dispatch<React.SetStateAction<number>>];
}
const FooterFont: React.FC<Props> = props => {
  const [fontSize, setFontSize] = props.fontSize;
  return (
    <View>
      <Actionsheet
        // disableOverlay
        hideDragIndicator
        onClose={() => {
          props.onClose();
        }}
        isOpen={props.isOpen}>
        <Actionsheet.Content>
          <Stack direction="row" paddingTop="5" space={3}>
            <Text>字号：</Text>
            <Slider
              width="70%"
              marginBottom="10"
              size="lg"
              defaultValue={fontSize * 4}
              colorScheme="muted"
              onChange={v => {
                setFontSize(Math.floor(v / 4));
              }}>
              <Slider.Track>
                <Slider.FilledTrack />
              </Slider.Track>
              <Slider.Thumb>{Math.floor(fontSize)}</Slider.Thumb>
            </Slider>
          </Stack>
        </Actionsheet.Content>
      </Actionsheet>
    </View>
  );
};
export default FooterFont;
