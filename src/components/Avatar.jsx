import React from 'react'

const Avatar = ({children, backgroundColor, py, px, color, border, borderRadius, fontSize, cursor}) => {
    const style={
        backgroundColor,
        padding: `${py} ${px}`,
        color: color || 'black',
        border: border,
        borderRadius,
        fontSize,
        textAlign: "center",
        cursor:cursor || null,
        textDecoration: "none"
    }
  return (
    <div style={style}>
        {children}
    </div>
  )
}

export default Avatar