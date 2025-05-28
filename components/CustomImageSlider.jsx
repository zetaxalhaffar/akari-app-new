import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Image,
  ScrollView,
  Dimensions,
  Text,
  I18nManager,
  Pressable,
  Linking,
  Modal,
  TouchableOpacity,
} from 'react-native';
import icons from '../constants/icons';
import mainImages from '../constants/images';
import ImageViewer from 'react-native-image-zoom-viewer';

const ImageSlider = ({ images, height, resizeMode = 'cover', newImages }) => {
  const { width } = Dimensions.get('window');
  const scrollViewRef = useRef(null);

  const [active, setActive] = useState(0);

  const onScrollChange = ({ nativeEvent }) => {
    const slide = Math.ceil(nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width);
    if (slide !== active) {
      setActive(slide);
    }
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [indexImage, setIndexImage] = useState(0);

  const [imageSlider, setImageSlider] = useState([]);
  const [viewerImage, setViewerImage] = useState([]);
  const getImages = () => {
    console.log('newImages', newImages);
    if (newImages?.photos && newImages?.photos?.length) {
      const sliderData = newImages.photos.map((item, index) => {
        return {
          source: { uri: item.img },
          thumb: item.img,
          id: index,
        };
      });
      const updatedImagesArray = newImages.photos.map((image) => {
        return {
          url: image.img ?? image, // Replace 'img' with 'url'
        };
      });
      setViewerImage(updatedImagesArray);
      setImageSlider(sliderData);
    } else {
      if (!newImages?.sector?.photos || !newImages?.sector?.photos?.length) return [];
      const sliderData = newImages.sector.photos.map((item, index) => {
        return {
          source: { uri: item.img },
          thumb: item.img,
          id: index,
        };
      });
      const updatedImagesArray = newImages.sector.photos.map((image) => {
        return {
          url: image.img ?? image, // Replace 'img' with 'url'
        };
      });
      setViewerImage(updatedImagesArray);
      setImageSlider(sliderData);
    }
  };

  const scrollToImage = (index) => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({
        x: index * (width - 30),
        animated: true,
      });
      setActive(index);
    }
  };

  useEffect(() => {
    getImages();
  }, [newImages]);
  return (
    <View className="flex-1">
      <Modal
        className={'relative'}
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}>
        <Pressable
          onPress={() => setModalVisible(false)}
          className={`absolute top-5 z-10 p-2 ${I18nManager.isRTL ? 'right-5' : 'left-5'} items-center justify-center`}>
          <Image
            source={icons.rounded_close}
            resizeMode={'contain'}
            className={'h-10 w-10'}
            tintColor={'white'}
          />
        </Pressable>
        <ImageViewer
          index={indexImage}
          saveToLocalByLongPress={false}
          imageUrls={viewerImage}
          useNativeDriver={true}
        />
      </Modal>
      <View
        className={
          'relative mx-4 mt-4 flex-row-reverse justify-center rounded-lg border border-toast-100'
        }>
        <ScrollView
          ref={scrollViewRef}
          pagingEnabled
          horizontal
          onScroll={onScrollChange}
          showsHorizontalScrollIndicator={false}
          style={{ width: width - 32, height: height }}>
          {imageSlider &&
            imageSlider?.map((image, index) => (
              <Pressable
                key={index}
                className="rounded-lg"
                onPress={() => {
                  setModalVisible(true);
                  setIndexImage(index);
                }}>
                <Image
                  source={image.source}
                  className="rounded-lg"
                  resizeMode={resizeMode}
                  style={{ width: width - 30, height }}
                />
              </Pressable>
            ))}
        </ScrollView>
        <View
          className={`absolute w-screen items-start  justify-center gap-2 ${I18nManager.isRTL ? 'flex-row-reverse' : 'flex-row-reverse'}`}
          style={{ bottom: -28 }}>
          {imageSlider.length ? (
            imageSlider?.map((i, k) => (
              <TouchableOpacity
                key={k}
                onPress={() => scrollToImage(k)}
                className={`h-5 w-5 items-center justify-center rounded-full border-4 border-toast-300 ${k == active ? 'bg-white' : 'bg-toast-300'}`}>
                <Image
                  source={icons.dots}
                  tintColor={k == active ? '#a47764' : '#333333'}
                  resizeMode={'contain'}
                  className={'mx-1.5 h-3 w-3 shadow-lg'}
                />
              </TouchableOpacity>
            ))
          ) : (
            <>
              <Image
                source={mainImages.no_photo}
                style={{ width, height, resizeMode: 'contain' }}
                className={'bg-bottom'}
              />
            </>
          )}
        </View>
      </View>
    </View>
  );
};

export default ImageSlider;