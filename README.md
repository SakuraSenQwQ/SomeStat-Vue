# SomeStat - 服务器探针

本仓库存储的是项目前端页面

# 开始

## 自己构建

首先克隆本仓库，或自行获取源码。

然后使用yarn安装

```
yarn
```

构建

```
yarn build
```

## 修改配置文件

请修改根目录下的`config.json`

# ServerAddress：

获取客户端状态的接口地址

# UpdateTime：

更新时间，前端多久进行一次更新请求

# BackGroundImage：

背景图片

# 仓库结构

```
src
├─comp //组件，例如页脚，服务器列表
├─page //页面
├─router //路由
└─stores //pinia
```
