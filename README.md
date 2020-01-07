# nextjs+antd+redux
### 1 集成css
next 中默认不支持直接 import css 文件，它默认为我们提供了一种 css in js 的方案，所以我们要自己加入 next 的插件包进行 css 支持
```shell
$ npm install @zeit/next-css
```
如果项目根目录下没有的话，我们新建一个next.config.js，然后加入如下代码：
```javascript
const withCss = require('@zeit/next-css')

if (typeof require !== 'undefined') {
  require.extensions['.css'] = file => {}
}

// withCss得到的是一个next的config配置
module.exports = withCss({})
```
### 2 antd按需加载
安装按需加载插件
```shell
$ npm install babel-plugin-import
```
在根目录下新建.babelrc文件
```json
{
  "presets": ["next/babel"],
  "plugins": [
    [
      "import",
      {
        "libraryName": "antd"
      }
    ]
  ]
}
```
这个 babel 插件的作用是把
```javascript
import { Button } from 'antd'
```
解析成
```javascript
import Button from 'antd/lib/button'
```

### 3 引入redux
>参考nextjs官方demo：[with-redux](https://github.com/zeit/next.js/tree/canary/examples/with-redux) &  [with-redux-thunk](https://github.com/zeit/next.js/tree/canary/examples/with-redux-thunk)

#### 3.1 Provider
想要使用redux，必须用Provider包裹根组件。nextjs默认隐藏了根组件的实现，使用App组件初始化页面，我们可以通过[重写App组件](https://nextjs.org/docs/advanced-features/custom-app)实现redux的Provider功能。
```javascript
/* ./pages/_app.js */
import App from 'next/app';
import React from 'react';
import withReduxStore from '../lib/redux';
import { Provider } from 'react-redux';

class MyApp extends App {
  render() {
    const { Component, pageProps, reduxStore } = this.props
    return (
      <Provider store={reduxStore}>
        <Component {...pageProps} />
      </Provider>
    )
  }
}

export default withReduxStore(MyApp);
```
#### 3.2 store
通过判断是否有window对象来区分SSR和CSR：如果是SSR则直接创建store；如果是SCR，判断是否已存在store，不存在就创建store，已存在则直接返回。然后使用高阶函数withReduxStore将store自动注入到Provider中
创建store：
```javascript
/* ./store/store.js */
export const initializeStore = (preloadedState = initialState) => {
  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware())
  )
}
```
注入store：
```javascript
/* ./lib/redux.js */
import React from 'react'
import { initializeStore } from '../store/store.js'

const isServer = typeof window === 'undefined'
const __NEXT_REDUX_STORE__ = '__NEXT_REDUX_STORE__'

function getOrCreateStore(initialState) {
  if (isServer) {
    return initializeStore(initialState, isServer);
  }

  if (!window[__NEXT_REDUX_STORE__]) {
    window[__NEXT_REDUX_STORE__] = initializeStore(initialState, isServer);
  }
  return window[__NEXT_REDUX_STORE__]
}

export default App => {
  return class AppWithRedux extends React.Component {
  
    constructor(props) {
      super(props)
      this.reduxStore = getOrCreateStore(props.initialReduxState)
    }

    render() {
      return <App {...this.props} reduxStore={this.reduxStore} />
    }
  }
}
```

#### 3.3 使用store
组件可以使用redux-react中的connect方法将store注入到props中
```javascript
/* ./pages/index.js */
import { connect } from 'react-redux';

function Index(props) {
  return (
    <Layout>
      <Header className="header">
        <span className="logo">开课吧</span>
      </Header>
      <Layout className="main">
        <GoldContent list={props.gold.list}/>
        <GithubContent list={props.github.list}/>
      </Layout>
    </Layout>
  );
}

export default connect()(Index);
```
也可以使用useSelector，详见./components/GoldContent.js

#### 3.4 服务端初始化数据 [getInitialProps](https://nextjs.org/docs/api-reference/data-fetching/getInitialProps)
设置组件的静态方法getInitialProps开始服务端数据渲染，getInitialProps应是一个async函数，返回值是要初始化的store。
```javascript
/* ./pages/index.js */
Index.getInitialProps = async ({ reduxStore }) => {
  await reduxStore.dispatch(getGoldList);
  await reduxStore.dispatch(getGitList);

  return reduxStore.getState();
}
```
#### 3.5 distapch
在客户端使用redux-react的useDispatch方法修改store，详见./components/GoldContent.js。
`注：正常来说通过connect注入到props中的dispatch也是可以修改store的，但是测试中并不好用，后面有时间再解决`

###4 代理设置
nextjs作为node中间层，并不会真正的提供api接口，客户端请求接口需要发到另外的服务器上。为了解决这个问题，需要再node层做一个代理，避免跨域。

1.在项目根目录下新建 [server.js](https://nextjs.org/docs/advanced-features/custom-server) 文件，写入以下代码
```javascript
// server.js
const express = require('express')
const next = require('next')
const proxyMiddleware = require('http-proxy-middleware')

const devProxy = {
  '/resources': {
    target: 'https://extension-ms.juejin.im/', // 端口自己配置合适的
    changeOrigin: true
  }
}

const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({
  dev
})
const handle = app.getRequestHandler()

app.prepare()
  .then(() => {
    const server = express()

    if (dev && devProxy) {
      Object.keys(devProxy).forEach(function (context) {
        server.use(proxyMiddleware(context, devProxy[context]))
      })
    }

    server.all('*', (req, res) => {
      handle(req, res)
    })

    server.listen(port, err => {
      if (err) {
        throw err
      }
      console.log(`> Ready on http://localhost:${port}`)
    })
  })
  .catch(err => {
    console.log('An error occurred, unable to start the server')
    console.log(err)
  })
```

2.需要改造一下store，使用中间件thunk的withExtraArgument方法传入第三个参数
```javascript
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from 'redux-thunk';
import { createStore, applyMiddleware, combineReducers } from 'redux';
import axios from 'axios';

// 服务端直接请求接口
const serverAxios = axios.create({
  baseURL: 'https://extension-ms.juejin.im/'
});

// 客户端请求到node中间层，再有node中间层代理转发到目标服务器
const clientAxios = axios.create({
  baseURL: '/'
});

const initialState = {};

// 初始化store时，传入isServer区分服务端和客户端
export const initializeStore = (preloadedState = initialState, isServer) => {

  return createStore(
    reducer,
    preloadedState,
    composeWithDevTools(applyMiddleware(thunk.withExtraArgument(isServer ? serverAxios : clientAxios)))
  )
}

```

3.修改package.json
```json
"scripts": {
  "dev": "node server.js", //原有命令
  "build": "next build",
  "start": "NODE_ENV=production node server.js"
}
```

----------
最后，有关SSR实现原理见[react-ssr-text](https://github.com/wangbz-github/react-ssr-test)
Demo来源-->[掘金酱](https://e.xitu.io/)（使用chrome无痕模式打开）
