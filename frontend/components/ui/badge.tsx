import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { Slot } from "radix-ui"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-full border border-transparent px-[10px] py-[2px] text-[12px] leading-4 font-medium whitespace-nowrap transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 [&>svg]:pointer-events-none [&>svg]:size-3",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground [a&]:hover:bg-primary/90",
        active: "bg-[#DCFCE7] text-[#166534]",
        passed: "bg-[#DCFCE7] text-[#166534]",
        inactive: "bg-[#F1F5F9] text-[#64748B]",
        draft: "bg-[#F1F5F9] text-[#64748B]",
        pending: "bg-[#FEF3C7] text-[#B45309]",
        "in-progress": "bg-[#FEF3C7] text-[#B45309]",
        failed: "bg-[#FEE2E2] text-[#DC2626]",
        error: "bg-[#FEE2E2] text-[#DC2626]",
        destructive: "bg-[#FEE2E2] text-[#DC2626]",
        info: "bg-[#EFF6FF] text-[#1D4ED8]",
        outline: "border-border text-foreground [a&]:hover:bg-accent [a&]:hover:text-accent-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot.Root : "span"

  return (
    <Comp
      data-slot="badge"
      data-variant={variant}
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
