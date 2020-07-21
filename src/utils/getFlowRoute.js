export default (obj, router) => {
  const func1 = (data) => {
    router.forEach((c) => {
      if(data.childNode) {
        if(`sid-${data.id}` === c.actNodeId) {
          data.state = true
        }
        func1(data.childNode)
      }else {
        if(`sid-${data.id}` === c.actNodeId) {
          data.state = true
        }
      }
      if(data.conditionNodes) {
        func2(data.conditionNodes)
      }
    })
  }
  const func2 = (conditionNodes) => {
    if(conditionNodes.length > 0) {
      conditionNodes.forEach((c) => {
        func1(c)
      })
    }
  }
  func1(obj.nodeConfig)

  return obj.nodeConfig
}