<template>
    <div class="add-node-btn-box">
        <div class="add-node-btn">
            <el-popover placement="right-start" v-model="visible">
                <div class="add-node-popover-body">
                    <a class="add-node-popover-item approver" @click="addType(1)">
                        <div class="item-wrapper">
                            <span class="iconfont"></span>
                        </div>
                        <p>审批人</p>
                    </a>
                    <!-- <a class="add-node-popover-item notifier" @click="addType(2)">
                        <div class="item-wrapper">
                            <span class="iconfont"></span>
                        </div>
                        <p>抄送人</p>
                    </a> -->
                    <a class="add-node-popover-item condition" @click="addType(4)">
                        <div class="item-wrapper">
                            <span class="iconfont"></span>
                        </div>
                        <p>条件分支</p>
                    </a>
                </div>
                <button class="btn" type="button" slot="reference">
                    <span class="iconfont"></span>
                </button>
            </el-popover>
        </div>
    </div>
</template>
<script>
import { v4 as uuidv4 } from 'uuid';
export default {
    props: ["childNodeP", 'nodeConfig', 'temp', 'isBranch'],
    data() {
        return {
            visible: false
        }
    },
    methods: {
        addType(type) {
            this.visible = false;
            if (type != 4) {
                var data;
                if (type == 1) {
                    data = this.isBranch? {
                        "id": uuidv4(),
                        "nodeName": "审核人",
                        "isBranch": true,
                        "error": true,
                        "type": 1,
                        "settype": 4,
                        "selectMode": 2,
                        "backMode": 1,
                        "selectRange": 1,
                        "directorLevel": 1,
                        "replaceByUp": 0,
                        "examineMode": 3,
                        "noHanderAction": 1,
                        "examineEndDirectorLevel": 0,
                        "childNode": this.childNodeP,
                        "conditionNodes": [],
                        "nodeUserList": [],
                    }: this.nodeConfig.isBranch? {
                        "id": uuidv4(),
                        "nodeName": "审核人",
                        "isBranch": true,
                        "error": true,
                        "type": 1,
                        "backMode": 1,
                        "settype": 4,
                        "selectMode": 2,
                        "selectRange": 1,
                        "directorLevel": 1,
                        "replaceByUp": 0,
                        "examineMode": 3,
                        "noHanderAction": 1,
                        "examineEndDirectorLevel": 0,
                        "childNode": this.childNodeP,
                        "conditionNodes": [],
                        "nodeUserList": [],
                    }:{
                        "id": uuidv4(),
                        "nodeName": "审核人",
                        "isBranch": false,
                        "error": true,
                        "type": 1,
                        "backMode": 1,
                        "settype": 4,
                        "selectMode": 2,
                        "selectRange": 1,
                        "directorLevel": 1,
                        "replaceByUp": 0,
                        "examineMode": 3,
                        "noHanderAction": 1,
                        "examineEndDirectorLevel": 0,
                        "childNode": this.childNodeP,
                        "conditionNodes": [],
                        "nodeUserList": [],
                    }
                } else if (type == 2) {
                    data = this.isBranch? {
                        "id": uuidv4(),
                        "nodeName": "抄送人",
                        "isBranch": true,
                        "type": 2,
                        "ccSelfSelectFlag": 1,
                        "childNode": this.childNodeP,
                        "nodeUserList": [],
                        "conditionNodes": [],
                    }:{
                        "id": uuidv4(),
                        "nodeName": "抄送人",
                        "isBranch": false,
                        "type": 2,
                        "ccSelfSelectFlag": 1,
                        "childNode": this.childNodeP,
                        "nodeUserList": [],
                        "conditionNodes": [],
                    }
                }
                this.$emit("update:childNodeP", data)
            } else {
                this.$emit("update:childNodeP", {
                    "id": uuidv4(),
                    "nodeName": "路由",
                    "type": 4,
                    "childNode": null,
                    "conditionNodes": [{
                        "id": uuidv4(),
                        "nodeName": "条件1",
                        "isBranch": true,
                        "error": true,
                        "type": 3,
                        "isCondition": true,
                        "priorityLevel": 1,
                        "conditionList": [],
                        "nodeUserList": [],
                        "childNode": this.childNodeP,
                        "conditionNodes": [],
                    }, {
                        "id": uuidv4(),
                        "nodeName": "条件2",
                        "isBranch": true,
                        "isCondition": true,
                        "type": 3,
                        "priorityLevel": 2,
                        "conditionList": [],
                        "nodeUserList": [],
                        "childNode": null,
                        "conditionNodes": [],
                    }]
                })
            }
        }
    }
}
</script>