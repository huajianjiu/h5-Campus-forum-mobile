const imgCompressUtil = {
  compressImg (file) {
    // let self = this
    if (!file || !window.FileReader) return // 判断是否支持FileReader
    if (/^image/.test(file.type)) {
      let reader = new FileReader()
      reader.readAsDataURL(file) // 转成 base64 格式
      return new Promise((resolve, reject) => { // 读取成功后的回调
        reader.onloadend = function () {
          let img = new Image()
          img.src = this.result
          // 判断图片是否大于500K,是就直接上传，反之压缩图片
          if (this.result.length <= 500 * 1024) {
            resolve(this.result)
          } else {
            img.onload = function () {
              let canvas = document.createElement('canvas')
              let ctx = canvas.getContext('2d')
              let tCanvas = document.createElement('canvas')
              let tctx = tCanvas.getContext('2d')
              let width = img.width
              let height = img.height
              // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
              let ratio
              if ((ratio = (width * height) / 4000000) > 1) {
                ratio = Math.sqrt(ratio)
                width /= ratio
                height /= ratio
              } else {
                ratio = 1
              }
              canvas.width = width
              canvas.height = height
              ctx.fillStyle = '#fff' // 铺底色
              ctx.fillRect(0, 0, canvas.width, canvas.height)
              // 如果图片像素大于100万则使用瓦片绘制
              let count
              if ((count = (width * height) / 1000000) > 1) {
                count = ~~(Math.sqrt(count) + 1) // 计算要分成多少块瓦片
                // 计算每块瓦片的宽和高
                let nw = ~~(width / count)
                let nh = ~~(height / count)
                tCanvas.width = nw
                tCanvas.height = nh
                for (let i = 0; i < count; i++) {
                  for (let j = 0; j < count; j++) {
                    tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh)
                    ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh)
                  }
                }
              } else {
                ctx.drawImage(img, 0, 0, width, height)
              }
              // 进行压缩(---------quailty越低 图片越小)
              let quailty = 0.5
              let newBase64 = canvas.toDataURL('image/jpeg', quailty)
              tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0
              resolve(newBase64) // 返回压缩后的base64
            }
          }
        }
      })
    }
  }
}

export default imgCompressUtil
