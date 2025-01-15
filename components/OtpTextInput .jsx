import { OtpInput } from 'react-native-otp-entry';
import { View } from 'react-native';

const CustomOtpTextInput = ({ otp = '', handleOtp }) => {
  return (
    <View>
      <OtpInput
        numberOfDigits={6}
        focusColor="#a47764"
        autoFocus={false}
        hideStick={true}
        placeholder="_______"
        blurOnFilled={true}
        disabled={false}
        type="numeric"
        secureTextEntry={false}
        focusStickBlinkingDuration={500}
        onFocus={() => console.log('Focused')}
        onBlur={() => console.log('Blurred')}
        /* onTextChange={(text) => console.log(text)} */
        onFilled={handleOtp}
        textInputProps={{
          accessibilityLabel: 'One-Time Password',
          style: {
            color: '#a47764',
          },
        }}
        theme={{
          focusStickColor: '#a47764',
          inputStyle: {
            color: '#633e3d',
          },
          placeholderTextStyle: {
            color: '#633e3d',
          },
        }}
      />
    </View>
  );
};

export default CustomOtpTextInput;
