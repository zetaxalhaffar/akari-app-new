import React, { useCallback, useRef } from 'react';
import { Button, Text } from 'react-native';
import { BottomSheetBackdrop, BottomSheetModal, BottomSheetView } from '@gorhom/bottom-sheet';

const CustomBottomModalSheet = ({
  bottomSheetModalRef,
  snapPoints = ['50%'],
  handleSheetChanges,
  children,
  handleDismissModalPress,
  backdropBehave = 'none',
  enablePanDownToClose = false
}) => {
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
        enableDynamicSizing={false}
        index={0}
        stackBehavior="replace"
        backdropComponent={renderBackdrop}
        ref={bottomSheetModalRef}
        onChange={handleSheetChanges}>
        <BottomSheetView>
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
