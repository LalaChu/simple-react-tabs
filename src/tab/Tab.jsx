import React, {Component , cloneElement} from 'react'
import {findDOMNode} from 'react-dom'
import TabPanel from './TabPanel'
import {getCurrentPos} from './utility'
import './style/index.css'

class Tab extends Component {
  constructor(props) {
    super(props);
    const {activeIndex, children, type, position} = this.props
    let settedIndex = children[0].props.index
    this.state = {
      activeIndex: activeIndex === undefined ? settedIndex : activeIndex,
      type: type === undefined ? 'line' : type,
      position: position === undefined ? 'top' : position,
      needScroll: false,
      transLen: 0,
      rightDisable: false,
      leftDisable: true,
      inkBarStyle: {
        transform: 'translate3d(0px, 0px, 0px)',
        top: 0
      }
    };
  }
  componentDidMount(){
    const {tabHead} = this
    const {reallLen, showLen} = this.getLenObjByPos(this.state.position)
    if(reallLen > showLen){
      this.setState({needScroll: true})
    }
  }
  componentDidUpdate(){
    const {children} = this.props
    const {activeTab, tabHead, state:{transLen}} = this
    const {transform, top} = this.state.inkBarStyle
    const box = activeTab.getBoundingClientRect()
    const parentbox = tabHead.getBoundingClientRect()
    const showWidth = tabHead.parentNode.clientWidth
    const leftRect = tabHead.parentNode.getBoundingClientRect().left
    const rNeedMove = showWidth - ( box.right - leftRect )
    const lNeedMove = box.left - leftRect
    let needMove = 0
    if(rNeedMove < 0){
      needMove = rNeedMove
    }else if(lNeedMove < 0){
      needMove = Math.abs(lNeedMove)
    }
    let leftPos = box.left - parentbox.left
    let transChange = rNeedMove > 0 && lNeedMove > 0
    let transStr = `translate3d(${leftPos}px, 0px, 0px)`
    let newStyle = {
      transform: transStr,
      top: box.height - 2,
      width: box.width
    }
    let newTransLen = transChange ? transLen : transLen + needMove
    let rightDisable = Math.abs(newTransLen) >= tabHead.clientWidth - showWidth
    if(transStr !== transform || box.height - 2 !== top){
      this.setState({
        inkBarStyle: newStyle,
        transLen: newTransLen,
        leftDisable: newTransLen >= 0,
        rightDisable: rightDisable
      })
    }
  }

  changeTab = (index) => {
    this.setState({activeIndex: index})
  }
  focusTab = (e) => {
    if(e.keyCode === 39 || e.keyCode === 40){
      this.nextTab()
    }else if(e.keyCode === 37 || e.keyCode === 38){
      this.prevTab()
    }
  }
  nextTab = () => {
    const {props: {children}, state: {activeIndex}} = this
    let curActivePos = getCurrentPos(children, activeIndex)
    let newActivePos = curActivePos;
    newActivePos = newActivePos === children.length - 1 ? 0 : curActivePos + 1
    this.setState({activeIndex: children[newActivePos].props.index})
  }
  prevTab = () => {
    const {props: {children}, state: {activeIndex}} = this
    let curActivePos = getCurrentPos(children, activeIndex)
    let newActivePos = curActivePos
    newActivePos = newActivePos === 0 ? children.length - 1 : curActivePos - 1
    this.setState({activeIndex: children[newActivePos].props.index})
  }
  nextPage = () => {
    const reallLen = this.tabHead.clientWidth
    const showLen = this.tabHead.parentNode.clientWidth
    let {transLen, rightDisable, leftDisable} = this.state
    let newtransLen = 0
    if((reallLen + transLen) / showLen >= 2){
      newtransLen = Math.abs(transLen) + showLen
    }else{
      newtransLen = reallLen - showLen
      rightDisable = true,
      leftDisable = false
    }
    this.setState({
      transLen: -newtransLen,
      rightDisable: rightDisable,
      leftDisable: leftDisable
    })
  }
  prevPage = () => {
    const reallLen = this.tabHead.clientWidth
    const showLen = this.tabHead.parentNode.clientWidth
    let {transLen, rightDisable, leftDisable} = this.state
    let newtransLen = 0
    if(Math.abs( transLen / showLen ) > 1){
      newtransLen = Math.abs(transLen + showLen)
    }else{
      newtransLen = 0
      leftDisable = true
      rightDisable = false
    }
    this.setState({
      transLen: -newtransLen,
      leftDisable: leftDisable,
      rightDisable: rightDisable
    })
  }
  getPageBar = (changePageFunc, disable, type) => {
    let disableClass = disable ? 'tab-scroll-disable' : ''
    return (
      <span className={`tab-scroll tab-${type} ${disableClass}`}>
        <span
          className="tab-scroll-content"
          onClick={changePageFunc} />
      </span>
    )
  }
  setGlActTab = (elm) => {
    this.activeTab = elm
  }
  getLenObjByPos(pos){
    const tabHead = this.tabHead
    if(pos === 'top' || pos === 'bottom'){
      return {
        reallLen : tabHead.clientWidth,
        showLen : tabHead.parentNode.clientWidth
      }
    }else{
      return {
        reallLen : tabHead.clientHeight,
        showLen : tabHead.parentNode.clientHeight
      }
    }
  }

  render() {
    const {children} = this.props
    const {activeIndex, type, position, needScroll, transLen} = this.state
    const {leftDisable, rightDisable, inkBarStyle} = this.state
    const {changeTab, focusTab, nextPage, prevPage, setGlActTab} = this
    let tabList = [], tabPanelList = [], tabContainer = []
    let prevPageBtn = '', nextPageBtn = '', inkLen = 0, global = this
    children.map(function(e){
      let selected, refFunc, panelClassStr = 'tab-panel'
      if(e.props.index === activeIndex){
        panelClassStr += ' tab-panel-active'
        selected = true
      }else{
        selected = false
      }
      let panel = (
        <div className={panelClassStr} key={`${e.props.index}-panel`}>
          {e.props.children}
        </div>
      )
      let temp = cloneElement(e, {
        active: selected,
        onClick: changeTab,
        setGlTab: setGlActTab
      })
      tabList.push(temp)
      tabPanelList.push(panel)
    })
    if(needScroll){
      prevPageBtn = this.getPageBar(prevPage, leftDisable, 'prev')
      nextPageBtn = this.getPageBar(nextPage, rightDisable, 'next')
    }
    let panelMargin = - getCurrentPos(children, activeIndex) * 100
    tabContainer.push(
      <div className="tab-head"
        key="head"
        tabIndex="0"
        onKeyDown={ e => {focusTab(e)} }
      >
        {prevPageBtn}
        {nextPageBtn}
        <div className="tab-wrap">
          <div
          className="tab-items"
          style={{transform: `translate3d(${transLen}px, 0px, 0px)`}}
          ref={ elm => this.tabHead = elm }
          >
          <div className="ink-bar" style={inkBarStyle} />
          {tabList}
          </div>
        </div>
      </div>
    )
    tabContainer.push(
      <div
        className="tab-panels"
        key="foot"
        style={{marginLeft: `${panelMargin}%`}}
      >
        {tabPanelList}
      </div>
    )

    return (
      <div className={`tab tab-${type} tab-${position}`}>
        {
          position === 'bottom' ? tabContainer.reverse() : tabContainer
        }
      </div>
    )
  }
}

export default Tab
