import * as React from 'react';
import { Text, TextInput, type TextInputProps, Platform, StyleSheet } from 'react-native';
import { cn } from '~/lib/utils';

interface CustomInputProps extends TextInputProps {
  disabled?: boolean;
  showPlaceholder?: boolean;
  label?: string;
  type?: 'numeric' | 'default';
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, CustomInputProps>(
  ({ className, placeholderClassName, showPlaceholder = true, disabled, ...props }, ref) => {
    const isDisabled = disabled || props.editable === false;
    const inputRef = React.useRef<TextInput | null>(null);

    const setRef = React.useCallback(
      (node: TextInput | null) => {
        if (node) {
          inputRef.current = node;

          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            const mutableRef = ref as React.MutableRefObject<TextInput | null>;
            mutableRef.current = node;
          }

          // Workaround for Android to apply font family to placeholder
          if (Platform.OS === 'android') {
            node.setNativeProps({
              style: StyleSheet.flatten([
                {
                  fontFamily: 'Cairo-Medium',
                  fontWeight: '500',
                },
                props.style ?? {},
              ]),
            });
          }
        }
      },
      [ref, props.style],
    );

    return (
      <>
        {props.label && <Text className="mb-2 font-pmedium text-gray-700">{props.label}</Text>}
        {props.placeholder && showPlaceholder && (
          <Text className="mb-2 font-pmedium text-gray-700">{props.placeholder}</Text>
        )}
        <TextInput
          ref={setRef}
          className={cn(
            'native:h-14 bg-background native:leading-[1.25] rounded-lg border px-3 font-pmedium placeholder:text-gray-400',
            isDisabled 
              ? 'border-gray-300 opacity-50 web:cursor-not-allowed' 
              : 'border-toast-500',
            className
          )}
          placeholderClassName={cn('text-muted-foreground font-pmedium', placeholderClassName)}
          style={[
            {
              fontFamily: 'Cairo-Medium',
              fontWeight: '500',
            },
            props.style,
          ]}
          {...props}
          placeholder={props.placeholder ? `يرجى إدخال ${props.placeholder}` : ''}
          keyboardType={props.type}
          editable={!isDisabled}
          numberOfLines={props.numberOfLines}
        />
      </>
    );
  }
);

Input.displayName = 'Input';

export { Input };
