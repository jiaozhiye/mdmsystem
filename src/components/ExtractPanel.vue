<template>
<transition name="app-side">
    <div class="extract-wrapper" 
        :style="{width: width}" 
        v-if="params.isPlay" 
        @click.stop="stopPropagationHandle">
        <div class="extract-top">
            <h5 class="title">
                <slot name="title">提示信息</slot>
            </h5>
            <span class="extract-close" @click.stop="handleClick">
                <i class="el-icon-close"></i>
            </span>
        </div>
        <div class="extract-main">
            <slot name="panel">
                <div class="no-info">暂无数据...</div>
            </slot>
        </div>
    </div>
</transition>
</template>

<script>
export default {
    name: 'ExtractPanel',
    data(){
        return {}
    },
    props: {
        params: {
            type: Object,
            default (){
                return {isPlay: false}
            }
        },
        width: {
            type: String,
            default: '50%'
        }
    },
    methods: {
        handleClick(){
            this.params.isPlay = false
        },
        stopPropagationHandle(){
            event.stopPropagation()
        }
    },
    mounted(){
        document.addEventListener('click', (ev) => {
            ev.stopPropagation()
            ev.preventDefault()
            this.params.isPlay = false
        }, false)
    }
}
</script>

<style>
.extract-masker {
    position: fixed;
    width: 100%;
    height: 100%;
    left: 0;
    top: 0;
    background: rgba(0, 0, 0, .2);
    z-index: 8;
}
.extract-wrapper {
    width: 50%;
    height: calc(100% - 50px);
    position: fixed;
    top: 50px;
    right: 0;
    bottom: 0;
    background: #f5f5f5;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
    -webkit-box-shadow: -3px 0 4px rgba(0, 0, 0, .1);
    box-shadow: -3px 0 4px rgba(0, 0, 0, .1);
    z-index: 9;
}
.extract-top {
    height: 50px;
    border-bottom: 1px solid #ccc;
    position: relative;
}
.extract-top .title {
    line-height: 50px;
    padding-left: 15px;
    font-size: 16px;
    font-weight: bold;
    width: 80%;
}
.extract-top .extract-close {
    position: absolute;
    right: 12px;
    top: 15px;
    font-size: 20px;
    cursor: pointer;
}
.extract-main {
    height: calc(100% - 51px);
    overflow-y: auto;
}
.extract-main .no-info {
    text-align: center;
    padding-top: 50px;
}

/**
 * 抽出面板组件切换动画
 */
#app .app-side-enter,
#app .app-side-leave-to {
    opacity: 0;
    -webkit-transform: translate3d(100%, 0, 0);
    transform: translate3d(100%, 0, 0);
}
#app .app-side-enter-to,
#app .app-side-leave {
    opacity: 1;
    -webkit-transform: translate3d(0, 0, 0);
    transform: translate3d(0, 0, 0);
}
#app .app-side-enter-active,
#app .app-side-leave-active {
    -webkit-transition: all .5s ease-in-out;
    transition: all .5s ease-in-out;
}
</style>