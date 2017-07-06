import React, {Component} from 'react'
import './style/index.css'

class TabItem extends Component {
  render() {
    const {children, active, onClick, title, index, setGlTab} = this.props
    let activeClass = active ? 'tab-item-active' : ''
    return (
      <div
        ref={ elm => {active ? setGlTab(elm) : ''}}
        className={`tab-item ${activeClass}`}
        onClick={() => {onClick(index)}}>
        {title}
      </div>
    )
  }
}

export default TabItem
