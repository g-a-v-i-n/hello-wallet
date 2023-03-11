type ContentEditableProps = {
  as: 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p'
  className?: string
  iconClassName?: string
  initialValue?: string
}

export const ContentEditable = (props: ContentEditableProps) => {
  const Component = props.as

  const internalProps = {
    contentEditable: true,
    role:"textbox",
    autoComplete: 'off',
    autoCorrect: 'off',
    autoCapitalize: 'off',
    className: props.className,
    suppressContentEditableWarning: true,
    // Removes rich text styles from clipboard text
    onPaste: (e: React.ClipboardEvent) => {
      // Cancel paste
      e.preventDefault()
      // Get text representation of clipboard
      const text = e.clipboardData?.getData('text/plain')
      // Insert text manually.
      document.execCommand('insertHTML', false, text)
    },

  }

  return (
    <div className={props.className}>
      <Component {...internalProps}>{props.initialValue}</Component>
    </div>
  )
}

ContentEditable.defaultProps = {
  as: 'div',
  className: '',
  iconClassName: '',
  initialValue: '',
}
