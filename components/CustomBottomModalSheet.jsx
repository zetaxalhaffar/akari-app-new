import React, { useCallback, useRef } from 'react';
import { Button, Text } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const CustomBottomModalSheet = ({
  bottomSheetModalRef,
  snapPoints = ['50%'],
  handleSheetChanges,
  children,
  handleDismissModalPress,
  backdropBehave = 'none',
  enablePanDownToClose = false,
  enableDynamicSizing = false
}) => {
  const insets = useSafeAreaInsets();
  
  // renders
  const renderBackdrop = useCallback(
    (props) => (
      <BottomSheetBackdrop
        pressBehavior={backdropBehave}
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={1}
      />
    ),
    []
  );

  return (
    <>
              <BottomSheetModal
        enablePanDownToClose={enablePanDownToClose}
        backgroundStyle={{ backgroundColor: '#FFF' }}
        snapPoints={snapPoints}
        enableDynamicSizing={enableDynamicSizing}
        index={0}
        stackBehavior="replace"
        backdropComponent={renderBackdrop}
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}>
        <BottomSheetView style={{ paddingBottom: Math.max(insets.bottom, 8) }}>
          {children &&
            React.cloneElement(children, {
              onClose: handleDismissModalPress,
            })}
        </BottomSheetView>
      </BottomSheetModal>
    </>
  );
};

export default CustomBottomModalSheet;
