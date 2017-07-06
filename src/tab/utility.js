export function getCurrentPos(list, index){
    function isCurrentIndex(element){
      return element.props.index === index
    }
    return list.findIndex(isCurrentIndex)
}

