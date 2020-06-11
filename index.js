const uuid = require('uuid');
const { v4 } = uuid;


const target = {
  "tableId": 1,
  "workFlowVersionId": "",
  "workFlowDef": {
    "nodeName": "合同审批",
    "publicFlag": 1,
    "sortNo": 5,
    "duplicateRemovelFlag": 1,
    "optionTip": "",
    "optionNotNull": 0,
    "status": 1
  },
  "directorMaxLevel": 4,
  "flowPermission": [],
  "nodeConfig": {
    "id": "start",
    "nodeName": "发起人",
    "type": 0,
    "priorityLevel": "",
    "settype": "",
    "selectMode": "",
    "selectRange": "",
    "examineRoleId": "",
    "directorLevel": "",
    "replaceByUp": "",
    "examineMode": "",
    "noHanderAction": "",
    "examineEndType": "",
    "examineEndRoleId": "",
    "examineEndDirectorLevel": "",
    "ccSelfSelectFlag": "",
    "conditionList": [],
    "nodeUserList": [],
    "childNode": {
      "id": "dbbc2748-71c7-4499-b43d-a11d77b0ec47",
      "nodeName": "审核人",
      "error": true,
      "type": 1,
      "settype": 1,
      "selectMode": 0,
      "selectRange": 0,
      "directorLevel": 1,
      "replaceByUp": 0,
      "examineMode": 1,
      "noHanderAction": 1,
      "examineEndDirectorLevel": 0,
      "childNode": {
        "id": "887e0150-0bf4-439c-8116-a0154a1737cc",
        "nodeName": "路由",
        "type": 4,
        "childNode": {
          "id": "2642eb80-55fb-4225-96fd-467571894581",
          "nodeName": "审核人",
          "error": true,
          "type": 1,
          "settype": 1,
          "selectMode": 0,
          "selectRange": 0,
          "directorLevel": 1,
          "replaceByUp": 0,
          "examineMode": 1,
          "noHanderAction": 1,
          "examineEndDirectorLevel": 0,
          "childNode": null,
          "conditionNodes": [],
          "nodeUserList": []
        },
        "conditionNodes": [
          {
            "id": "a50fd970-f224-4d63-bdd1-14817248e8f7",
            "nodeName": "条件1",
            "error": true,
            "type": 3,
            "priorityLevel": 1,
            "conditionList": [],
            "nodeUserList": [],
            "childNode": null,
            "conditionNodes": [],
            "conditionsequenceflow": {
              "key": "hello",
              "value": "world"
            }
          },
          {
            "id": "1a2771ce-83d7-419d-a24c-62cd02a45513",
            "nodeName": "条件2",
            "type": 3,
            "priorityLevel": 2,
            "conditionList": [],
            "nodeUserList": [],
            "childNode": null,
            "conditionNodes": [],
            "error": false,
            "conditionsequenceflow": {
              "key": "你好",
              "value": "世界"
            }
          }
        ]
      },
      "conditionNodes": [],
      "nodeUserList": []
    },
    "conditionNodes": []
  }
}

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
const func1 = (obj, outputArr, lastObj, i) => {
  const { childNode, id, conditionNodes, ..._rest } = obj;
  const { nodeName, ...rest } = _rest
  rest.name = nodeName
  let node = {},
  line = {},
  thisID = '',
  nextID = '';

  thisID = v4()
  nextID = v4()
  lineID = v4()
  if(obj.type ==4) {
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
      node = {
        resourceId: `sid-${id}`,
        properties: {
          ...rest, 
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
      if(lastObj.type != 3 && obj.type != 3) {
        lastLine = 'sid-end'
      }else {
        lastLine = `sid-${findLastChild(target.nodeConfig).id}`
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
    func1(childNode, outputArr, obj, i)
  }
  if(conditionNodes) {
    i++
    func2(conditionNodes, outputArr, obj, i)
  }
  return outputArr
}


// 找conditionNodes中的关联关系
const func2 = (conditionNodes, outputArr, obj, i) => {
  if(conditionNodes.length > 0) {
    conditionNodes.forEach((c) => {
      // func2(c, outputArr)
      // console.log(c)
      i++
      func1(c, outputArr, obj, i)
    })
  }
  return outputArr
}
const lastChild = findLastChild(target.nodeConfig)
const res = func1(target.nodeConfig, [], {}, 0).reduce((r, c) => {
  if(c.resourceId == 'sid-start') {
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
console.log(JSON.stringify(output, '', 2))