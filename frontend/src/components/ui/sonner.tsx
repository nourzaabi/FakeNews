import * as React from 'react'

// Stub component - install 'sonner' and 'next-themes' packages for full functionality
interface ToasterProps {
  children?: React.ReactNode
}

const Toaster = ({ ...props }: ToasterProps) => {
  return <div {...props} />
}

export { Toaster }
