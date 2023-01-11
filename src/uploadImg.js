var uploadImage = async function(ctx) {
    // version compatible
    var CtxRequest = ctx.Request.request || ctx.request

    const apiConfig = ctx.getConfig('b2')
    const uploadUrl =
     apiConfig.b2_get_upload_url.uploadUrl
    const authToken =
     apiConfig.b2_get_upload_url.authorizationToken
    const imgList = ctx.output
    
    for (let i in imgList) {
        // Fix Char Encode Error
        imgList[i].fileName = encodeURIComponent(imgList[i].fileName)
        
        let image = imgList[i].buffer
        if (!image && imgList[i].base64Image) {
            image = Buffer.from(imgList[i].base64Image, 'base64');
        }

        // calculate sha1
        let sha1 = require('./sha1')
        let imgSha1 = await sha1(image)
        
        // request to upload image
        const a3PostOpt = POST_B2_Upload_File(
             uploadUrl, authToken, imgList[i],
             image, imgSha1)
        let body = await CtxRequest(a3PostOpt)
        body = JSON.parse(body)
        if (!body.fileId) {
            throw new Error("upload Image Failed")
        }

        // write downloadUrl
        delete imgList[i].base64Image
        delete imgList[i].buffer
        const downloadURL =
         apiConfig.b2_authorize_account.downloadUrl
        const bucketName =
         apiConfig.b2_authorize_account.bucketName
        if (bucketName) {
           imgList[i]['imgUrl'] =
             downloadURL + "/file/" + bucketName +
             "/" + imgList[i].fileName
        } else {
            imgList[i]['imgUrl'] =
             downloadURL +
             "/b2api/v2/b2_download_file_by_id?fileId=" +
             body.fileId
        }
    }
}

const POST_B2_Upload_File = (
     uploadUrl, authToken, image, imageBuffer, sha1) => {
    return {
        method: 'POST',
        url: uploadUrl,
        headers: {
          'Content-Type': 'b2/x-auto',
          'Authorization': authToken||undefined,
          'X-Bz-File-Name': image.fileName,
          'X-Bz-Content-Sha1': sha1,
        },
        body: imageBuffer
      }
}

exports.uploadImage = uploadImage