import React from "react";
import { UseFormRegister, FieldPath, FieldValues, FieldError } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps<T extends FieldValues> {
  name: FieldPath<T>;
  label: string;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  register: UseFormRegister<T>;
  error?: FieldError;
  className?: string;
  description?: string;
}

export function FormInput<T extends FieldValues>({
  name,
  label,
  type = "text",
  placeholder,
  disabled = false,
  required = false,
  register,
  error,
  className,
  description,
}: FormInputProps<T>) {
  return (
    <div className={cn("grid gap-3", className)}>
      <Label htmlFor={name}>
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </Label>
      <Input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        {...register(name)}
        className={error ? "border-red-500" : ""}
      />
      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}
