<template>
  <div>
    <el-input placeholder="输入关键字进行搜索" v-model="filterText"> </el-input>
    <el-table
      :data="treeMap"
      style="width: 100%; margin-bottom: 20px"
      row-key="id"
      border
      lazy
      @expand-change="toggleRow"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      ref="table"
    >
      <el-table-column prop="NAME" label="NAME" width="280px">
      </el-table-column>
      <el-table-column prop="SORT" label="SORT"> </el-table-column>
    </el-table>
  </div>
</template>

<script>
import Sortable from "sortablejs";
import { mapState } from "vuex";
export default {
  name: "Tree",
  data() {
    return {
      treeMap: [],
      filterText: "",
      activeRows: [],
      treeArr: [],
    };
  },
  watch: {
    filterText(val) {
      this.filterRow(val)
    },
    deptArr() {
      this.transformData(this.deptArr);
    },
  },
  methods: {
    filterRow(val) {
      console.log(val);
      this.treeMap=this.deptArr.filter(item=>item.NAME===val)
    },
    // 将树数据转化为平铺数据
    treeToTile(treeData, childKey = "children") {
      let arr = [];
      const expanded = (data) => {
        if (data && data.length > 0) {
          data
            .filter((d) => d)
            .forEach((e) => {
              arr.push(e);
              expanded(e[childKey] || []);
            });
        }
      };
      expanded(treeData);
      return arr;
    },
    //拖动排序
    rowDrop() {
      const tbody = document.querySelector(".el-table__body-wrapper tbody");
      Sortable.create(tbody, {
        animation: 300,
        onMove: () => {
          this.activeRows = this.treeToTile(this.treeMap); // 把树形的结构转为列表再进行拖拽
        },
        onEnd: (e) => {
          //e.oldIndex为拖动一行原来的位置，e.newIndex为拖动后新的位置
          if (e.oldIndex !== e.newIndex) {
            // 根据自己项目需求增添条件限制
            const oldRow = this.activeRows[e.oldIndex]; // 移动的那个元素
            const newRow = this.activeRows[e.newIndex]; // 新的元素
            this.activeRows[e.oldIndex] = newRow;
            this.activeRows[e.newIndex] = oldRow;
            // 请求接口排序，根据后端要求填写参数
            // this.treeMap[e.oldIndex]=newRow
            // this.treeMap[e.newIndex]=oldRow
          }
        },
      });
    },

    //单层级展开
    toggleRow(row, expanded) {
      // orgId:id
      // orgPositionLevel:层级（后台返回代表层级的字段，如果后台不返回，则自己对后台返回的数据进行改造）
      const rowId = row.id;
      const rowLevel = row.PARENT_ID;
      if (!expanded) {
        return;
      }
      // 手动维护级别数据
      // levelData 全局变量， levelData：new Map()
      //new Map() 提供“键值对”的数据结构“key-value"，通过set存值，get取值
      let list = this.levelData.get(rowLevel);
      if (!list) {
        list = [];
      }
      list.push(rowId);
      //把当前点击层级作为key,id作为value
      //点击同一个层级， id都会push进该key对应的value中
      this.levelData.set(rowLevel, list);
      // 获取当前级别所有的树
      //通过遍历list 判断是否是同级的id，
      //如果是同级的id，通过table自带的闭合属性设置该id的节点关闭
      list.map((id) => {
        if (id !== rowId) {
          this.$refs.table.toggleRowExpansion({ id }, false);
        }
      });
    },
    getData() {
      this.$store.dispatch("reqdeptArr");
    },
    transformData(arr) {
      let obj = arr.reduce((memo, current) => {
        memo[current.id] = current;
        return memo;
      }, {});
      let newArr = [];
      for (let i = 0; i < arr.length; i++) {
        let item = arr[i];
        let parent = obj[item.PARENT_ID];
        if (parent) {
          parent.children
            ? parent.children.push(item)
            : (parent.children = [item]);
        } else {
          newArr.push(item);
        }
      }
      this.treeMap = newArr;
    },
  },
  computed: {
    ...mapState(["deptArr"]),
  },
  mounted() {
    this.getData();
    this.rowDrop();
  },
};
</script>

<style>
</style>