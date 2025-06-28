import { View, Text, I18nManager } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';

const CustomRadioButtons = ({
  radioButtons,
  handleChangeRadioButton,
  selectedId,
  layout = 'row',
  disabled = false,
  isRTL,
}) => {
  const styleOverride = {};
  // Only apply the fix if our app wants RTL but the system hasn't caught up yet.
  if (isRTL && !I18nManager.isRTL) {
    styleOverride.flexDirection = 'row-reverse';
  }
  return (
    <View>
      <RadioGroup
        radioButtons={radioButtons}
        onPress={handleChangeRadioButton}
        selectedId={selectedId}
        layout={layout}
        containerStyle={styleOverride}
        labelStyle={{
          fontFamily: 'Cairo-Medium',
          fontSize: 14,
        }}
      />
    </View>
  );
};

export default CustomRadioButtons;
