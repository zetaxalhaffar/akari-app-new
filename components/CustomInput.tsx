import * as React from 'react';
import { Text, TextInput, type TextInputProps } from 'react-native';
import { cn } from '~/lib/utils';

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, TextInputProps>(
  ({ className, placeholderClassName, showPlaceholder = true, ...props }, ref) => {
    return (
      <>
        {props.label && <Text className="mb-2 font-pmedium text-gray-700">{props.label}</Text>}
        {props.placeholder && showPlaceholder && (
          <Text className="mb-2 font-pmedium text-gray-700">{props.placeholder}</Text>
        )}
        <TextInput
          ref={ref}
          className={cn(
            'native:h-14 bg-background native:leading-[1.25] rounded-lg border border-toast-500 px-3 font-pmedium placeholder:text-gray-400',
            props.editable === false && 'opacity-50 web:cursor-not-allowed',
            className
          )}
          placeholderClassName={cn('text-muted-foreground', placeholderClassName)}
          {...props}
          placeholder={`يرجى إدخال ${props.placeholder}`}
          keyboardType={props.type}
          readOnly={props.editable}
          editable={props.editable}
          numberOfLines={props.numberOfLines}
        />
      </>
    );
  }
);

Input.displayName = 'Input';

export { Input };
