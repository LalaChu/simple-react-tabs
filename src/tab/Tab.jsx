import React, { Component, cloneElement } from 'react';
import { getCurrentPos, getPageBar } from './utility';
import './style/index.css';

class Tab extends Component {
  constructor(props) {
    super(props);
    const { activeIndex, children, type, position } = this.props;
    const settedIndex = children[0].props.index;
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
        top: 0,
      },
    };
    this.onTabItemClick = this.onTabItemClick.bind(this);
    this.onKeyDownTab = this.onKeyDownTab.bind(this);
    this.onNextClick = this.onNextClick.bind(this);
    this.onPrevClick = this.onPrevClick.bind(this);
    this.setGlActTab = this.setGlActTab.bind(this);
  }

  componentDidMount() {
    const { reallLen, showLen } = this.getLenObjByPos(this.state.position);
    if (reallLen > showLen) {
      this.onScrollNeed()
    }
  }

  componentDidUpdate() {
    const { activeTab, tabHead, state: { transLen } } = this;
    const { transform, top } = this.state.inkBarStyle;
    const box = activeTab.getBoundingClientRect();
    const parentbox = tabHead.getBoundingClientRect();
    const showWidth = tabHead.parentNode.clientWidth;
    const leftRect = tabHead.parentNode.getBoundingClientRect().left;
    const rNeedMove = showWidth - (box.right - leftRect);
    const lNeedMove = box.left - leftRect;
    let needMove = 0;
    if (rNeedMove < 0) {
      needMove = rNeedMove;
    } else if (lNeedMove < 0) {
      needMove = Math.abs(lNeedMove);
    }
    const leftPos = box.left - parentbox.left;
    const transChange = rNeedMove > 0 && lNeedMove > 0;
    const transStr = `translate3d(${leftPos}px, 0px, 0px)`;
    const newStyle = {
      transform: transStr,
      top: box.height - 2,
      width: box.width,
    };
    const newTransLen = transChange ? transLen : transLen + needMove;
    const absoluteLen = Math.abs(newTransLen);
    const rightDisable = absoluteLen >= tabHead.clientWidth - showWidth;
    if (transStr !== transform || box.height - 2 !== top) {
      this.onTabChanged({newStyle, newTransLen, rightDisable})
    }
  }

  onScrollNeed(){
    this.setState({ needScroll: true });
  }

  onTabChanged(stateObj){
    const { newStyle, newTransLen, leftDisable, rightDisable } = stateObj;
    this.setState({
        inkBarStyle: newStyle,
        transLen: newTransLen,
        leftDisable: newTransLen >= 0,
        rightDisable,
      });
  }

  onTabItemClick(index) {
    this.setState({ activeIndex: index });
  }

  onKeyDownTab(e) {
    if (e.keyCode === 39 || e.keyCode === 40) {
      this.getNextTab();
    } else if (e.keyCode === 37 || e.keyCode === 38) {
      this.getPrevTab();
    }
  }

  onNextClick() {
    const reallLen = this.tabHead.clientWidth;
    const showLen = this.tabHead.parentNode.clientWidth;
    let { rightDisable, leftDisable } = this.state;
    const { transLen } = this.state;
    let newtransLen = 0;
    if ((reallLen + transLen) / showLen >= 2) {
      newtransLen = Math.abs(transLen) + showLen;
    } else {
      newtransLen = reallLen - showLen;
      rightDisable = true;
      leftDisable = false;
    }
    this.setState({
      transLen: -newtransLen,
      rightDisable,
      leftDisable,
    });
  }

  onPrevClick() {
    const showLen = this.tabHead.parentNode.clientWidth;
    let { rightDisable, leftDisable } = this.state;
    const { transLen } = this.state;
    let newtransLen = 0;
    if (Math.abs(transLen / showLen) > 1) {
      newtransLen = Math.abs(transLen + showLen);
    } else {
      newtransLen = 0;
      leftDisable = true;
      rightDisable = false;
    }
    this.setState({
      transLen: -newtransLen,
      leftDisable,
      rightDisable,
    });
  }

  setGlActTab(elm) {
    this.activeTab = elm;
  }

  getLenObjByPos(pos) {
    const tabHead = this.tabHead;
    if (pos === 'top' || pos === 'bottom') {
      return {
        reallLen: tabHead.clientWidth,
        showLen: tabHead.parentNode.clientWidth,
      };
    } else {
      return {
        reallLen: tabHead.clientHeight,
        showLen: tabHead.parentNode.clientHeight,
      };
    }
  }

  getNextTab() {
    const { props: { children }, state: { activeIndex } } = this;
    const curActivePos = getCurrentPos(children, activeIndex);
    let newActivePos = curActivePos;
    newActivePos = newActivePos === children.length - 1 ? 0 : curActivePos + 1;
    this.setState({ activeIndex: children[newActivePos].props.index });
  }

  getPrevTab() {
    const { props: { children }, state: { activeIndex } } = this;
    const curActivePos = getCurrentPos(children, activeIndex);
    let newActivePos = curActivePos;
    newActivePos = newActivePos === 0 ? children.length - 1 : curActivePos - 1;
    this.setState({ activeIndex: children[newActivePos].props.index });
  }

  render() {
    const { children } = this.props;
    const { activeIndex, type, position, needScroll, transLen } = this.state;
    const { leftDisable, rightDisable, inkBarStyle } = this.state;
    const { onTabItemClick, onKeyDownTab, onNextClick, onPrevClick, setGlActTab } = this;
    const tabList = [];
    const tabPanelList = [];
    const tabContainer = [];
    let onPrevClickBtn = '';
    let onNextClickBtn = '';
    children.map((e) => {
      let selected;
      let panelClassStr = 'tab-panel';
      if (e.props.index === activeIndex) {
        panelClassStr += ' tab-panel-active';
        selected = true;
      } else {
        selected = false;
      }
      const panel = (
        <div className={panelClassStr} key={`${e.props.index}-panel`}>
          {e.props.children}
        </div>
      );
      const temp = cloneElement(e, {
        active: selected,
        onClick: onTabItemClick,
        setGlTab: setGlActTab,
      });
      tabList.push(temp);
      tabPanelList.push(panel);
      return true;
    });
    if (needScroll) {
      onPrevClickBtn = getPageBar(onPrevClick, leftDisable, 'prev');
      onNextClickBtn = getPageBar(onNextClick, rightDisable, 'next');
    }
    const panelMargin = -getCurrentPos(children, activeIndex) * 100;
    tabContainer.push(
      <div
        className="tab-head"
        key="head"
        onKeyDown={e => onKeyDownTab(e)}
      >
        {onPrevClickBtn}
        {onNextClickBtn}
        <div className="tab-wrap">
          <div
            className="tab-items"
            style={{ transform: `translate3d(${transLen}px, 0px, 0px)` }}
            ref={elm => (this.tabHead = elm)}
          >
            <div className="ink-bar" style={inkBarStyle} />
            {tabList}
          </div>
        </div>
      </div>
    );
    tabContainer.push(
      <div
        className="tab-panels"
        key="foot"
        style={{ marginLeft: `${panelMargin}%` }}
      >
        {tabPanelList}
      </div>
    );

    return (
      <div className={`tab tab-${type} tab-${position}`}>
        {
          position === 'bottom' ? tabContainer.reverse() : tabContainer
        }
      </div>
    );
  }
}

export default Tab;
