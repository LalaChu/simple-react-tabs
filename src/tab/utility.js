import React from 'react'

export function getCurrentPos(list, index) {
  function isCurrentIndex(element) {
    return element.props.index === index;
  }
  return list.findIndex(isCurrentIndex);
}

export function getPageBar(changePageFunc, disable, type) {
  const disableClass = disable ? 'tab-scroll-disable' : '';
  return (
    <span className={`tab-scroll tab-${type} ${disableClass}`}>
      <span
        className="tab-scroll-content"
        onClick={changePageFunc}
      />
    </span>
  );
}
