import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        conditionVisible: false,
        approveVisible: false,
        clickItemName: '',
        conditionData: {},
        conditionForm: {},
        approverConfig: {}
    },
    mutations: {
        changeVisibleTrue(state) {
            state.conditionVisible = true
        },
        changeVisibleFalse(state) {
            state.conditionVisible = false
        },
        changeApproveVisibleTrue(state) {
            state.approveVisible = true
        },
        changeApproveVisibleFalse(state) {
            state.approveVisible = false
        },
        saveClickitem(state, stark) {
            state.clickItemName = stark.payload
        },
        saveConditionData(state, {payload}) {
            state.conditionData = payload
        },
        saveConditionForm(state, {payload}) {
            state.conditionForm = payload
        },
        saveApproveConfig(state, { payload }) {
            state.approverConfig = payload
        }
    },
    actions: {}
})