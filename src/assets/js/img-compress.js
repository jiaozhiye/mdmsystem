/**
 * @Author: Jzy
 * @Date: 2018/06/08
 * @Last Modified by: Jzy
 * @Last Modified time: 2018/06/08
 */
export default class Smaller {
    /*
     * option {
     *   src: 图片地址
     *   file: 文件对象 - 建议
     *   el: input[file]节点
     *   quality: 压缩质量 0 - 1
     * }
     * */
    constructor(option = {}) {
        this.src = option.src
        this.file = option.file
        this.el = option.el
        this.quality = option.quality || 1
        this.success = option.success
        if (!this.src && !this.el && !this.file) return {}
        this.init()
    }

    init() {
        this.src ? this.compressImg(this.src) : (this.file ? this.fileReader(this.file) : this.fileReader(this.getFile(this.el)))
    }

    getFile(el) {
        let file
        try {
            if (el.files && el.files[0]) {
                file = el.files[0]
            } else if (el.files && el.files.item(0)) {
                file = el.files.item(0)
            }
            return file
        } catch (e) {
            console.log(e)
        }
    }

    fileReader(file) {
        let src = ''
        try {
            try {
                src = file.getAsDataURL()
            } catch (e) {
                src = window.URL.createObjectURL(file)
            }
            this.compressImg(src)
        } catch (e) {
            try {
                let reader = new FileReader()
                reader.onload = (e) => {
                    src = e.target.result
                    this.compressImg(src)
                }
                reader.readAsDataURL(file)
            } catch (e) {
                console.log(e)
            }
        }
    }

    compressImg(_src) {
        var oImage = new Image(),
            canvas = document.createElement('canvas'),
            ctx = canvas.getContext('2d')
        oImage.onload = () => {
            const w = oImage.naturalWidth
            const h = oImage.naturalHeight
            canvas.width  = w
            canvas.height = h
            ctx.drawImage(oImage, 0, 0, w, h, 0, 0, w, h)
            const dataURL = canvas.toDataURL('image/jpeg', this.quality)

            let arr = dataURL.split(','),
                mime = arr[0].match(/:(.*?);/)[1],
                bstr = atob(arr[1]),
                n = bstr.length,
                u8arr = new Uint8Array(n)
            while (n--){
                u8arr[n] = bstr.charCodeAt(n)
            }
            const blob = new Blob([u8arr], { type: mime })

            this.success && this.success({ url: dataURL, file: blob })            
        }
        oImage.src = _src
    }
}