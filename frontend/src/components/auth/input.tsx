"use client";

import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface AuthInputProps {
  label: string;
  name: string;
  type: string;
  placeholder?: string;
  required?: boolean;
}

export function AuthInput({
  label,
  name,
  type,
  placeholder,
  required = true,
}: AuthInputProps) {
  return (
    <label className="flex flex-col space-y-1 w-full">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <Input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className={cn(
          "bg-muted px-3 py-2 rounded-md border border-input",
          "focus-visible:ring-1 focus-visible:ring-primary"
        )}
      />
    </label>
  );
}
