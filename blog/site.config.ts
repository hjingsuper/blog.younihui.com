import { defineSiteConfig } from 'valaxy'

export default defineSiteConfig({
  url: 'https://blog.younihui.com/',
  lang: 'zh-CN',
  title: '有你会的言语',
  author: {
    name: '有你会',
    status: {
      emoji: '🤪',
      message: '近视的人都是文艺的，因为在他们眼里，每一盏街灯都是蒲公英。​​​'
    }
  },
  description: '',
  subtitle: '',
  social: [
    {
      name: 'QQ 547504571',
      icon: 'i-ri-qq-line',
      color: '#12B7F5',
    },
    {
      name: 'GitHub',
      link: 'https://github.com/hjingsuper',
      icon: 'i-ri-github-line',
      color: '#6e5494',
    },
    {
      name: '哔哩哔哩',
      link: 'https://space.bilibili.com/4179393',
      icon: 'i-ri-bilibili-line',
      color: '#FF8EB3',
    },

  ],

  search: {
    enable: true,
  },

  sponsor: {
    enable: false,
    title: '',
    methods: [

    ],
  },
})
