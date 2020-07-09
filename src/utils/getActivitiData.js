// const uuid = require('uuid');
// const { v4 } = uuid;
import { v4 } from 'uuid';

const findLastChild = (obj) => {
  let data = {}
  const { childNode, ...rest } = obj
  if(childNode){
    const res = findLastChild(childNode)
    data = res
  }else {
    // console.log('到底了!', obj)
    data = obj
  }
  return data
}

// const res = findLastChild(target.nodeConfig)
// console.log(res)

// 找childNode中的关联关系
const func1 = (obj, outputArr, lastObj, i, target, temp) => {
  const { childNode, id, conditionNodes, ..._rest } = obj;
  const { nodeName, ...rest } = _rest
  rest.name = nodeName
  let node = {},
  line = {},
  thisID = '',
  lineID = '',
  nextID = '';

  thisID = v4()
  nextID = v4()
  lineID = v4()
  if(obj.type ==4) {
    temp = obj.childNode?`sid-${obj.childNode.id}`:'sid-end'
    lineID = conditionNodes.reduce((r, c) => {
      return [
        ...r,
        {resourceId: `sid-${c.id}`}
      ]
    }, [])
    node = {
      resourceId: `sid-${id}`,
      properties: {
        ...rest, 
      },
      stencil: {
        id: 'ExclusiveGateway'
      },
      outgoing: lineID,
      childShapes: [],
      bounds: {
        lowerRight: {
          x: 100.3125,
          y: 175
        },
        upperLeft: {
          x: 60.90625,
          y: 175
        }
      },
      dockers: [
        {
          x: 15,
          y: 15
        },
        {
          x: 50,
          y: 40
        }
      ],
    } 
    outputArr.push(node)
  }else {

    if(obj.type == 3) {
      const { conditionsequenceflow } = obj
      node = {
        resourceId: `sid-${id}`,
        properties: {
          ...rest, 
          conditionsequenceflow
        },
        stencil: {
          id: 'SequenceFlow'
        },
        childShapes: [],
        outgoing: [
          {
            resourceId: obj.childNode?`sid-${obj.childNode.id}`:!lastObj.childNode?'sid-end':`sid-${lastObj.childNode.id}`
          }
        ],
        target: {
          resourceId: obj.childNode?`sid-${obj.childNode.id}`:!lastObj.childNode?'sid-end':`sid-${lastObj.childNode.id}`
        },
        bounds: {
          lowerRight: {
            x: 100.3125,
            y: 175
          },
          upperLeft: {
            x: 60.90625,
            y: 175
          }
        },
        dockers: [{
          x: 15,
          y: 15
        }, {
          x: 50,
          y: 40
        }],
        
      }
      outputArr.push(node)
    }else {
      let multiinstance_type, multiinstance_condition;
      if(obj.examineMode == 1) {
        multiinstance_type = 'Sequential'
        multiinstance_condition = "${nrOfCompletedInstances/nrOfInstances >= 1}"
      }else if(obj.examineMode == 2) {
        multiinstance_type = 'Parallel'
        multiinstance_condition = "${nrOfCompletedInstances/nrOfInstances >= 1}"
      }else if(obj.examineMode == 3){
        multiinstance_type = 'None'
        multiinstance_condition = ""
      }
      node = {
        resourceId: `sid-${id}`,
        properties: {
          ...rest,
          multiinstance_variable: `user${i}`,
          multiinstance_collection: `user${i}List`,
          multiinstance_type ,
          multiinstance_condition,
          usertaskassignment: {
            assignment: {
              candidateUsers: [{
                value: `#{user${i}}`,
                "$$hashKey": "2MQ"
              }]
            }
          },
        },
        bounds: {
          lowerRight: {
            x: 100.3125,
            y: 175
          },
          upperLeft: {
            x: 60.90625,
            y: 175
          }
        },
        stencil: {
          id: 'UserTask'
        },
        outgoing: [
          {
            resourceId: `sid-${lineID}`
          }
        ]
      }
      let lastLine = ''
      // if(!obj.childNode) {

      // }
      
      if(!obj.childNode && obj.isBranch) {
        lastLine = temp
      }else {
        lastLine = 'sid-end'
      }
      line = {
        resourceId: `sid-${lineID}`,
        stencil: {
          id: 'SequenceFlow'
        },
        properties: {
          overrideid: "",
          name: "",
          type: 3,
          documentation: "",
          conditionsequenceflow: "",
          executionlisteners: "",
          defaultflow: "false"
        },
        childShapes: [],
        bounds: {
          lowerRight: {
            x: 100.3125,
            y: 175
          },
          upperLeft: {
            x: 60.90625,
            y: 175
          }
        },
        dockers: [{
          x: 15,
          y: 15
        }, {
          x: 50,
          y: 40
        }],
        outgoing: [
          {
            resourceId: obj.childNode?`sid-${obj.childNode.id}`:obj.type == 3?`sid-${lastObj.childNode.id}`:lastLine
          }
        ],
        target: { resourceId: obj.childNode?`sid-${obj.childNode.id}`:obj.type == 3?`sid-${lastObj.childNode.id}`:lastLine }
      }
      outputArr.push(node, line)
    }
  }
  if(childNode) {
    i++
    func1(childNode, outputArr, obj, i, target, temp)
  }
  if(conditionNodes) {
    i++
    func2(conditionNodes, outputArr, obj, i, target, temp)
  }
  return outputArr
}


// 找conditionNodes中的关联关系
const func2 = (conditionNodes, outputArr, obj, i, target, temp) => {
  if(conditionNodes.length > 0) {
    conditionNodes.forEach((c) => {
      // func2(c, outputArr)
      // console.log(c)
      i++
      func1(c, outputArr, obj, i, target, temp)
    })
  }
  return outputArr
}

export default (target) => {
  const lastChild = findLastChild(target.nodeConfig)
  const res = func1(target.nodeConfig, [], {}, 0, target, '').reduce((r, c) => {
    if(c.resourceId == 'sid-start-node') {
      c.stencil.id = 'StartNoneEvent'
      c.properties.usertaskassignment = {}
    }
    return [
      ...r,
      c
    ]
  }, [])
  res.push({
    resourceId: "sid-end",
      properties: {
        overrideid: "",
        name: "",
        documentation: "",
        executionlisteners: ""
      },
      stencil: {
        id: "EndNoneEvent"
      },
      childShapes: [],
      outgoing: [],
      bounds: {
        lowerRight: {
          x: 678,
          y: 189
        },
        upperLeft: {
          x: 650,
          y: 161
        }
      },
      dockers: []
  })
  const output = {
    "resourceId": "105001",
    "properties": {
      "process_id": "hqtest",
      "name": "条件会签测试",
      "documentation": "条件会签测试",
      "process_author": "张志华",
      "process_version": "",
      "process_namespace": "http://www.activiti.org/processdef",
      "executionlisteners": "",
      "eventlisteners": "",
      "signaldefinitions": "",
      "messagedefinitions": ""
    },
    "stencil": {
      "id": "BPMNDiagram"
    },
    "childShapes": res,
    "stencilset": {
      "url": "stencilsets/bpmn2.0/bpmn2.0.json",
      "namespace": "http://b3mn.org/stencilset/bpmn2.0#"
    },
    "bounds": {
      "lowerRight": {
        "x": 1200,
        "y": 1050
      },
      "upperLeft": {
        "x": 0,
        "y": 0
      }
    },
    "ssextensions": []
  }
  return output
}