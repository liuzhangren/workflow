<template>
    <div>
        <div>
            <div class="fd-nav">
              <div class="fd-nav-left">
                    <!-- <div class="fd-nav-back" @click="toReturn"></div> -->
                    <div class="fd-nav-title">自定义工作流</div>
                </div>
                <div v-if="type === 0" class="fd-nav-center">
                    <div @click="selectItem(1)" :class="`fd-nav-center-item ${actives[1]?'fd-nav-center-item-active':''}`"><div class="fd-nav-center-circle-box"><span class="fd-nav-center-circle">1</span></div><div style="fontSize: 18px; margin-left: 4px;">基础设置</div></div>
                    <div @click="selectItem(2)" :class="`fd-nav-center-item ${actives[2]?'fd-nav-center-item-active':''}`"><div class="fd-nav-center-circle-box"><span class="fd-nav-center-circle">2</span></div><div style="fontSize: 18px; margin-left: 4px;">流程设计</div></div>
                </div>
                <div v-if="type === 0" class="fd-nav-right">
                    <button type="button" @click="saveProcess(0)" class="ant-btn button-publish"><span>保存</span></button>
                    <button type="button" @click="saveProcess(1)" class="ant-btn button-publish" ><span>发布</span></button>
                </div>
            </div>
            
            <div class="fd-nav-content">
              <div v-if="type === 1">
                <section v-if="actives['1']" class="dingflow-design">
                    <div class="zoom">
                        <div :class="'zoom-out'+ (nowVal==50?' disabled':'')" @click="zoomSize(1)"></div>
                        <span>{{nowVal}}%</span>
                        <div :class="'zoom-in'+ (nowVal==300?' disabled':'')" @click="zoomSize(2)"></div>
                    </div>
                    <div class="box-scale" id="box-scale" :style="'transform: scale('+nowVal/100+'); transform-origin: 50% 0px 0px; min-height: 600px;'">
                        <nodeWrap :type.sync="type" :test.sync="test" :processConfig.sync="processConfig" :nodeConfig.sync="nodeConfig" :flowPermission.sync="flowPermission" 
                        :isTried.sync="isTried" :directorMaxLevel="directorMaxLevel" :tableId="tableId"></nodeWrap>
                        <div class="end-node">
                            <div class="end-node-circle"></div>
                            <div class="end-node-text">流程结束</div>
                        </div>
                    </div>
                </section>
              </div>
              <div v-else>
                <!-- <section v-if="actives['1']" class="dingflow-design">
                    <el-card class="box-card">
                        <el-form :model="editForm" label-width="80px">
                            <el-form-item label="流程编号">
                                <el-input v-model="editForm.flowKey"></el-input>
                            </el-form-item>
                            <el-form-item label="流程名称">
                                <el-input v-model="editForm.name"></el-input>
                            </el-form-item>
                        </el-form>
                    </el-card>
                </section> -->
              </div>
                
                <section v-if="actives['2']" class="dingflow-design">
                    <div class="zoom">
                        <div :class="'zoom-out'+ (nowVal==50?' disabled':'')" @click="zoomSize(1)"></div>
                        <span>{{nowVal}}%</span>
                        <div :class="'zoom-in'+ (nowVal==300?' disabled':'')" @click="zoomSize(2)"></div>
                    </div>
                    <div class="box-scale" id="box-scale" :style="'transform: scale('+nowVal/100+'); transform-origin: 50% 0px 0px; min-height: 600px;'">
                        <nodeWrap :type.sync="type" :test.sync="test" :processConfig.sync="processConfig" :nodeConfig.sync="nodeConfig" :flowPermission.sync="flowPermission" 
                        :isTried.sync="isTried" :directorMaxLevel="directorMaxLevel" :tableId="tableId"></nodeWrap>
                        <div class="end-node">
                            <div class="end-node-circle"></div>
                            <div class="end-node-text">流程结束</div>
                        </div>
                    </div>
                </section>
            </div>
            <el-dialog title="提示" :visible.sync="tipVisible">
                <div class="ant-confirm-body">
                    <i class="anticon anticon-close-circle" style="color: #f00;"></i>
                    <span class="ant-confirm-title">当前无法发布</span>
                    <div class="ant-confirm-content">
                        <div>
                            <p class="error-modal-desc">以下内容不完善，需进行修改</p>
                            <div class="error-modal-list">
                                <div class="error-modal-item" v-for="(item,index) in tipList" :key="index">
                                    <div class="error-modal-item-label">流程设计</div>
                                    <div class="error-modal-item-content">{{item.name}} 未选择{{item.type}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button @click="tipVisible = false">我知道了</el-button>
                    <el-button type="primary" @click="tipVisible = false">前往修改</el-button>
                </span>
            </el-dialog>
        </div>
        <!-- <div class="footer-setting">
            <el-button @click="cancelModal">取消</el-button>
            <el-button type="primary" @click="saveProcess">确定</el-button>
        </div> -->
    </div>
</template>
<script>
import func from '../../utils/getActivitiData'
import getRoute from '../../utils/getFlowRoute'
export default {
    data() {
        return {
            editForm: {
                name: '',
                flowKey: '',
                categoryId: ''
            },
            type: 0,
            actives: {
                1: true,
                2: false
            },
            loading: false,
            visible: true,
            formLabelWidth: '120px',
            result: {},
            isTried: false,
            tipList: [],
            tipVisible: false,
            nowVal: 100,
            processConfig: {},
            nodeConfig: {},
            workFlowDef: {},
            flowPermission: [],
            directorMaxLevel: 0,
            dialogVisible: true,
            tableId: "",
            test: 'hello'
        };
    },
    created() {
        const { search } = location
        const result = search.replace('?', '').split('&').reduce((r, c) => {
            const k = c.split('=')[0]
            const v = c.split('=')[1]
            return {
                ...r,
                [k]: v
            }
        }, {})
        const customJson = sessionStorage.getItem('customJson')
        this.editForm = JSON.parse(sessionStorage.getItem('form'))
        // this.$axios.get("/flow/data.json", {
        //     workFlowDefId: this.$route.params.workFlowDefId
        // }).then(res => {
        //     this.processConfig = res.data;
        //     this.nodeConfig = this.processConfig.nodeConfig;
        //     this.flowPermission = this.processConfig.flowPermission;
        //     this.directorMaxLevel = this.processConfig.directorMaxLevel;
        //     this.workFlowDef = this.processConfig.workFlowDef
        //     this.tableId = this.processConfig.tableId
        // })

        /** 行动路径
         * sid-6f6bf6ff-0e39-4518-a897-7d96f8a0921b
         * sid-ac1a096f-bff9-41ef-a2f0-89a4e57b7d89
         * sid-cbb089a7-14cf-4d68-bd1d-4a5c521a1998  当前流程到该节点
         * sid-1cb5bae2-afdc-4c40-a4ba-4de49ceb6cea
         * sid-c9464abf-6014-4e0d-825e-9f305a7612f4
         * sid-16f31486-aada-4ab5-bed9-ccf2928c09aa
         * sid-1c9742e9-ee55-4dd3-a4c4-a254e1f35464
         */
        const flowRoute = JSON.parse(sessionStorage.getItem('flowRoute'))
        if(customJson != 'null') {
          if(Object.keys(flowRoute).length > 0) {
            this.type = 1
            this.nowVal = 50
            this.processConfig = JSON.parse(customJson);
            this.nodeConfig = getRoute(this.processConfig, flowRoute);
            this.flowPermission = this.processConfig.flowPermission;
            this.directorMaxLevel = this.processConfig.directorMaxLevel;
            this.workFlowDef = this.processConfig.workFlowDef
            this.tableId = this.processConfig.tableId
          }else {
            this.processConfig = JSON.parse(customJson);
            this.nodeConfig = this.processConfig.nodeConfig;
            this.flowPermission = this.processConfig.flowPermission;
            this.directorMaxLevel = this.processConfig.directorMaxLevel;
            this.workFlowDef = this.processConfig.workFlowDef
            this.tableId = this.processConfig.tableId
          }
          
          // if (result.isShow) {
            
          // }else {
          //   this.processConfig = JSON.parse(customJson);
          //   this.nodeConfig = this.processConfig.nodeConfig;
          //   this.flowPermission = this.processConfig.flowPermission;
          //   this.directorMaxLevel = this.processConfig.directorMaxLevel;
          //   this.workFlowDef = this.processConfig.workFlowDef
          //   this.tableId = this.processConfig.tableId
          // }
        }else {
            this.$axios.get("/flow/data.json", {
            workFlowDefId: this.$route.params.workFlowDefId
            }).then(res => {
                this.processConfig = res.data;
                this.nodeConfig = this.processConfig.nodeConfig;
                this.flowPermission = this.processConfig.flowPermission;
                this.directorMaxLevel = this.processConfig.directorMaxLevel;
                this.workFlowDef = this.processConfig.workFlowDef
                this.tableId = this.processConfig.tableId
            })
        }
        this.basicSettings = result
    },
    methods: {
        selectItem(index) {
            const newActives = Object.keys(this.actives).reduce((r, c) => {
                if(c == index) {
                    r[c] = true
                }else {
                    r[c] = false
                }
                return r
            }, {})
            this.actives = newActives
        },
        saveProcess(v) {
            const res = func(this.processConfig)
            res.properties.name = this.basicSettings.name
            res.properties.process_id = this.basicSettings.flowKey
            window.parent.postMessage({json_xml: res, json: this.processConfig, isDeploy: v, values: this.editForm }, '*');
        },
        cancelModal() {
            window.parent.postMessage({msg: 'close'}, '*');
        },
        confirm() {

        },
        handleClose() {

        },
        toReturn() {
            //window.location.href = ""
        },
        reErr(data) {
            if (data.childNode) {
                if (data.childNode.type == 1) {//审批人
                    if (data.childNode.error) {
                        this.tipList.push({ name: data.childNode.nodeName, type: "审核人" })
                    }
                    this.reErr(data.childNode)
                } else if (data.childNode.type == 2) {
                    if (data.childNode.error) {
                        this.tipList.push({ name: data.childNode.nodeName, type: "抄送人" })
                    }
                    this.reErr(data.childNode)
                } else if (data.childNode.type == 3) {
                    this.reErr(data.childNode.childNode)
                } else if (data.childNode.type == 4) {
                    this.reErr(data.childNode)
                    for (var i = 0; i < data.childNode.conditionNodes.length; i++) {
                        if (data.childNode.conditionNodes[i].error) {
                            this.tipList.push({ name: data.childNode.conditionNodes[i].nodeName, type: "条件" })
                        }
                        this.reErr(data.childNode.conditionNodes[i])
                    }
                }
            } else {
                data.childNode = null
            }
        },
        saveSet() {
            // alert('hello')
            // this.isTried = true;
            // this.tipList = [];
            // this.reErr(this.nodeConfig);
            // if (this.tipList.length != 0) {
            //     this.tipVisible = true;
            //     return;
            // }
            // this.processConfig.flowPermission = this.flowPermission
            // const res = func(this.processConfig)
            // console.log(JSON.stringify(this.processConfig, '', 2))
            // console.log(JSON.stringify(res, '', 2))
            
            const res = func(this.processConfig)
            res.properties.name = this.basicSettings.name
            res.properties.process_id = this.basicSettings.flowKey
            debugger
            window.parent.postMessage({json_xml: res, json: this.processConfig, isDeploy: 1, values: this.editForm }, '*');
            
            // this.$axios.post("", this.processConfig).then(res => {
            //     if (res.code == 200) {
            //         this.$message.success("设置成功");
            //         setTimeout(function () {
            //             window.location.href = ""
            //         }, 200)
            //     }
            // })
        },
        zoomSize(type) {
            if (type == 1) {
                if (this.nowVal == 50) {
                    return;
                }
                this.nowVal -= 10;
            } else {
                if (this.nowVal == 300) {
                    return;
                }
                this.nowVal += 10;
            }
        }
    }
};
</script>
<style>
@import "../../css/workflow.css";
.error-modal-list {
    width: 455px;
}
.footer-setting {
    text-align: right;
    background: transparent;
    width: 100%;
    height: 60px;
    position: fixed;
    bottom: 10px;
    z-index: 100;
}
.box-card {
    min-height: 600px;
    margin: 12px;
    margin-top: 20px;
    padding: 20px;
    padding: 20px;
}
</style>