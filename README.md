[![npm package link](https://img.shields.io/npm/v/nx-remotecache-qiniu)](https://www.npmjs.com/package/nx-remotecache-qiniu)

# nx-remotecache-qiniu

[中文文档](./README_zh.md) | 英文文档

`nx-remotecache-qiniu` is an innovative task runner for `@nrwl/nx` that leverages [Qiniu Cloud](https://www.qiniu.com/) Storage to create a remote cache. This unique approach allows all team members and CI servers to share a single cache, greatly enhancing efficiency and collaboration.

This package was built with [nx-remotecache-custom](https://www.npmjs.com/package/nx-remotecache-custom) 🙌

## Features

- Utilizes Qiniu Cloud Storage as a remote cache.
- Enables cache sharing among team members and CI servers.
- Built with nx-remotecache-custom.

## Compatability

| Nx        | Remote Cache |
| --------- | ------------ |
| >= 17.0.0 | >= 1.0.0     |

## Installation

To install, run the following command in your project directory:

```bash
npm install --save-dev nx-remotecache-qiniu
```

## Setups

1. Add Nx to your workspace [guide](https://nx.dev/getting-started/installation)

2. `npm install --save-dev nx-remotecache-qiniu`

3. (Required)Obtaining Qiniu Cloud Keys

   You can apply for keys at [Qiniu Key Portal](https://portal.qiniu.com/user/key?ref=developer.qiniu.com&s_path=%2Fkodo%2F1289%2Fnodejs). Note that an individual can apply for up to 2 keys. For multiple users, create a Qiniu account and set sharing permissions in the created space.

   > Qiniu Cloud and Zone Information
   >
   > - Qiniu Cloud: [Qiniu Cloud Storage](https://www.qiniu.com/products/kodo)
   > - Zone Information: [Qiniu Cloud Region and Endpoint](https://developer.qiniu.com/kodo/1671/region-endpoint-fq)

4. Creating a Bucket in Qiniu Cloud:

   - Visit [Qiniu Cloud Bucket Creation](https://portal.qiniu.com/kodo/bucket) to create a new bucket.
   - Choose the appropriate region for your bucket. You can refer to the region and endpoint information at [Qiniu Cloud Region and Endpoint](https://developer.qiniu.com/kodo/1671/region-endpoint-fq). Remember to note the Region ID.
   - Upon successful creation of the bucket, you will receive a test domain from Qiniu Cloud.

5. Customizing CDN Domain:

   - 2.1 (Optional) Apply for a domain if you do not already own one.
   - 2.2 Domain Record Filing:
     - For filing in China, you can use services like [Aliyun (Alibaba Cloud) Filing](https://beian.aliyun.com/) or [Tencent Cloud Filing](https://cloud.tencent.com/product/ba).
   - 2.3 Configuring EV SSL Certificate for Your Domain:
     - Ensure your domain has an Extended Validation (EV) SSL Certificate for secure connections.
   - 2.4 Configuring CNAME Record for Custom CDN Domain:
     - Set up a CNAME record in your domain's DNS settings to enable your custom CDN domain.

## Configuration

The `nx-remotecache-qiniu` requires the following options to be set:

| Parameter | Description                        | Environment Variable | `nx.json`   |
| --------- | ---------------------------------- | -------------------- | ----------- |
| accessKey | Qiniu Cloud accessKey              | `NXCACHE_ACCESS_KEY` | `accessKey` |
| secretKey | Qiniu Cloud secretKey              | `NXCACHE_SECRET_KEY` | `secretKey` |
| bucket    | Storage Bucket                     | `NXCACHE_BUCKET`     | `bucket`    |
| domain    | Access Domain                      | `NXCACHE_DOMAIN`     | `domain`    |
| zone      | Zone                               | `NXCACHE_ZONE`       | `zone`      |
| private   | Private Bucket Option (true/false) | `NXCACHE_PRIVATE`    | `private`   |
| expires   | Cache Expiration Time (in seconds) | `NXCACHE_EXPIRES`    | `expires`   |

---

You can also use environment variables prefixed with `NXCACHE_`. Here's a format similar to the one you requested.

Now, let's move on to the Chinese version of the document.

`nx.json` Configuration Demo, configure `nx.json` as follows:

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

## Run it

Store files:

```
------------------------------------------------------------------------------
Stored output to remote cache: Nx Qiniu Cloud Storage - nx-remotecache-qiniu plugin
File: 14911649122709785563.tar.gz
------------------------------------------------------------------------------
```

Retreive files:

```
------------------------------------------------------------------------------
Remote cache hit: Nx Qiniu Cloud Storage - nx-remotecache-qiniu plugin
File: 14911649122709785563.tar.gz
------------------------------------------------------------------------------

> nx run header:build  [remote cache]
```

## Advanced Configuration

See [nx-remotecache-custom](https://github.com/NiklasPor/nx-remotecache-custom#advanced-configuration).

