import * as React from 'react'
import { cn } from '../../utils/cn'

// Stub components - install 'vaul' package for full drawer functionality
function Drawer({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div {...props}>{children}</div>
}

function DrawerTrigger({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props}>{children}</button>
}

function DrawerPortal({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function DrawerClose({ children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props}>{children}</button>
}

function DrawerOverlay({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('fixed inset-0 z-50 bg-black/50', className)} {...props} />
}

function DrawerContent({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('bg-background fixed z-50 flex h-auto flex-col', className)} {...props}>
      {children}
    </div>
  )
}

function DrawerHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-0.5 p-4', className)} {...props} />
}

function DrawerFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('mt-auto flex flex-col gap-2 p-4', className)} {...props} />
}

function DrawerTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-foreground font-semibold', className)} {...props} />
}

function DrawerDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-muted-foreground text-sm', className)} {...props} />
}

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
}
