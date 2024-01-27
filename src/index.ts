import { RemoteCacheImplementation, createCustomRunner, initEnv } from 'nx-remotecache-custom'
import qiniu from 'qiniu'
import fetch from 'node-fetch'
import storage from 'node-persist'
import pkgDir from 'pkg-dir'
import { join } from 'path'

const prefix = 'NXCACHE_'
const TOKEN_KEY = 'uploadToken'

// define custom parameters for your nx.json here
interface QiniuBlobRunnerOptions {
  accessKey: string
  secretKey: string
  bucket: string
  domain: string
  zone: string
  private?: boolean
  expires?: number
}

function getOptions(options: QiniuBlobRunnerOptions): QiniuBlobRunnerOptions {
  const obj = {
    ...options,
    accessKey: '',
    secretKey: '',
    bucket: '',
    domain: '',
    zone: '',
    private: false,
    expires: 3600
  } as QiniuBlobRunnerOptions

  Object.keys(obj).map((o) => {
    obj[o] = process.env[prefix + o.replace(/([A-Z])/g, '_$1').toUpperCase()] ?? options[o]
  })
  return obj
}

async function getClient(options: QiniuBlobRunnerOptions) {
  const accessKey = options.accessKey
  const secretKey = options.secretKey
  const mac = new qiniu.auth.digest.Mac(accessKey, secretKey)

  let uploadToken = ''
  // 判断expires用户是否要求强制刷新uploadToken
  if (options.expires === 0) {
    if (typeof storage.getItem === 'function') {
      const res = await storage.getItem(TOKEN_KEY)
      // 判断是否options有变化
      let flag = true // uploadToken无变化
      for (const key in options) {
        if (options[key] !== res[key]) {
          // false - options有变化，需要更新uploadToken
          flag = false
          break
        }
      }
      // 判断uploadToken是否过期
      if (res && res.time && flag) {
        const now = Date.now()
        if (now - res.time < 3600 * 1000) {
          uploadToken = res.uploadToken
        }
      }
    }
  } else if (!uploadToken) {
    // 读取缓存
    const localOptions = {
      scope: options.bucket,
      returnBody:
        '{"filename":"$(key)","hash":"$(etag)","fsize":$(fsize),"bucket":"$(bucket)","name":"$(x:name)"}',
      expires: options.expires || 3600
    }
    const putPolicy = new qiniu.rs.PutPolicy(localOptions)
    uploadToken = putPolicy.uploadToken(mac)
    //  存储uploadToken
    if (typeof storage.setItem === 'function')
      await storage.setItem(TOKEN_KEY, { uploadToken, time: Date.now(), ...options })
  }
  const config = new qiniu.conf.Config() as any
  const zone = `Zone_${options.zone.replace(/-/g, '_')}`
  // 空间对应的机房
  config.zone = qiniu.zone[zone]
  // 是否使用https域名
  //config.useHttpsDomain = true;
  // 上传是否使用cdn加速
  //config.useCdnDomain = true;

  const bucketManager = new qiniu.rs.BucketManager(mac, config)

  const formUploader = new qiniu.form_up.FormUploader(config)

  return {
    uploadToken,
    bucketManager,
    formUploader
  }
}

export default createCustomRunner<QiniuBlobRunnerOptions>(async (options) => {
  // initialize environment variables from dotfile
  initEnv(options)
  const clientOptions = getOptions(options)

  const dir = (await pkgDir()) || ''
  const cacheDir = join(dir, 'node_modules', '.cache', '.nx-remotecache-qiniu')
  await storage.init({ dir: cacheDir })
  return {
    // name is used for logging purposes
    name: 'Nx Qiniu Cloud Storage - nx-remotecache-qiniu plugin',

    // fileExists checks whether a file exists on your remote storage
    fileExists: async (filename) => {
      const { bucketManager } = await getClient(clientOptions)
      const exist = await new Promise((resolve) => {
        bucketManager.stat(clientOptions.bucket, filename, function (err, _respBody, respInfo) {
          // console.log({err, _respBody, respInfo});
          if (err) {
            // console.log(err);
            throw err
          } else {
            if (respInfo.statusCode == 200) {
              resolve(true)
            } else {
              resolve(false)
            }
          }
        })
      })
      // console.log('exist', exist)
      return exist
    },

    // retrieveFile downloads a file from your remote storage
    retrieveFile: async (filename) => {
      const { bucketManager } = await getClient(clientOptions)
      const domain = clientOptions.domain
      let fileUrl = ''
      let res
      const privateFunc = () => {
        const deadline = Math.floor(Date.now() / 1000 + 3600) // 1小时过期
        fileUrl = bucketManager.privateDownloadUrl(domain, filename, deadline)
      }
      if (!options.private) {
        // public bucket
        // 公开空间访问链接
        fileUrl = bucketManager.publicDownloadUrl(domain, filename)
        res = await fetch(fileUrl).catch(() => {
          privateFunc()
        })
        if (res.status !== 200) {
          privateFunc()
        }
      } else {
        privateFunc()
      }
      res = await fetch(fileUrl)
      return res.body!
    },

    // storeFile uploads a file from a buffer to your remote storage
    storeFile: async (filename, buffer) => {
      const { formUploader, uploadToken } = await getClient(clientOptions)
      const putExtra = new qiniu.form_up.PutExtra()
      // 文件上传
      return new Promise((resolve) => {
        formUploader.putStream(
          uploadToken,
          filename,
          buffer,
          putExtra,
          function (respErr, respBody, respInfo) {
            // console.log({respErr, respBody, respInfo});
            if (respErr) {
              throw respErr
            }
            // if (respInfo.statusCode == 200) {
            //   console.log(respBody)
            // } else {
            //   console.log(respInfo.statusCode)
            //   console.log(respBody)
            // }
            resolve({ respBody, respInfo })
          }
        )
      })
    }
  } as RemoteCacheImplementation
})
