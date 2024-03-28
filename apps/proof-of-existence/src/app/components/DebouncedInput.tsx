import { FC, useState, useEffect, type InputHTMLAttributes } from "react"

type DebouncedInputProps = {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>


export const DebouncedInput: FC<DebouncedInputProps> = ({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}) => {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input autoComplete="nope" {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}

export default DebouncedInput;