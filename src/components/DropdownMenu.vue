<template>
<div class="dropdown-menu" :class="{open: isOpen}" @mouseenter.stop="hoverHandle" @mouseleave.stop="outHandle">
    <h4 class="dropdown-link">
        <slot name="title"></slot>
        <i class="el-icon-arrow-right"></i>
    </h4>
    <el-collapse-transition>
        <div class="dropdown-list" :style="{[placement]: 0}" v-show="isOpen">
            <slot name="list"></slot>
        </div>
    </el-collapse-transition>
</div>
</template>

<script>
export default {
    name: 'DropdownMenu',
    props: {
        placement: {
            type: String,
            default: 'left'
        }
    },
    data(){
        return {
            isOpen: false
        }
    },
    methods: {
        hoverHandle(){
            this.isOpen = !0
        },
        outHandle(){
            this.isOpen = !1
        }
    }
}
</script>

<style>
.dropdown-menu {
    height: 50px;
    position: relative;
    display: inline-block;
    z-index: 1;
}
.dropdown-link {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    color: #fff;
    font-size: 16px;
    cursor: pointer;
    overflow: hidden;
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
}
.dropdown-link i {
    font-size: 14px;
    -webkit-transition: all .3s ease;
    transition: all .3s ease;
}
.dropdown-list {
    position: absolute;
    top: 50px;
    min-width: 120px;
    background: #fff;
    box-shadow: 0 5px 5px 0 rgba(0, 0, 0, .1);
    z-index: 1;
}
.dropdown-menu.open .dropdown-link {
    background: #fff;
    color: #333;
}
.dropdown-menu.open .dropdown-link i {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
}
</style>