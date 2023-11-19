import React from 'react'

const RenderInfoItem = ({
    iconClass,
    link,
    text,
    linkText,
    anchorClassName,
    onClick,
  }) => {
  return (
    <div className="info-item">
        <a
        className={anchorClassName}
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        onClick={onClick ? (event) => onClick(link, event) : null}
        >
        <i className={iconClass}></i>
        <span className="link-text">&nbsp; {linkText || text}</span>
        </a>
    </div>
  )
}

export default RenderInfoItem
