import { UseFormRegisterReturn } from 'react-hook-form'
import ErrorText from '../forms/ErrorText'

type FormInputProps = {
  label: string
  name: string
  type?: string
  placeholder?: string
  register: UseFormRegisterReturn
  error?: string | undefined
  value?: string
}

const FormInput = ({
  label,
  name,
  type = 'text',
  placeholder,
  register,
  error,
  value,
}: FormInputProps) => {
  return (
    
      <li className="flex flex-col gap-1">
        <label htmlFor={name}>{label}</label>
        <div className="relative">
          <input
            {...register}
            type={type}
            id={name}
            name={name}
            value={value}
            placeholder={placeholder}
            className="w-full"
          />
          <ErrorText>{error}</ErrorText>
        </div>
      </li>
    
  )
}

export default FormInput

// const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
//   function FormInput({ label, id, type = 'text', placeholder }, ref) {
//     return (
//       <li className="flex flex-col gap-1">
//         <label htmlFor={id}>{label}</label>
//         <input
//           ref={ref}
//           type={type}
//           id={id}
//           name={id}
//           placeholder={placeholder}
//         />
//         {/* <ErrorText>{error}</ErrorText> */}
//       </li>
//     )
//   }
// )
