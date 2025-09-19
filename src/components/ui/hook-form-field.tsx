import React from "react";
import { UseFormRegister, FieldPath, FieldValues, FieldError, Control, Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

type FieldType = "input" | "textarea" | "select" | "checkbox" | "radio";

interface BaseFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: FieldError;
  className?: string;
  description?: string;
  control?: Control<T>;
  register?: UseFormRegister<T>;
}

interface InputFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "input";
  inputType?: "text" | "email" | "password" | "number" | "tel" | "url";
}

interface TextareaFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "textarea";
  rows?: number;
}

interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "select";
  options: { value: string; label: string }[];
}

interface CheckboxFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "checkbox";
  checkboxLabel?: string;
}

interface RadioFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type: "radio";
  options: { value: string; label: string }[];
}

type HookFormFieldProps<T extends FieldValues> = 
  | InputFieldProps<T>
  | TextareaFieldProps<T>
  | SelectFieldProps<T>
  | CheckboxFieldProps<T>
  | RadioFieldProps<T>;

export function HookFormField<T extends FieldValues>(props: HookFormFieldProps<T>) {
  const {
    name,
    label,
    placeholder,
    disabled = false,
    required = false,
    error,
    className,
    description,
    control,
    register,
  } = props;

  const renderField = () => {
    switch (props.type) {
      case "input":
        if (register) {
          return (
            <Input
              id={name}
              type={props.inputType || "text"}
              placeholder={placeholder}
              disabled={disabled}
              {...register(name)}
              className={error ? "border-red-500" : ""}
            />
          );
        }
        return null;

      case "textarea":
        if (register) {
          return (
            <Textarea
              id={name}
              placeholder={placeholder}
              disabled={disabled}
              rows={props.rows || 3}
              {...register(name)}
              className={error ? "border-red-500" : ""}
            />
          );
        }
        return null;

      case "select":
        if (control) {
          return (
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className={error ? "border-red-500" : ""}>
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {props.options.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          );
        }
        return null;

      case "checkbox":
        if (control) {
          return (
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={name}
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={disabled}
                  />
                  <Label htmlFor={name} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                    {props.checkboxLabel || label}
                  </Label>
                </div>
              )}
            />
          );
        }
        return null;

      case "radio":
        if (control) {
          return (
            <Controller
              name={name}
              control={control}
              render={({ field }) => (
                <RadioGroup onValueChange={field.onChange} value={field.value}>
                  {props.options.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
                      <Label htmlFor={`${name}-${option.value}`}>{option.label}</Label>
                    </div>
                  ))}
                </RadioGroup>
              )}
            />
          );
        }
        return null;

      default:
        return null;
    }
  };

  return (
    <div className={cn("grid gap-3", className)}>
      {label && props.type !== "checkbox" && (
        <Label htmlFor={name}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      {renderField()}
      {error && (
        <p className="text-sm text-red-600">{error.message}</p>
      )}
      {description && !error && (
        <p className="text-xs text-muted-foreground">{description}</p>
      )}
    </div>
  );
}

// Convenience components for common use cases
export function HookFormInput<T extends FieldValues>(props: Omit<InputFieldProps<T>, "type">) {
  return <HookFormField {...props} type="input" />;
}

export function HookFormTextarea<T extends FieldValues>(props: Omit<TextareaFieldProps<T>, "type">) {
  return <HookFormField {...props} type="textarea" />;
}

export function HookFormSelect<T extends FieldValues>(props: Omit<SelectFieldProps<T>, "type">) {
  return <HookFormField {...props} type="select" />;
}

export function HookFormCheckbox<T extends FieldValues>(props: Omit<CheckboxFieldProps<T>, "type">) {
  return <HookFormField {...props} type="checkbox" />;
}

export function HookFormRadio<T extends FieldValues>(props: Omit<RadioFieldProps<T>, "type">) {
  return <HookFormField {...props} type="radio" />;
}
