<template>
    <div>
        <div 
            class='treeNodeText' 
            :style='styleObj'
            :id='model.id' 
            @click="toggle" 
            draggable='true' 
            @dragstart='dragStart' 
            @dragover='dragOver' 
            @dragenter='dragEnter' 
            @dragleave='dragLeave' 
            @dragend='dragEnd' 
            @mouseover='mouseOver' 
            @mouseout='mouseOut'>
            <span 
                :class="[isClicked ? 'nodeClicked' : '','vue-drag-node-icon']">
            </span>
            {{model.name}}
        </div>
        <div class='treeMargin' v-show="open" v-if="isFolder">
            <item v-for="model in model.children" 
                :model="model" 
                :key='model.id' 
                :default-text='defaultText' 
                :hover-color='hoverColor' 
                :highlight-color='highlightColor'>
            </item>
        </div>
    </div>
</template>

<script>
let id = 1000
let fromData = ''
let toData = ''
let fromParentModelChildren = ''  // from 节点的父组件的model
let nodeClicked = undefined   // Attention: 递归的所有组件共享同一个＂顶级作用域＂（这个词或许不太正确，但就这个意思）．即：共享上面这几个let变量．这为实现当前节点的高亮提供了基础．

export default {
    name: 'DragTree',
    data: function () {
        return {
            open: false,
            isClicked: false,
            styleObj: {
                background: 'white',
            }
        }
    },
    props: {
        model: Object,
        'default-text': String, // 填加节点时显示的默认文本．
        'current-highlight': Boolean, // 当前节点高亮
        'hover-color': String,
        'highlight-color': String,
    },
    computed: {
        isFolder() {
            return this.model.children && this.model.children.length
        },
    },
    methods: {
        toggle() {
            if (this.isFolder) {
                this.open = !this.open
            }
            // 调用vue-drag-tree的父组件中的方法,以传递出当前被点击的节点的id值
            let rootTree = this.findRoot()
            // //　API: 对外开放的当前被点击节点的信息
            rootTree.$parent.curNodeClicked(this.model, this)
            
            // 纪录节点被点击的状态
            this.isClicked = !this.isClicked
        },
        exchangeData(rootCom, from, to) {
            //如果drag的目的地是 + - 符号的话，退出。
            if (!to || !from || typeof to == 'string' || from.id == to.id) {
                return
            }
            from = JSON.parse(JSON.stringify(from))
            to = JSON.parse(JSON.stringify(to))
            // copy一个,最后再赋值给state.treeData.这样能保证值的变化都会触发视图刷新(因为JS判断引用类型是否相同是根据内存地址.)
            let treeData = JSON.parse(JSON.stringify(this.model))
            let nodeStack = [treeData]
            let status = 0

            // 如果from或者to节点存在父子/祖辈关系，会报id of undefined的错。这种情况不考虑拖拽功能，所以catch住，返回/return就行
            try {
                // 广度优先遍历,找到涉及数据交换的两个对象.然后交换数据.
                while (!(status === 2)) {
                    let item = nodeStack.shift()
                    if (item.id == from.id) {
                        item.id = to.id
                        item.name = to.name
                        if (to.children && to.children.length > 0) {
                            item['children'] = to.children
                        } else {
                            item.children = []
                        }
                        status++
                        //找到后,跳出当前循环.
                        continue;
                    }
                    if (item.id == to.id) {
                        item.id = from.id
                        item.name = from.name
                        if (from.children && from.children.length > 0) {
                            item['children'] = from.children
                        } else {
                            item.children = []
                        }
                        status++
                        //找到后,跳出当前循环.
                        continue;
                    }
                    if (item.children && item.children.length > 0) {
                        nodeStack = nodeStack.concat(item.children)
                    }
                }
            } catch (e) {
                return
            }
            //API: 对外开放交换后的数据的赋值操作
            rootCom.assignData(treeData)
        },
        mouseOver(e) {
            if ((this.styleObj.background != '#99A9BF' || this.styleObj.background != this.hightlightColor) && e.target.className === 'treeNodeText') {
                e.target.style.background = this.hoverColor ? this.hoverColor : '#E5E9F2'
            }
        },
        mouseOut(e) {
            if ((this.styleObj.background != '#99A9BF' || this.styleObj.background != this.hightlightColor) && e.target.className === 'treeNodeText') {
                e.target.style.background = 'white'
            }
        },
        findRoot() {
            // 返回Tree的根,即递归Tree时的最顶层那个vue-drag-tree组件
            let ok = false
            let that = this
            while (!ok) {
                if (!/DragTree/.test(that.$parent.$vnode.tag) || that.$parent.data) {
                    ok = true
                    // 交换两者的数据 
                    break
                }
                that = that.$parent
            }
            return that
        },
        dragStart(e) {
            // e.dataTransfer.effectAllowed = "move";
            // e.dataTransfer.setData("nottext", e.target.innerHTML);
            return false
        },
        dragEnd(e) {
            fromData = undefined
            toData = undefined
            fromParentModelChildren = undefined
        },
        dragOver(e) {
            e.preventDefault()
            return false
        },
        dragEnter(e) {
            toData = this.model
            let rootTree = this.findRoot()
            rootTree.exchangeData(rootTree.$parent, fromData, toData)
        },
        dragLeave(e) {
            fromData = this.model
            fromParentModelChildren = this.$parent.model.children
            // e.target.style.background = '#7B1FA2'
        }
    },
    created() {
        this.$options.components.item = require('./DragTree.vue')
    }
}
</script>

<style>
.item {
    cursor: pointer;
}

.bold {
    font-weight: bold;
}

.treeNodeText {
    margin: 2px;
    padding: 0.2rem 0.5rem;
    width: fit-content;
    background: #F9FAFC;
    font-size: 18px;
    color: #324057;
}

.treeMargin {
    margin-left: 2rem;
}

.changeTree {
    width: 1rem;
    color: #324057;
}

.vue-drag-node-icon {
    display: inline-block;
    width: 0;
    height: 0;
    padding-right: 3px;
    border-left: 6px solid black;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
    border-right: 0 solid yellow;
    transition: transform .3s ease-in-out;
}

.nodeClicked {
    transform: rotate(90deg);
}
</style>