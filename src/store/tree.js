import Vue from "vue";
import Vuex from "vuex";
import req from '@/util/request';
Vue.use(Vuex)
export default new Vuex.Store({
    state: {
        deptArr: []
    },
    mutations: {
        reqDeptArr(state, deptArr) {
            state.deptArr = deptArr.sort((a, b) => Number(a.SORT) - Number(b.SORT))
        }
    },
    actions: {
        async reqdeptArr({ commit }) {
            await req.then((data) => {
                // 从 resolve 获取正常结果                
                commit('reqDeptArr', data.msg)
            }).catch((data) => {
                // 从 reject 获取异常结果
                console.log(data);
            });
        }
    },
    getters: {}
})