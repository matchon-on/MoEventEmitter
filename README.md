# MoEventEmitter

## 麦琪 云对战平台的JavaScript消息引擎.

本消息引擎基于Olical的EventEmitter, 与Nodejs的消息引擎完全兼容. 可以为在浏览器运行的JavaScript增加消息订阅和触发功能. 麦琪对战云平台的JavaScript API使用此消息引擎,实现MatchOn对象上的消息订阅和触发服务, 以异步的方式获得MatchOn云对战平台的服务.


## 麦琪(MatchOn)云对战平台

麦琪云对战平台由画笔(上海)网络科技有限公司开发和运营, 为网络游戏开发者提供三大服务:

- 对战对手匹配
- 游戏消息通讯
- 键值对管理

游戏开发者不再需要自行开发对手匹配引擎, 消息通讯引擎和键值对管理后台,直接通过麦琪的API,就能立刻获得这些服务.

使用麦琪云对战平台,游戏开发者可以专注于游戏可玩性, 节省开发运营成本,加快开发速度.

进入[麦琪(MatchOn)](http://matchon.cn)官网了解详细信息.

## 使用

如果您是MatchOn API的用户, 您构造的MatchOn对象,已经继承了MoEventEmitter的所有函数,您可以直接在MatchOn对象上使用所有的消息功能.

如果您希望在其他地方使用本引擎作为消息引擎, 建议您直接使用[Olical/EventEmitter](https://github.com/Olical/EventEmitter).

## 依赖

本引擎运行时不需要任何外部依赖.但是如果您希望自行编译和部署本JavaScript库, 您需要Uglify作为最小化编译工具.

## 文档

请参考麦琪(MatchOn)[开发者文档](http://matchon.cn/docs.html)

## 最小化

您可以直接从这个仓库里获取已经最小化的JavaScript文件.如果您复制了源代码库,也可使用`tools/dist.sh`编译.

## 复制

您可以直接使用git clone命令复制这个仓库.
```
git clone git://github.com/Olical/EventEmitter.git
```

### NPM安装包

您可以直接通过NPM安装这个包:
```
npm install MoEventEmitter --save
```

## Unlicense

继承自原开发者, 这个项目也使用[Unlicense]版本政策.

>This is free and unencumbered software released into the public domain.
>
>Anyone is free to copy, modify, publish, use, compile, sell, or distribute this software, either in source code form or as a compiled binary, for any purpose, commercial or non-commercial, and by any means.
