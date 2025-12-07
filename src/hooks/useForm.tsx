import { useState } from "react"
import z from "zod"

export const useForm = <
  Schema extends z.ZodObject,
  Defaults extends Partial<z.infer<Schema>> = Partial<z.infer<Schema>>,
>(
  schema: Schema,
  defaults: Defaults,
) => {
  type FormInputs = z.infer<Schema>
  type ErrorMap = Partial<Record<keyof FormInputs, string>>

  const  [formState, setFormState] = useState<FormInputs>({
    ...defaults,
  } as FormInputs)
  const [errors, setErrors] = useState<ErrorMap>({})

  const updateField = <K extends keyof FormInputs>(key: K, value: FormInputs[K]) => {
    setFormState(prev => ({ ...prev, [key]: value }))
    // clear existing error
    if (errors[key] !== undefined) {
      setErrors(prev => {
        const newErrors = { ...prev }
        // to fix typescript type narrowing issue
        delete newErrors[key]
        return newErrors
      })
    }
  }

  const validateAndSubmit = (onValid: (data: FormInputs) => void) => {
    const { error, data } = schema.safeParse(formState)

    if (error !== undefined) {
      const { fieldErrors } = z.flattenError(error)
      const errors: ErrorMap = {}

      Object.entries(fieldErrors).forEach(([key, messages]) => {
        if (messages?.length) {
          errors[key as keyof FormInputs] = messages[0]
        }
      })
      setErrors(errors)
      return
    }

    onValid(data)
  }

  return {
    formState,
    errors,
    updateField,
    validateAndSubmit,
  }
}
