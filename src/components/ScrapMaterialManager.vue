<template>
<div class="appManager-wrapper">
    <section class="material-tree-box">
        <el-input
            placeholder="输入原材料编号/名称" 
            prefix-icon="el-icon-search" 
            v-model="filterText">
        </el-input>
        <el-tree
            class="filter-tree" 
            ref="tree" 
            show-checkbox 
            :data="list" 
            v-loading="treeLoading" 
            node-key="id" 
            default-expand-all 
            :expand-on-click-node="false" 
            @check="checkChangeHandle" 
            :filter-node-method="filterNode">
        </el-tree>
    </section>
    <div class="order-list-box">
        <div class="appManager-top">
            <el-button class="fl" @click.stop="removeItemHandle">批量移除</el-button>
            <el-button class="fl" type="primary" plain style="margin-left: 10px;" @click.stop="imgUploadHandle">图片上传</el-button>
            <ul class="fr">
                <el-button class="fl" type="primary" :loading="btnLoading" @click.stop="saveOrderHandle">保存</el-button>
            </ul>
        </div>
        <div class="appManager-list fixedTable-list">
            <el-table
                class="material-table"
                :data="tableList" 
                border 
                v-loading="loading"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="50"></el-table-column>
                <el-table-column prop="name" label="原材料名称" min-width="250"></el-table-column>
                <el-table-column prop="code" label="原材料编码"></el-table-column>
                <el-table-column prop="unit_text" label="单位"></el-table-column>
                <el-table-column prop="stock" label="库存数量"></el-table-column>
                <el-table-column label="废弃数量" width="140">
                    <template slot-scope="scope">
                        <EditNumber
                            v-model.number="scope.row.number"
                            :maxVal="scope.row.stock"
                            :stepVal="1">
                        </EditNumber>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100" fixed="right">
                    <template slot-scope="scope">
                        <el-button @click.stop="removeItemHandle([scope.row.id])" type="text">
                            <i class="el-icon-delete"></i> 移除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
    <ExtractPanel :params="showUploadExtract" width="40%">
        <span slot="title">图片上传</span>
        <ImageUploadPanel slot="panel" :params="showUploadExtract"></ImageUploadPanel>
    </ExtractPanel>
</div>
</template>

<script>
import EditNumber from './EditNumber.vue'
import ExtractPanel from './ExtractPanel.vue'
import ImageUploadPanel from './ImageUploadPanel.vue'

import { mapActions } from 'vuex'

import { recursionTree } from 'assets/js/tools'
import { getScrapMaterialsTree, getEditedScrapMaterial, saveEditedScrapMaterial } from 'api'

export default {
    name: 'ScrapMaterialManager',
    data(){
        return {
            list: [], // 原材料分类树数组
            tableList: [], // 同步 原材料分类树数组
            loading: false,
            treeLoading: false,
            btnLoading: false,
            filterText: '', // 树结构过滤条件文本
            checkedKeys: [], // 树结构选中的ID数组
            multipleSelection: [], // 选中记录的数组
            showUploadExtract: {
                isPlay: false
            }
        }
    },
    watch: {
        filterText(val){
            this.$refs.tree.filter(val)
        },
        tableList: {
            handler(newVal, oldVal){
                if (!_.isEqual(newVal, this.referData)){ // 数据改变了
                    this.setLeaveRemind(!0)
                } else {
                    this.setLeaveRemind(!1)
                }
            },
            deep: true
        }
    },
    methods: {
        ...mapActions(['setLeaveRemind']),
        imgUploadHandle(){
            this.showUploadExtract.isPlay = !0
            this.showUploadExtract.id = this.$route.params.id
        },
        asyncTableList(){
            let _arr = []
            recursionTree(this.list, (item) => {
                if (this.checkedKeys.findIndex(val => val === item.id) !== -1){
                    _arr.push(item)
                }
            })
            this.tableList = _arr
        },
        checkChangeHandle(){
            this.getCheckedKeys()
            this.asyncTableList()
        },
        getCheckedKeys(){
            // 重置选中树的ID数组 - 过滤掉一级二级分类
            this.checkedKeys = this.$refs.tree.getCheckedKeys(true)
            // console.log(this.checkedKeys)
        },
        setCheckedKeys(){
            this.$refs.tree.setCheckedKeys(this.checkedKeys)
        },
        filterNode(value, data){
            if (!value) return true
            return data.search_text.indexOf(value) !== -1
        },
        async getMaterialsTree(callback){
            try {
                this.treeLoading = !0
                const response = await getScrapMaterialsTree({ id: this.$route.params.id })
                // console.log(response.data)
                if (response.data.code == 1){
                    // 原材料树新增 number 字段，默认值是 1
                    recursionTree(response.data.tree, item => item.number = 1)
                    this.list = response.data.tree
                    callback && callback()
                }
            } catch (error){
                console.error(error)
            }
            this.treeLoading = !1
        },
        async getEditedMaterial(){
            this.loading = !0
            try {
                const response = await getEditedScrapMaterial({
                    id: this.$route.params.id
                })
                // console.log(response.data)
                if (response.data.code == 1){
                    this.tableList = response.data.list

                    // 把编辑过的原材料同步到左侧树
                    recursionTree(this.list, (item) => {
                        let obj = this.tableList.find(val => val.id === item.id)
                        if (typeof obj != 'undefined'){
                            for (let attr in obj){
                                item[attr] = obj[attr]
                            }
                        }
                        obj = null
                    })

                    // 设置对比数据
                    this.referData = _.cloneDeep(this.tableList)

                    this.checkedKeys = this.tableList.map(item => item.id)
                    this.setCheckedKeys()
                }
            } catch (error){
                console.error(error)
            }
            this.loading = !1
        },
        handleSelectionChange(val){
            this.multipleSelection = val
        },
        removeItemHandle(ids){
            if (!Array.isArray(ids)){
                ids = this.multipleSelection.map(item => item.id)
                if (ids.length == 0){
                    return this.$message.warning('请勾选原材料名称！')
                }
            }
            // 处理 checkedKeys 数组
            for (let i = 0; i < this.checkedKeys.length; i++){
                if (ids.findIndex(val => val === this.checkedKeys[i]) !== -1){
                    this.checkedKeys.splice(i--, 1)
                }
            }
            // 删除 tableList 中的记录
            for (let i = 0; i < this.tableList.length; i++){
                if (ids.findIndex(val => val === this.tableList[i].id) !== -1){
                    this.tableList.splice(i--, 1)
                }
            }
            // 重置树的选中状态
            this.setCheckedKeys()
        },
        async saveOrderHandle(){
            try {
                this.btnLoading = !0
                const response = await saveEditedScrapMaterial({
                    list: this.tableList.map(item => ({
                        id: item.id,
                        store_scrap_material_id: item.store_scrap_material_id,
                        number: item.number
                    }))
                })
                if (response.data.code == 1){
                    this.$message.success(response.data.message)
                    this.setLeaveRemind(!1)
                    // 跳转
                    this.$router.push('/storer_manager/scrap_order_list')
                } else {
                    this.$message.error(response.data.message)
                }
                this.btnLoading = !1
            } catch (err){
                console.error(err)
            }
        },
        keyUpHandle(event){
            event.stopPropagation()
            if (event.keyCode === 13 && event.target.classList.value.search('el-input__inner') !== -1){
                const inputNumberArr = Array.from(document.querySelectorAll('.material-table > .el-table__body-wrapper .el-input__inner'))
                let index = inputNumberArr.findIndex(item => item === event.target)
                if (index === -1){
                    return
                }
                index = (++index) % inputNumberArr.length
                // console.log(index)
                inputNumberArr[index].focus()
            }
            return false
        }
    },
    created(){
        // 先获取原材料树
        this.getMaterialsTree(() => { // 再获取已编辑商品原材料
            this.getEditedMaterial()
        })
    },
    mounted(){
        document.querySelector('.material-table').addEventListener('keyup', this.keyUpHandle, false)
    },
    destroyed(){
        document.querySelector('.material-table').removeEventListener('keyup', this.keyUpHandle)
    },
    components: {
        EditNumber,
        ExtractPanel,
        ImageUploadPanel
    }
}
</script>

<style>
.order-list-box {
    margin-left: 360px;
}
</style>