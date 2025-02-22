import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Button } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

const CustomBottomSheet = ({ trigger, children, snapPoints = ['25%', '50%', '70%'] }) => {
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        pressBehavior={'none'}
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
      />
    ),
    []
  );

  // ref
  const bottomSheetModalRef = useRef(null);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleDismissModalPress = useCallback(() => {
    bottomSheetModalRef.current?.dismiss();
  }, []);

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
    if (index === -1) {
      handleDismissModalPress();
    }
  }, []);

  // renders
  return (
    <>
      {trigger ? (
        React.cloneElement(trigger, {
          handleButtonPress: handlePresentModalPress,
          onClose: handleDismissModalPress,
          onPress: handlePresentModalPress,
          handleItemPress: handlePresentModalPress,
        })
      ) : (
        <View></View>
      )}
      <BottomSheetModal
        backgroundStyle={{ backgroundColor: '#EEE' }}
        index={1}
        snapPoints={snapPoints}
        enableDynamicSizing={snapPoints.length}
        stackBehavior="push"
        ref={bottomSheetModalRef}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}>
        <BottomSheetView>
          {React.cloneElement(children, {
            onClose: handleDismissModalPress,
            bottomSheetModalRef,
          })}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default CustomBottomSheet;
