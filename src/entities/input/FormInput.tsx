import React from "react";
import {
  Path,
  UseFormRegister,
  RegisterOptions,
  FieldValues,
} from "react-hook-form";

interface InputProps<T extends FieldValues> {
  register: UseFormRegister<T>;
  name: Path<T>;
  rules?: RegisterOptions<T>;
  type?: string;
  id?: string;
  placeholder?: string;
}

export const FormInput = <T extends FieldValues>({
  register,
  name,
  rules,
  type,
  placeholder,
}: InputProps<T>) => (
  <input
    {...register(name, rules)}
    type={type}
    placeholder={placeholder}
    className="mb-4 h-10 w-full rounded-lg border border-gray-300 p-2 text-base"
  />
);

export const FormSubmitButton = () => (
  <button
    type="submit"
    className="flex h-10 w-full items-center justify-center rounded-lg bg-blue-500 text-sm font-semibold text-white hover:bg-blue-700"
  >
    확인
  </button>
);

export const SignInInput = <T extends FieldValues>({
  register,
  name,
  rules,
  ...rest
}: InputProps<T>) => (
  <input
    {...register(name, rules)}
    {...rest}
    id="specificInput"
    className="mt-1 h-10 w-80 rounded-xl border-2 border-focus bg-black text-center text-sm text-white opacity-60 placeholder:text-center placeholder:text-sm"
  />
);

export const SignInSubmitButton = () => (
  <button
    type="submit"
    className="text-mb mt-3 flex h-10 w-80 flex-row items-center justify-center rounded-xl border-2 border-focus bg-zinc-800 text-center text-focus"
  >
    로그인
    <span className="icon-[iconamoon--arrow-right-2-fill] text-3xl"></span>
  </button>
);
