## picgo-plugin-b2

*作者：Oto_G*

使 [PicGo](https://github.com/Molunerfinn/PicGo) 图床工具可以支持 [B2 Cloud Storage](https://www.backblaze.com/b2/cloud-storage.html) 对象存储（下简称 B2 ），由于 B2 对普通用户有免费 10GB 存储容量以及每日 1GB 的下载流量，非常适合用来做图床，但 PicGo 并没有相应的支持插件，所以 **picgo-plugin-b2** 应运而生

#### 使用

> 该插件是为命令行版 Picgo 开发（理论上对有 UI 版 PicGo 同样支持）
>
> 配合 [Typora](https://github.com/typora) + PicGo Cli 使用最佳

- PicGo CLI 下
  - 命令行下输入`picgo install b2`进行安装
  - 输入`picgo set uploader b2`初始化设置
    - 输入 B2 的 `applicationKeyId`
    - 输入 B2 的`applicationKey`

#### 鸣谢

[GitHub - xlzy520/picgo-plugin-smms-user: a plugin for picgo for SM.MS](https://github.com/xlzy520/picgo-plugin-smms-user)