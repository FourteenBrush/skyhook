import { useStyleSheet } from "@/hooks/useStyleSheet"
import { Pressable, StyleSheet, Text, View } from "react-native"
import { BORDER_RADIUS_NORMAL, ThemeData } from "@/theme"
import { ReactNode } from "react"
import { useTheme } from "@/hooks/useTheme"

export type SegmentOption<T> = {
  value: T,
  label: string,
  icon: ({ color }: { color: string }) => ReactNode,
}

export type SegmentedControlProps<T> = {
  options: SegmentOption<T>[],
  selected: T,
  onChange: (value: T) => void,
}

/**
 * A horizontal selection element, which let's you select one of its options.
 */
export default function SegmentedControl<T>({ options, selected, onChange }: SegmentedControlProps<T>) {
  const styles = useStyleSheet(getStyles)
  const { colors } = useTheme()

  return (
    <View style={styles.container}>
      {options.map(({ value, label, icon }, idx) => {
        const isSelected = selected === value
        const iconColor = isSelected ? colors.text : colors.textSecondary

        return (
          <Pressable
            key={idx}
            style={[styles.option, isSelected && styles.pressedOption]}
            onPress={() => onChange(value)}
          >
            {icon({ color: iconColor })}
            <Text style={[styles.optionText, isSelected && styles.selectedText]}>{label}</Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const getStyles = ({ colors }: ThemeData) => StyleSheet.create({
  container: {
    backgroundColor: colors.cardAlternative,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: BORDER_RADIUS_NORMAL,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 4,
    padding: 4,
  },
  option: {
    flexDirection: "row",
    gap: 7,
    alignItems: "center",
    flex: 1,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: BORDER_RADIUS_NORMAL,
  },
  pressedOption: {
    backgroundColor: colors.background,
  },
  optionText: {
    color: colors.textSecondary,
  },
  selectedText: {
    fontWeight: "bold",
    color: colors.text,
  },
})
