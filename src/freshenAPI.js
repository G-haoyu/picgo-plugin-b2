// to ensure that the authorizationToken in API is not outdated
var isAPIValid = function(apiConfig) {
    let isValid = false

    let a1ReqTime = apiConfig.b2_authorize_account.requestTime
    let a2ReqTime = apiConfig.b2_get_upload_url.requestTime
    a1ReqTime = new Date(a1ReqTime)
    a2ReqTime = new Date(a2ReqTime)

    if(isIn23Hours(a1ReqTime) && isIn23Hours(a2ReqTime)) {
        isValid = true
    }

    return isValid
}

var freshenAPI = async function(ctx, userConfig, apiConfig) {
    // 1. B2_API: b2_authorize_account
    let appIDKey = userConfig.applicationKeyId +
    ":" + userConfig.applicationKey
    let auth = "Basic" + toBase64(appIDKey)

    // request to get general authorizationToken and basic info
    const a1GetOpt = Get_Options_B2_Authorize_Account(auth)
    let requestTime = new Date()
    let body = await ctx.Request.request(a1GetOpt)
    body = JSON.parse(body)
    if(!body.accountId) {
        throw new Error("get B2_Authorize_Account Failed")
    }
    
    // save info to config file
    let B2CFG = require("./config")
    ctx.saveConfig(B2CFG.UPDATE_B2_AUTHORIZE_ACCOUNT(
         requestTime, body.apiUrl,
         body.authorizationToken,
         body.allowed.bucketId,
         body.allowed.bucketName,
         body.downloadUrl, apiConfig
    ))
    apiConfig = ctx.getConfig('b2')

    // 2. B2_API: b2_get_upload_url
    let apiUrl = body.apiUrl
    let authToken = body.authorizationToken
    let bucketId = body.allowed.bucketId
    
    // request to upload API authorizationToken
    const a2PostOpt = POST_Options_B2_Get_Upload_Url(apiUrl, authToken, bucketId)
    requestTime = new Date()
    body = await ctx.Request.request(a2PostOpt)
    if(!body.authorizationToken) {
        throw new Error("get B2_Get_Upload_Url Failed")
    }

    // save info to config file
    ctx.saveConfig(B2CFG.UPDATE_B2_GET_UPLOAD_URL(
         requestTime, body.uploadUrl,
         body.authorizationToken, apiConfig
    ))
}

function isIn23Hours(t) {
    let res = false
    let nowTime = new Date()

    let times = nowTime.getTime() - t.getTime()
    let leaveHours = parseInt(times / (3600*1000))
    
    if(leaveHours < 23 && leaveHours >= 0) {
        res = true
    }

    return res
}

function toBase64(str) {
    let buff = Buffer.from(str)
    return buff.toString('base64')
}

const Get_Options_B2_Authorize_Account = (auth) => {
    return {
        method: 'GET',
        url: 'https://api.backblazeb2.com/b2api/v2/b2_authorize_account',
        headers: {
            'charset': 'utf-8',
            'User-Agent': 'PicGo',
            "Authorization": auth||undefined
        }
    }
}

const POST_Options_B2_Get_Upload_Url = (apiUrl, authToken, bucketId) => {
    return{
        method: 'POST',
        url: apiUrl + "/b2api/v2/b2_get_upload_url",
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'charset': 'utf-8',
            'User-Agent': 'PicGo',
            'Authorization': authToken||undefined,
        },
        body: {
            bucketId: bucketId
        }
    }
}

exports.isAPIValid = isAPIValid
exports.freshenAPI = freshenAPI