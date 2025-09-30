import type React from "react"

// This file is not used in Create React App - layout is handled in App.js
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
