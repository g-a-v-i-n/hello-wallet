import React from 'react'
import styles from './styles.module.scss'

type CalloutProps = {
  children: React.ReactNode
  side?: 'top' | 'bottom'
  className?: string
} & React.HTMLAttributes<HTMLDivElement>

export const Callout = ({
  children,
  className = '',
  side = 'bottom',
  ...props
}: CalloutProps) => {
  return (
    <div
      className={`${styles.container} ${className}`}
      {...props}
      data-side={side}
    >
      {children}
    </div>
  )
}

type CalloutButtonProps = {
  children: React.ReactNode
  className?: string
} & React.ButtonHTMLAttributes<HTMLButtonElement>

export const CalloutButton = ({
  children,
  className = '',
  ...props
}: CalloutButtonProps) => {
  return (
    <button className={`${styles.button} ${className}`} {...props}>
      {children}
    </button>
  )
}

export const CalloutRule = () => {
  return <div className={styles.rule} />
}
