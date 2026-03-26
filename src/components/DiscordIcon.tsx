"use client"

import { type JSX } from "react"

interface DiscordIconProps {
  size?: number
  strokeWidth?: number
  className?: string
}

export function DiscordIcon({
  size = 24,
  strokeWidth = 2,
  className,
}: DiscordIconProps): JSX.Element {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="square"
      strokeLinejoin="miter"
      aria-hidden="true"
      className={className}
    >
      <path d="M18 6h-2c-1.1 0-2 .9-2 2s.9 2 2 2h2c1.1 0 2-.9 2-2s-.9-2-2-2zm-12 0H4c-1.1 0-2 .9-2 2s.9 2 2 2h2c1.1 0 2-.9 2-2s-.9-2-2-2z" />
      <path d="M9 12c-2.2 0-4 1.8-4 4v4h14v-4c0-2.2-1.8-4-4-4H9z" />
    </svg>
  )
}
