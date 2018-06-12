<template>
    <el-upload
        class="upload-demo"
        ref="upload"
        action="http://127.0.0.1:2080/upload/do"
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
</template>

<script>
// import ImageCompress from 'assets/js/img-compress'
import HtmlImageCompress from 'html-image-compress'

export default {
    name: 'Home',
    data (){
        return {
            fileList: []
        }
    },
    methods: {
        compress(file){
            return new Promise((resolve, reject) => {
                // new ImageCompress({
                //     file,
                //     quality: 0.7,
                //     success(result){
                //         resolve(result.file)
                //     }
                // })
                const imageCompress = new HtmlImageCompress(file, { quality: 0.75 })
                imageCompress.then(result => resolve(result.file))
            })
        },
        handleSuccess(res, file){
            console.log(res, file)
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
            
        }
    }
}
</script>

<style>
</style>