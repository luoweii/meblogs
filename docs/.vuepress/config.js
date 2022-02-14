const moment = require('moment');

module.exports = {
  // 路径名为 "/<REPO>/"
  base: '/meblogs/',
  title: 'TypeScript4 文档',
  description: 'TypeScript4 最新官方文档翻译',
  theme: 'reco',
  locales: {
    '/': {
      lang: 'zh-CN'
    }
  },
  themeConfig: {
    lastUpdated: '上次更新', // string | boolean
    nav: [
      {text: '首页', link: '/'},
      {
        text: '冴羽的 JavaScript 博客',
        items: [
          {text: 'Github', link: 'https://github.com/mqyqingfeng'},
          {text: '掘金', link: 'https://juejin.cn/user/712139234359182/posts'}
        ]
      }
    ],
    subSidebar: 'auto',
    sidebar: [
      {
        title: '欢迎学习',
        path: '/',
        collapsable: false, // 不折叠
        children: [
          {title: "学前必读", path: "/"}
        ]
      },
      {
        title: "基础学习",
        path: '/handbook/ConditionalTypes',
        collapsable: false, // 不折叠
        children: [
          {title: "条件类型", path: "/handbook/ConditionalTypes"},
          {title: "泛型", path: "/handbook/Generics"}
        ],
      }
    ]
  },
  plugins: [
    [
      '@vuepress/last-updated',
      {
        transformer: (timestamp, lang) => {
          // 不要忘了安装 moment
          const moment = require('moment')
          moment.locale(lang)
          return moment(timestamp).fromNow()
        }
      }
    ]
  ]
}