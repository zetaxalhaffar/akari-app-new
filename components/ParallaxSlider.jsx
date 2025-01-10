import * as React from 'react';
import { Dimensions, Text, View, Image } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import images from '../constants/images';
const defaultDataWith6Colors = ['#B0604D', '#899F9C', '#B3C680', '#5C6265', '#F5D399', '#F1F1F1'];
const ParallaxSlider = () => {
  const { width, height } = Dimensions.get('window');

  const progress = useSharedValue(0);
  const ref = React.useRef(null);

  const baseOptions = {
    vertical: false,
    width,
    height: height - 200,
  };
  const onPressPagination = (index) => {
    ref.current?.scrollTo({
      /**
       * Calculate the difference between the current index and the target index
       * to ensure that the carousel scrolls to the nearest index
       */
      count: index - progress.value,
      animated: true,
    });
  };

  return (
    <>
      <Carousel
        ref={ref}
        {...baseOptions}
        loop
        onProgressChange={progress}
        style={{ width }}
        data={defaultDataWith6Colors}
        renderItem={({ index }) => (
          <>
            <View className="relative flex-1 items-center justify-center overflow-hidden">
              <Image
                resizeMode="contain"
                source={images.only_word}
                className={'z-10 max-w-[150px]'}
              />
            </View>
            <View className="items-center justify-center pt-8">
              <Text className="font-pbold text-4xl text-wrap word-wrap pt-12 text-right">
                مستقبلك العقاري بأمان
              </Text>
              <Text className="text-right font-pmedium text-xl">
                تمكنك من الحصول على المنزل المناسب لك ولأهل بيتك بأسعار مناسبة
              </Text>
            </View>
          </>
        )}
      />
      <View
        className={`absolute bottom-96 left-0 right-0 h-12 flex-row items-center justify-center`}>
        <Pagination.Basic
          progress={progress}
          data={defaultDataWith6Colors.map((color) => ({ color }))}
          size={20}
          dotStyle={{
            backgroundColor: '#774b46',
            borderRadius: 8,
            width: 20,
            height: 20,
            overflow: 'hidden',
          }}
          activeDotStyle={{
            borderRadius: 8,
            overflow: 'hidden',
            width: 20,
            height: 20,
            backgroundColor: '#d4c2b3',
          }}
          containerStyle={[
            {
              gap: 5,
              marginBottom: 10,
            },
          ]}
          horizontal
          onPress={onPressPagination}
        />
      </View>
    </>
  );
};

export default ParallaxSlider;
