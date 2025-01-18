import React, { useEffect, useState } from 'react';
import {
  View, Image, ScrollView, Dimensions, Text, I18nManager, Pressable, Linking, Modal
} from 'react-native';
import icons from "../constants/icons";
import mainImages from "../constants/images";
import ImageViewer from 'react-native-image-zoom-viewer';

const ImageSlider = ({ images, height, resizeMode = 'cover', newImages }) => {

  const { width } = Dimensions.get('window');

  const [active, setActive] = useState(0);

  const onScrollChange = ({ nativeEvent }) => {
    const slide = Math.ceil(
      nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
    );
    if (slide !== active) {
      setActive(slide);
    }
  };
  const [modalVisible, setModalVisible] = useState(false);
  const [indexImage, setIndexImage] = useState(0);


  const [imageSlider, setImageSlider] = useState([]);
  const [viewerImage, setViewerImage] = useState([]);
  const getImages = () => {
    console.log("newImages", newImages)
    if (newImages?.photos && newImages?.photos?.length) {
      const sliderData = newImages.photos.map((item, index) => {
        return {
          source: { uri: item.img },
          thumb: item.img,
          id: index,
        };
      })
      const updatedImagesArray = newImages.photos.map(image => {
        return {
          url: image.img ?? image // Replace 'img' with 'url'
        };
      });
      setViewerImage(updatedImagesArray)
      setImageSlider(sliderData)
    } else {
      if (!newImages?.sector?.photos || !newImages?.sector?.photos?.length) return []
      const sliderData = newImages.sector.photos.map((item, index) => {
        return {
          source: { uri: item.img },
          thumb: item.img,
          id: index,
        };
      })
      const updatedImagesArray = newImages.sector.photos.map(image => {
        return {
          url: image.img ?? image // Replace 'img' with 'url'
        };
      });
      setViewerImage(updatedImagesArray)
      setImageSlider(sliderData)
    }
  }

  useEffect(() => {
    getImages()
  }, [newImages])
  return (
    <>
      <Modal
        className={"relative"}
        visible={modalVisible}
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          onPress={() => setModalVisible(false)}
          className={`z-10 p-2 absolute top-5 ${I18nManager.isRTL ? 'right-5' : 'left-5'} items-center justify-center`}>
          <Image source={icons.rounded_close} resizeMode={"contain"} className={"w-10 h-10"} tintColor={"white"} />
        </Pressable>
        <ImageViewer index={indexImage} saveToLocalByLongPress={false} imageUrls={viewerImage} useNativeDriver={true} />
      </Modal>
      <View className={"relative flex-row-reverse mt-4"}>

        <ScrollView
          pagingEnabled
          horizontal
          onScroll={onScrollChange}
          showsHorizontalScrollIndicator={false}
          style={{ width, height }}>
          {imageSlider && imageSlider?.map((image, index) => (
            <Pressable key={index} onPress={() => {
              setModalVisible(true)
              setIndexImage(index)
            }}>
              <Image
                source={image.source}
                resizeMode={resizeMode}
                style={{ width, height }}
              />
            </Pressable>
          ))}
        </ScrollView>
        <View
          className={`absolute bottom-[10px] w-full gap-2 justify-center items-end ${I18nManager.isRTL ? 'flex-row-reverse' : 'flex-row-reverse'}`}>
          {imageSlider.length ? imageSlider?.map((i, k) => (
            <View key={k}
              className={`w-5 items-center justify-center h-5 border-4 border-toast-300 rounded-full ${k == active ? 'bg-white' : 'bg-toast-300'}`}>
              <Image source={icons.dots}
                tintColor={k == active ? '#a47764' : '#333333'}
                resizeMode={"contain"}
                className={"w-3 h-3 mx-1.5 shadow-lg"} />
            </View>
          )) : (
            <>
              <Image
                source={mainImages.no_photo}
                style={{ width, height, resizeMode: 'contain' }}
                className={"bg-bottom"}
              />
            </>
          )}
        </View>
      </View>
    </>

  );
}


export default ImageSlider;