var B2_API_CONFIG_DEFAULT = function() {
    return {
        'b2': {
            'b2_authorize_account': {
                'requestTime': null,
                'apiUrl': null,
                'authorizationToken': null,
                'bucketId': null,
                'bucketName': null,
                'downloadUrl': null
            },
            'b2_get_upload_url': {
                'requestTime': null,
                'uploadUrl': null,
                'authorizationToken': null
            }
        }
    }
} 

var UPDATE_B2_AUTHORIZE_ACCOUNT = function(
     requestTime, apiUrl, authorizationToken,
     bucketId, bucketName, downloadUrl, apiConfig) {
    let res = {}

    apiConfig.b2_authorize_account = {
        'requestTime': requestTime,
        'apiUrl': apiUrl,
        'authorizationToken': authorizationToken,
        'bucketId': bucketId,
        'bucketName': bucketName,
        'downloadUrl': downloadUrl
    }

    res.b2 = apiConfig
    return res
}

var UPDATE_B2_GET_UPLOAD_URL =function(
     requestTime, uploadUrl, authorizationToken,
     apiConfig) {
    let res = {}

    apiConfig.b2_get_upload_url = {
        'requestTime': requestTime,
        'uploadUrl': uploadUrl,
        'authorizationToken': authorizationToken
    }

    res.b2 = apiConfig
    return res
}

exports.B2_API_CONFIG_DEFAULT = B2_API_CONFIG_DEFAULT
exports.UPDATE_B2_AUTHORIZE_ACCOUNT = UPDATE_B2_AUTHORIZE_ACCOUNT
exports.UPDATE_B2_GET_UPLOAD_URL = UPDATE_B2_GET_UPLOAD_URL