import * as React from 'react';
import { Text, TextInput, type TextInputProps } from 'react-native';
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
    return (
      <>
        {props.label && <Text className="mb-2 font-pmedium text-gray-700">{props.label}</Text>}
        {props.placeholder && showPlaceholder && (
          <Text className="mb-2 font-pmedium text-gray-700">{props.placeholder}</Text>
        )}
        <TextInput
          ref={ref}
          className={cn(
            'native:h-14 bg-background native:leading-[1.25] rounded-lg border px-3 font-pmedium placeholder:text-gray-400',
            isDisabled 
              ? 'border-gray-300 opacity-50 web:cursor-not-allowed' 
              : 'border-toast-500',
            className
          )}
          placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
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
