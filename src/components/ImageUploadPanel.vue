<template>
<div class="upload-wrapper">
    <el-upload
        class="upload-demo"
        ref="upload"
        action="http://127.0.0.1:2080/upload/do"
        :data="uploadData"
        :file-list="fileList"
        list-type="picture"
        :auto-upload="false"
        multiple
        :before-upload="beforeUpload"
        :on-success="handleSuccess"
        :on-remove="handleRemove"
    >
        <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
        <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过3M</div>
    </el-upload>
    <div class="app-form-item tr" style="padding-top: 20px;">
        <el-button @click.stop="closePanelHandle">退出</el-button>
    </div>
</div>
</template>

<script>
import HtmlImageCompress from 'html-image-compress'

export default {
    name: 'ImageUploadPanel',
    props: {
        params: Object
    },
    data (){
        return {
            uploadData: { orderId: this.params.id }, // 上传的额外参数
            fileList: [],
            imgUploadNum: 0, // 添加上传图片的数量
            imgSuccessNum: 0 // 上传成功的数量
        }
    },
    methods: {
        compress(file){
            return new Promise((resolve, reject) => {
                const imageCompress = new HtmlImageCompress(file, { quality: 0.75 })
                imageCompress.then(result => resolve(result.file))
            })
        },
        handleSuccess(res, file){
            // console.log(res, file)
            if (++this.imgSuccessNum == this.imgUploadNum){
                this.$message.success('图片上传成功！')
            }
        },
        beforeUpload(file){
            const isJPG = file.type == 'image/jpeg'
            const isPng = file.type == 'image/png'
            const isLt2M = file.size / 1024 / 1024 < 3
            if (!(isJPG || isPng)){
                this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!')
            }
            if (!isLt2M){
                this.$message.error('上传头像图片大小不能超过 3MB!')
            }
            if ((isJPG || isPng) && isLt2M){
                this.imgUploadNum++
                // 图片压缩
                return this.compress(file)
            } else {
                return false
            }
        },
        submitUpload(){
            this.$refs.upload.submit()
        },
        handleRemove(file, fileList){
            
        },
        closePanelHandle(){
            this.params.isPlay = false
        }
    }
}
</script>

<style>
.upload-wrapper {
    padding: 20px 20px 0;
}
</style>