import * as React from 'react';
import { Dimensions, Text, View, Image, I18nManager } from 'react-native';
import { useSharedValue } from 'react-native-reanimated';
import Carousel, { Pagination } from 'react-native-reanimated-carousel';
import images from '../constants/images';

const onBoardingData = [
  {
    title: 'مستقبلك العقاري بأمان تام',
    subtitle: `استثمر في عقارات المستقبل مع عقاري. منصة آمنة وموثوقة تتيح لك التداول العقاري بكل سهولة، وحماية مدخراتك وبناء مستقبل مالي مستقر`,
  },
  {
    title: 'عالم العقارات في متناول يدك',
    subtitle: `استكشف عالم العقارات المتنوعة واختر ما يناسبك. منصة عقاري توفر لك كل ما تحتاجه لاتخاذ قرارات استثمارية صائبة، بدءًا من البحث عن العقارات وحتى إتمام الصفقة`,
  },
  {
    title: 'استثمر واربح مع عقاري',
    subtitle: `حقق أرباحاً مجزية على المدى الطويل من خلال استثماراتك العقارية. عقاري هي منصة الاستثمار الأمثل لنمو ثروتك وتحقيق أهدافك المالية`,
  },
  {
    title: 'شريكك الموثوق في عالم العقارات',
    subtitle: `عقاري هو شريكك الأمثل في رحلتك للإستثمار العقاري. نقدم لك الدعم والخبرات اللازمة لاتخاذ القرارات الدقيقة و الصحيحة ، ونضمن لك تجربة استثمارية سلسة وممتعة`,
  },
];

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
        data={onBoardingData}
        renderItem={({ index, item }) => (
          <>
            <View className="relative flex-1 items-center justify-center overflow-hidden">
              <Image
                resizeMode="contain"
                source={images.only_word}
                className={'z-10 max-w-[150px]'}
              />
            </View>
            <View className="items-center justify-center">
              <Text className="word-wrap text-wrap pt-12 text-right font-pmedium text-3xl">
                {item.title}
              </Text>
              <Text className="text-md px-4 text-right font-pmedium text-gray-500">
                {item.subtitle}
              </Text>
            </View>
          </>
        )}
      />
      <View
        className={`absolute bottom-[26rem] left-0 right-0 h-12 flex-row items-center justify-center ${I18nManager.isRTL ? 'scale-[-1]' : ''}`}>
        <Pagination.Basic
          progress={progress}
          data={onBoardingData.map((color) => ({ color }))}
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
