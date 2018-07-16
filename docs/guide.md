# 开发者文档
## 安装
1. 克隆仓库 `git clone https://github.com/xgfe/ui-xg.git`
2. 安装依赖包 `cd ui-xg && npm install`

## 依赖
1. Node : v0.12.7 或更高（不超过4.0）
2. Gulp : v3.8.11 或更高，允许 `npm install gulp -g` 进行安装
3. sass : v3.4.15 ，使用sass作为css预编译工具
4. angular : v1.2.25
5. bootstrap : v3.3.6

## 目录结构说明

```
├─ dist/              生成目录，包括js和css文件
  ├─ js/              最终生成的js文件，包括压缩和未压缩版
  ├─ css/             最终生成的css文件，包括压缩和未压缩版
├─ docs/              使用文档以及开发者文档等
  ├─ guide.md         开发者文档 
  ├─ start.md         使用文档
├─ scene/             场景示例
  ├─ .../
├─ misc/              和gulp构建相关或文档平台构建相关的文件
├─ src/               所有组件的源码
  ├─ foo/             以foo示例
    ├─ test/          测试相关文件
    ├─ docs/          文档相关的文件
      ├─ readme.md    组件使用介绍文档
      ├─ index.html   组件示例的html文件
      ├─ script.js    组件示例的js文件
      ├─ style.css    组件示例使用的额外样式
    ├─ templates/     组件DOM模板
    ├─ foo.js         组件主要的控制文件
    ├─ foo.scss       组件的样式
├─ .eslintrc          Eslint配置文件
├─ .gitignore         
├─ .htmlhintrc        xg-htmlhint配置文件
├─ gulpfile.js        gulp构建文件
├─ karma.conf.js      karma配置
├─ package.json     
├─ README.md
```

## 新增组件
1. 运行`gulp create -bar`创建组件的基础脚手架，可同时创建多个，如`gulp create -a -b`
2. 在`src/bar`目录下开发新的组件，组件命名为`ui.xg.bar`，每一个组件是一个单独的模块，组件的依赖关系通过angular的模块依赖实现。每一个组件的`restrict`选项必须有`E`属性，即组件可以作为标签使用
3. 完成组件的基本功能之后在`src/bar/test`目录下生成的测试文件`bar.spec.js`中完成测试
4. 在`src/bar/docs`目录下生成的文件中完成文档编写，具体编写规范参考<a ui-sref="app.directiveDocs" href="directive-docs.md">组件文档编写规范</a>
	- `readme.md`：组件说明文件
	- `script.js`：示例的js代码，在其中编写展示组件功能的代码
	- `index.html`：组件示例的html代码
	- `style.css`：默认没有生成，如果在示例中需要有额外的css样式，可以创建该文件并添加样式
5. 执行命令`gulp serve -bar`启动本地开发模块，在[localhost:8080](http://localhost:8080)运行新创建的组件
    - 注：更改组件的文件会自动重新构建，刷新浏览器就可以看到效果，组件`docs`目录下的示例代码目前无法做到自动构建
6. 在项目根目录下执行`gulp`即可对所有组件进行测试并在`dist`目录下构建最终的文件。其他相关task如下
	- `gulp test`：执行测试命令，测试使用的是`karma+jasmine`
	- `gulp build`：建议在测试通过之后执行，用于构建最终的js和css文件
	- `gulp clean`：清空构建目录
7. `gulp`命令执行之后可以自动生成文档网站，生成的文档平台在`dist/docs`目录下，该目录并不被提交，主要用于展示文档网站