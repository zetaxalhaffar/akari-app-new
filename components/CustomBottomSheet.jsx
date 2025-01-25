import React, { useCallback, useMemo, useRef } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback, Button } from 'react-native';
import { BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

const CustomBottomSheet = ({ trigger, children, snapPoints = ['25%', '50%', '70%'] }) => {
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
        })
      ) : (
        <Button onPress={handlePresentModalPress} title="Present Modal" color="black" />
      )}
      <BottomSheetModal
        backgroundStyle={{ backgroundColor: '#EEE' }}
        index={1}
        snapPoints={snapPoints}
        enableDynamicSizing={snapPoints.length}
        stackBehavior="push"
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}>
        <BottomSheetView>
          {React.cloneElement(children, {
            onClose: handleDismissModalPress,
          })}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default CustomBottomSheet;
