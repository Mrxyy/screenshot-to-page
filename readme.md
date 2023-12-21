[en](./readme-en.md)
<h1 align="center"> screenshot-to-page</h1>

> **可以将截图、图片链接、绘制草图通过PT-4 Vision生成代码并换为页面，支持一键部署 ☁️**。

![demo1](https://cdn.glitch.global/fd139a45-4a65-41b6-9634-41617ab20cdc/a3b66837-cef4-447b-94b5-da0578b3c2eb.image.png?v=1703174068373)
![demo2](https://cdn.glitch.global/fd139a45-4a65-41b6-9634-41617ab20cdc/b018e8e9-c8ac-47e9-98b4-e914bc0c8485.image.png?v=1703174748987)

## 里程碑 🌊
- 使用nexjs进行了完全的重构，支持多个云平台简单部署。
	
## 区别 🏄🏿‍♂️
+ 更加适合js/ts技术栈开发人员快速上手。
+ 免费的无服务器的云平台部署。
+ 支持excalidraw绘制。

## 计划 🌄
+ 实现代码沙箱，支持现代化、工程化的编码方式 （很快就会到来啦，代码基本已经完成）。
+ 实现局部修改更新，类似V0。
+ i18n

## 部署 🪤
### docker 
``` sh
	docker run -p  3000:3000 jadenxiong/screenshot-to-page:0.12
```
### vercel
+ 点击右侧按钮开始部署：![Deploy with Vercel](https://vercel.com/button)
+ 部署完毕后，即可开始使用；
+ （可选）[绑定自定义域名](https://vercel.com/docs/concepts/projects/domains/add-a-domain)：Vercel 分配的域名 DNS 在某些区域被污染了，绑定自定义域名即可直连。
 
## 开发者 💪
``` sh
  # pnpm
	pnpm i；
	pnpm dev；
```
``` sh
	
	# yarn
	yarn；
	yarn dev；
```
## 感谢 🙏
+ 原仓库: [screenshot-to-code](https://github.com/abi/screenshot-to-code/blob/main/README.md) 
+ fork仓库: [ant-codeAI](https://github.com/sparrow-js/ant-codeAI) 
## 相关 🌲
+ [local-mk-editor-in-browser](https://github.com/Mrxyy/local-mk-editor-in-browser) 👷
+ [chat-query](https://github.com/Mrxyy/chat-query.git) 📖