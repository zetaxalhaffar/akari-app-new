import { View, Text, I18nManager } from 'react-native';
import RadioGroup from 'react-native-radio-buttons-group';

const CustomRadioButtons = ({
  radioButtons,
  handleChangeRadioButton,
  selectedId,
  layout = 'row',
  disabled = false,
}) => {
  return (
    <View>
      <RadioGroup
        radioButtons={radioButtons}
        onPress={handleChangeRadioButton}
        selectedId={selectedId}
        layout={layout}
        labelStyle={{
          fontFamily: 'Cairo-Medium',
          fontSize: 14,
        }}
      />
    </View>
  );
};

export default CustomRadioButtons;
9;
