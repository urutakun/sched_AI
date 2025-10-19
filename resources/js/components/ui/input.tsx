import React, { useState } from "react"
import { Eye, EyeClosed } from "lucide-react";

import { cn } from "@/lib/utils"

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

    const handleShowPassword = (): void => {
      setIsPasswordVisible((prev) => !prev);
    }

    return (
      <div className="relative">
        <input
          type={type === 'password' && isPasswordVisible ? 'text' : type}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-base shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-custom-secondary disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
            className
          )}
          ref={ref}
          {...props}
        />

        {type === 'password' && (
          <button
            type="button"
            onClick={handleShowPassword}
            className="absolute top-1/2 -translate-y-1/2 right-4 text-black"
          >
            {isPasswordVisible ? (
              <Eye className="w-[20px] text-custom-accent" />
            ) : (
              <EyeClosed className="w-[20px] text-custom-accent" />
            )}
          </button>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input }
