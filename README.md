# 在线 Markdown 笔记编辑器

一款基于 Vue3 + Vite 开发的轻量化在线笔记工具，解决传统文本编辑器无法实时预览 Markdown 格式、数据易丢失等问题。以 Vibe Coding 模式独立开发，遵循"持久化 → 校验 → 预览 → 优化 → 体验"迭代路径逐步完善。

## 技术栈

`Vue3` `Vite` `marked` `highlight.js` `Zod` `localStorage` `CSS Variables`

## 核心功能

- **笔记 CRUD** — 新增、编辑、删除、切换，完整笔记生命周期管理
- **实时预览** — 基于 marked 解析 Markdown 语法，highlight.js 代码块高亮
- **自动保存 + 防抖** — localStorage 持久化写入，1.5s 防抖优化高频 IO，底部实时显示保存状态
- **暗色模式** — CSS 变量驱动亮/暗双主题，useTheme composable 管理状态，偏好持久化
- **Markdown 工具栏** — 一键插入粗体/斜体/标题/代码块/列表，支持光标位置精准定位与选中文本包裹
- **键盘快捷键** — Ctrl+N 新建笔记、Ctrl+S 即时保存
- **笔记搜索** — 侧栏实时过滤，按标题与内容模糊匹配，大小写不敏感
- **HTML 导出** — 笔记一键导出为 HTML 文件

## 项目特点

1. **模块化组件拆分** — 拆解 NoteList / NoteEditor / NotePreview 三大组件，统一 props/emits 单向数据流，低耦合高复用
2. **Zod 运行时校验** — safeParse 拦截空标题/空内容等非法数据写入，确保本地缓存数据一致性
3. **工程化性能优化** — 防抖机制控制写入频率，CSS 变量实现无闪烁主题切换
4. **纯前端架构** — 零后端依赖，开箱即用，适配主流浏览器

## 项目结构

```
src/
├── App.vue                    # 根组件：状态管理、快捷键注册
├── main.js                    # 入口
├── style.css                  # 全局样式 + CSS 变量（亮/暗主题）
├── composables/
│   └── useTheme.js            # 主题状态管理
└── components/
    ├── NoteList.vue           # 左侧：笔记列表 + 搜索
    ├── NoteEditor.vue         # 中间：编辑器 + 工具栏 + Zod 校验
    └── NotePreview.vue        # 右侧：marked 实时预览
```

## 快速启动

```bash
# 安装依赖
npm install

# 启动本地开发服务
npm run dev
```

## License

MIT
