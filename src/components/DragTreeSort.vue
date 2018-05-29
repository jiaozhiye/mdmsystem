<template>
<div class="app-form-panel tree-sort-panel">
    <div class="tree-sort-wrapper">
        <ul class="drag-wrapper" id="drag-wrapper">
            <li v-for="(item, key) in list" :key="key">
                <i class="el-icon-document"></i>
                {{ item.name }}
            </li>
        </ul>
    </div>
    <div class="app-form-item tr">
        <el-button @click.stop="cancelPanelHandle">取消</el-button>
        <el-button type="primary" @click.stop="submitHandle">确定</el-button>
    </div>
</div>
</template>

<script>
import TreeDrag from 'assets/js/drag-element'

export default {
    name: 'DragTreeSort',
    props: {
        params: Object,
        list: {
            type: Array,
            default (){
                return []
            }
        },
        pid: {
            type: String,
            default: '0'
        }
    },
    data(){
        return {
            cloneList: []
        }
    },
    methods: {
        submitHandle(){
            this.$emit('updateSort', {
                pid: this.pid,
                sort: this.list.map(item => item.id)
            }, () => {
                this.params.isPlay = false
            })
        },
        cancelPanelHandle(){
            this.resetList()
            this.params.recovery = false
            setTimeout(() => this.params.isPlay = false, 400)
        },
        resetList(){
            this.cloneList.forEach((item, i) => this.list.splice(i, 1, item))
        }
    },
    created(){
        this.cloneList = _.cloneDeep(this.list)
    },
    mounted(){
        const _this = this
        let obj = new TreeDrag({
            outerWrapper: document.getElementById('drag-wrapper'),
            callback: function(actionType, res){
                // 对数据进行重新排序
                if (actionType == 'move'){
                    // console.log(res.current, res.target)
                    if (res.current == res.target) return
                    _this.list.splice(res.target, 0, _this.list[res.current])
                    if (res.current < res.target){
                        _this.list.splice(res.current, 1)
                    } else {
                        _this.list.splice(res.current + 1, 1)
                    }
                }
            }
        })
        obj.install()
    }
}
</script>

<style>
.tree-sort-panel {
    padding-top: 10px;
}
.tree-sort-wrapper {
    padding-bottom: 20px;
}
.drag-wrapper {
    width: 50%;
    position: relative;
}
.drag-wrapper li {
    height: 34px;
    line-height: 34px;
    border: 1px dashed transparent;
    margin-top: 5px;
    padding-left: 10px;
    position: relative;
    cursor: move;
}
.drag-wrapper > li::after {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0);
    z-index: 2;
}
.drag-wrapper > li.move {
    margin: 0;
    position: absolute;
    border-color: #43acf7;
    background-color: #ffffe5;
}
/* 站位元素样式 */
.drag-wrapper > i.ref-item {
    display: block;
    height: 34px;
    border: 1px dashed #43acf7;
    margin-top: 5px;
    background-color: rgba(255, 255, 255, .7);
}
</style>