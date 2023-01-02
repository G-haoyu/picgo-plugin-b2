module.exports = (ctx) => {
  const config = ctx => {
    let userConfig = ctx.getConfig('picBed.b2')
    if (!userConfig) {
      userConfig = {}
    }

    let apiConfig = ctx.getConfig('b2')
    if (!apiConfig) {
      let B2CFG = require("./config")
      ctx.saveConfig(B2CFG.B2_API_CONFIG_DEFAULT())
    }

    return [
      {
        name: 'applicationKeyId',
        type: 'input',
        default: userConfig.applicationKeyId,
        required: true,
        message: 'Application Key ID',
        alias: 'Application Key ID'
      },
      {
        name: 'applicationKey',
        type: 'input',
        default: userConfig.applicationKey,
        required: true,
        message: 'Application Key',
        alias: 'Application Key'
      }
    ]
  }

  const register = () => {
    ctx.helper.uploader.register('b2', {
      handle,
      config: config
    })
  }

  const handle = async (ctx) => {
    let userConfig = ctx.getConfig('picBed.b2')
    let apiConfig = ctx.getConfig('b2')

    if (!userConfig || !apiConfig) {
      throw new Error('Can\'t find config')
    }

    let apiUtil = require("./freshenAPI")
    
    // if B2 API authorizationToken invalid, let it valid
    if (!apiUtil.isAPIValid(apiConfig)) {
      // freshen API
      try {
        await apiUtil.freshenAPI(ctx, userConfig, apiConfig)
      } catch (err) {
        throw err
      }
    }
    
    // upload image
    let uploadUtil = require("./uploadImg")
    try {
      await uploadUtil.uploadImage(ctx)
    } catch (err) {
      throw err
    }

    return ctx
  }

  return {
    uploader: 'b2',
    config: config,
    register
  }
}