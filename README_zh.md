[![npm package link](https://img.shields.io/npm/v/nx-remotecache-qiniu)](https://www.npmjs.com/package/nx-remotecache-qiniu)

# nx-remotecache-qiniu

中文文档 | [英文文档](./README.md)

`nx-remotecache-qiniu` 是一个创新的 `@nrwl/nx` 任务运行器，它利用[七牛云存储](https://www.qiniu.com/)来创建远程缓存。这种独特的方式允许所有团队成员和 CI 服务器共享同一个缓存，极大地提高了效率和协作性。

该包是基于 [nx-remotecache-custom](https://www.npmjs.com/package/nx-remotecache-custom) 构建的 🙌

## 功能特性

- 使用七牛云存储作为远程缓存；
- 使团队成员和 CI 服务器之间能共享缓存；
- 基于 nx-remotecache-custom 构建。

## 兼容性

| Nx 版本   | 远程缓存版本 |
| --------- | ------------ |
| >= 17.0.0 | >= 1.0.0     |

## 安装

在您的项目目录中运行以下命令安装：

```bash
npm install --save-dev nx-remotecache-qiniu
```

## 设置步骤

1. 在您的工作空间中添加 Nx [指南](https://nx.dev/getting-started/installation)

2. 运行 `npm install --save-dev nx-remotecache-qiniu`

3. （必需）获取七牛云密钥

   您可以在 [七牛云密钥](https://portal.qiniu.com/user/key?ref=developer.qiniu.com&s_path=%2Fkodo%2F1289%2Fnodejs) 上申请密钥。请注意，个人最多可以申请两个密钥。

   对于多用户，可以创建七牛账户并在创建的空间中设置共享权限。

   > 七牛云和区域信息
   >
   > - 七牛云：[七牛云存储](https://www.qiniu.com/products/kodo)
   > - 区域信息：[七牛云区域和终端点](https://developer.qiniu.com/kodo/1671/region-endpoint-fq)

4. 在七牛云中创建存储桶：

   - 访问 [七牛云存储桶创建](https://portal.qiniu.com/kodo/bucket) 来创建一个新的存储桶；
   - 为您的存储桶选择适当的区域。您可以参考 [七牛云区域和终端点](https://developer.qiniu.com/kodo/1671/region-endpoint-fq) 的区域和终端点信息。请记住记录区域 ID；
   - 存储桶创建成功后，您将收到一个七牛云的测试域名。

5. 自定义 CDN 域名：

   - 2.1（可选）如果您还没有域名，可以申请一个。
   - 2.2 域名备案：
     - 在中国进行备案，可以使用 [阿里云备案](https://beian.aliyun.com/) 或 [腾讯云备案](https://cloud.tencent.com/product/ba) 等服务。
   - 2.3 为您的域名配置 EV SSL 证书：
     - 确保您的域名具有扩展验证（EV）SSL 证书，以确保安全连接。
   - 2.4 配置自定义 CDN 域名的 CNAME 记录：
     - 在您域名的 DNS 设置中设置 CNAME 记录，以启用您的自定义 CDN 域名。

## 配置

`nx-remotecache-qiniu` 需要设置以下选项：

| 参数      | 描述                     | 环境变量             | `nx.json` 配置项 |
| --------- | ------------------------ | -------------------- | ---------------- |
| accessKey | 七牛云 accessKey         | `NXCACHE_ACCESS_KEY` | `accessKey`      |
| secretKey | 七牛云 secretKey         | `NXCACHE_SECRET_KEY` | `secretKey`      |
| bucket    | 存储桶                   | `NXCACHE_BUCKET`     | `bucket`         |
| domain    | 访问域名                 | `NXCACHE_DOMAIN`     | `domain`         |
| zone      | 区域                     | `NXCACHE_ZONE`       | `zone`           |
| private   | 私有桶选项（true/false） | `NXCACHE_PRIVATE`    | `private`        |
| expires   | 缓存过期时间（秒）       | `NXCACHE_EXPIRES`    | `expires`        |

---

您也可以使用以 `NXCACHE_` 为前缀的环境变量。以下是您请求的格式示例。

现在，让我们继续中文文档的编写。

`nx.json` 配置示例，配置 `nx.json` 如下：

```json
"tasksRunnerOptions": {
  "default": {
    "runner": "nx-remotecache-qiniu",
    "options": {
      "accessKey": "your_access_key",
      "secretKey": "your_secret_key",
      "bucket": "your_bucket_name",
      "domain": "your_domain",
      "zone": "your_zone",
      "private": true_or_false,
      "expires": expiration_time
    }
  }
}
```

## 运行

存储文件：

```
------------------------------------------------------------------------------
Stored output to remote cache: Nx Qiniu Cloud Storage - nx-remotecache-qiniu plugin
File: 14911649122709785563.tar.gz
------------------------------------------------------------------------------
```

检索文件：

```
------------------------------------------------------------------------------
Remote cache hit: Nx Qiniu Cloud Storage - nx-remotecache-qiniu plugin
File: 14911649122709785563.tar.gz
------------------------------------------------------------------------------

> nx run header:build  [remote cache]
```

## 高级配置

请参阅 [nx-remotecache-custom](https://github.com/NiklasPor/nx-remotecache-custom#advanced-configuration
