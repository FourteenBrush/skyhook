import { useStyleSheet } from "@/hooks/useStyleSheet"
import { useTheme } from "@/hooks/useTheme"
import { BORDER_RADIUS_NORMAL, ThemeData } from "@/theme"
import { AntDesign } from "@expo/vector-icons"
import { Picker, PickerProps } from "@react-native-picker/picker"
import { ItemValue, PickerItemProps } from "@react-native-picker/picker/typings/Picker"
import { ReactNode, useState } from "react"
import { View, Text, StyleSheet, TextInput, Pressable, TextInputProps, ViewProps, TextStyle, Platform } from "react-native"
import { DatePickerModal, enGB, registerTranslation } from "react-native-paper-dates"

export type TextInputFieldProps = TextInputProps & InputFieldBaseProps

/** Text input field, accessible by default */
export function TextInputField({ label, error, style, ...props }: TextInputFieldProps) {
  const styles = useStyleSheet(getStyles)
  const { colors } = useTheme()

  const handleColor = "#949494"
  
  return (
    <InputFieldBase label={label} error={error} accessible accessibilityRole="text" accessibilityHint="text input field">
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor={colors.textSecondary}
        cursorColor={handleColor}
        selectionColor={handleColor}
        selectionHandleColor={handleColor}
        {...props} />
    </InputFieldBase>
  )
}

export type DateInputFieldProps = Omit<TextInputFieldProps, "onChangeText" | "onChange" | "value"> & {
  /** Leading component placed before the placeholder text */
  placeholderLeading?: ReactNode,
  value?: Date,
  minDate?: Date,
  maxDate?: Date,
  /** Called when a date is picked */
  onChange?: (date: Date) => void,
  /** Dialog title for native date picker */
  dialogTitle?: string,
}

registerTranslation("en-GB", enGB)

/** Date selection input field, similar to a HTML `<input type=date />`. Accessible by default */
export function DateInputField({ placeholderLeading, minDate, maxDate, value, onChange, dialogTitle, error, ...props }: DateInputFieldProps) {
  const styles = useStyleSheet(getStyles)
  const { colors } = useTheme()
  const [pickerShown, setPickerShown] = useState(false)

  const onConfirm = ({ date }: { date: Date | undefined }) => {
    onChange?.(date ?? minDate ?? new Date())
    setPickerShown(false)
  }
  
  const inputField = (
    // because for some bizarre reason, onPress and related callbacks are not called when
    // the input field is readonly or non editable (see https://github.com/facebook/react-native/issues/33649)
    <Pressable onPress={() => setPickerShown(true)}>
      {/* needs an non empty label to not show anything... */}
      <DatePickerModal
        label=" "
        saveLabel="Save"
        startWeekOnMonday
        mode="single"
        presentationStyle="pageSheet"
        visible={pickerShown}
        date={value ?? minDate ?? new Date()}
        validRange={{ startDate: minDate }}
        onConfirm={onConfirm}
        onDismiss={() => setPickerShown(false)}
        locale="en-GB"
      />
      
      <TextInput
        readOnly
        // e.g. Wednesday, 6 August 2025
        value={value?.toLocaleDateString(undefined, { dateStyle: "full" })}
        placeholderTextColor={colors.textSecondary}
        // having a leading placeholder implies already using this style
        style={[styles.dateInputContainer, placeholderLeading === undefined && styles.input]}
        {...props}
      />
    </Pressable>
  )
  
  let input = inputField
  if (placeholderLeading !== undefined) {
    // if a leading placeholder was specified, wrap it together with the input field in a flex:row container
    input = (
      <View style={styles.inputWithPlaceholderLeading}>
        <View style={styles.placeholderLeading}>{placeholderLeading}</View>
        {inputField}
      </View>
    )
  }
  
  return (
    <InputFieldBase
      error={error}
      accessible
      accessibilityRole="button"
      accessibilityLabel="date picker"
      accessibilityHint="click on this element to open a date picker"
      children={input}
      {...props}
    />
  )
}

export type DropdownProps<T> = PickerProps<T> & InputFieldBaseProps & {
  items: PickerItemProps<T>[],
}

export function Dropdown<T extends ItemValue>({ items, ...props }: DropdownProps<T>) {
  const styles = useStyleSheet(getStyles)
  const { colors } = useTheme()
  
  return (
    <InputFieldBase accessible accessibilityRole="menu" {...props}>
      {/*
        extra wrapping with a view because a Picker doesn't do anything with most styling properties,
        additionally, it doesn't seem to like any flex related properties
      */}
      <View style={styles.picker}>
        <Picker style={styles.dropdown} dropdownIconColor={colors.text} {...props}>
          {items.map((item, i) => <Picker.Item key={i} {...item} />)}
        </Picker>
      </View>
    </InputFieldBase>
  )
}

export type InputFieldBaseProps = ViewProps & {
  /** Label placed above the input field */
  label?: string,
  /** Error message shown beneath the input field */
  error?: string,
}

function InputFieldBase({ label, error, children, ...props }: InputFieldBaseProps) {
  const styles = useStyleSheet(getStyles)

  return (
    <View style={label !== undefined && styles.container} {...props}>
      {label !== undefined && <Text style={styles.label}>{label}</Text>}
      {children}
      {error && <ErrorLabel error={error} />}
    </View>
  )
}

export const ErrorLabel = ({ error }: { error: string }) => {
  const styles = useStyleSheet(getStyles)
  const { colors } = useTheme()

  return (
    <View style={styles.errorLabel}>
      <AntDesign name="close-circle" color="red" />
      <Text style={{ color: colors.errorRed }}>{error}</Text>
    </View>
  )
}

const getStyles = ({ fonts, colors }: ThemeData) => {
  const inputStyle = {
    marginVertical: 5,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BORDER_RADIUS_NORMAL,
    color: colors.text,
  } satisfies TextStyle
  
  return StyleSheet.create({
    container: {
      marginVertical: 6,
    },
    label: {
      ...fonts.titleSmall,
      fontWeight: 400,
    },
    picker: inputStyle,
    input: {
      ...inputStyle,
      // all broken on web for whatever reason, great job RN
      paddingVertical: Platform.select({ web: 8 }),
      paddingLeft: Platform.select({ web: 6 })
    },
    dateInputContainer: {
      paddingVertical: Platform.select({ web: 10 }),
      color: colors.text,
    },
    // we need a different class apart from input, because applying flexDirection:row to a <Picker> shifts ui
    inputWithPlaceholderLeading: {
      ...inputStyle,
      flexDirection: "row", // position leading placeholder and textinput next to eachother (if applicable)
    },
    placeholderLeading: {
      justifyContent: "center", // vertically center
      paddingHorizontal: 6, // spacing between placeholder (if any) and leading component
    },
    dropdown: {
      color: colors.text, // text color
      marginVertical: -4, // ensure dropdown has about the same height as other input fields
      paddingVertical: Platform.select({ web: 7 })
    },
    dropdownItem: {
      ...fonts.bodyMedium,
      // color: colors.textSecondary,
    },
    errorLabel: {
      flexDirection: "row",
      alignItems: "center",
      gap: 6,
    },
  })
}
