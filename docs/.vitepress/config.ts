import { defineConfig } from 'vitepress';

export default defineConfig({
    title: 'NapLink',
    description: '现代化的 NapCat WebSocket 客户端 SDK',
    base: '/',  // 组织主页使用根路径

    themeConfig: {
        logo: '/logo.svg',

        nav: [
            { text: '指南', link: '/guide/index' },
            { text: 'API', link: '/api/index' },
            { text: 'GitHub', link: 'https://github.com/naplink/naplink' }
        ],

        sidebar: {
            '/guide/': [
                {
                    text: '开始',
                    items: [
                        { text: '简介', link: '/guide/index' },
                        { text: '快速开始', link: '/guide/getting-started' },
                        { text: '配置', link: '/guide/configuration' },
                    ]
                },
                {
                    text: '进阶',
                    items: [
                        { text: 'API 调用', link: '/guide/api' },
                        { text: '事件处理', link: '/guide/events' },
                        { text: '错误处理', link: '/guide/errors' },
                        { text: '最佳实践', link: '/guide/best-practices' },
                    ]
                },
                {
                    text: '参考',
                    items: [
                        { text: '架构设计', link: '/guide/architecture' },
                        { text: '与其他 SDK 对比', link: '/guide/comparison' },
                    ]
                }
            ],
            '/api/': [
                {
                    text: 'API 文档',
                    items: [
                        { text: '概览', link: '/api/index' },
                        { text: 'NapLink 类', link: '/api/naplink' },
                        { text: '配置选项', link: '/api/config' },
                        { text: '错误类型', link: '/api/errors' },
                        { text: 'OneBot API', link: '/api/onebot' },
                    ]
                }
            ]
        },

        socialLinks: [
            { icon: 'github', link: 'https://github.com/naplink/naplink' }
        ],

        footer: {
            message: 'Released under the MIT License.',
            copyright: 'Copyright © 2024 NapLink Contributors'
        },

        search: {
            provider: 'local'
        }
    }
});
