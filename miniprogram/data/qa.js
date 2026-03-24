const QA = [
  {
    id: 1, cat: 'API与计费',
    q: 'API rate limit reached / 已达到 API 速率限制，这是什么情况，怎么解决？',
    a: '您订阅的套餐达到了请求限额，等待 5 小时后配额自动刷新。\n\n📌 可在「方舟控制台 → 开通管理」查看配额详情及具体刷新时间。\n\n这不是账号异常，是订阅套餐的频率限制，等一等就恢复了。',
    steps: []
  },
  {
    id: 2, cat: 'API与计费',
    q: '购买的 ArkClaw 套餐到期如何续费以及如何升级？',
    a: '',
    steps: [
      'Coding Plan Lite：免费获得 7 天体验，到期 ArkClaw 被删除，数据保留 24 小时。',
      'Coding Plan Pro：可畅享全部服务，到期后数据同样保留 24 小时。',
      '续费/升级：访问「方舟 Coding Plan 活动」或「方舟控制台 → 开通管理」，升级后立即生效。'
    ]
  },
  {
    id: 3, cat: '安装部署',
    q: '如何安装火山龙虾？有没有视频手把手教学？',
    a: '🎬 视频版：bytedance.feishu.cn/minutes/obcnaqyk4yr91i4u9l2986dk\n\n📖 文档版：「立省 500！30 分钟把 OpenClaw 在飞书上配到可用」\n\n推荐先看视频，跟着操作，30 分钟内可以配好。',
    steps: []
  },
  {
    id: 4, cat: '安装部署',
    q: '从 OpenClaw 2026.3.2 内置社区版插件升级到最新官方飞书插件，是否可以直接安装覆盖？',
    a: '✅ 可以直接覆盖安装，不会有冲突。新插件会自动禁用原来的内置插件。\n\n⚠️ 若安装时提示版本不匹配，需确认 OpenClaw 版本符合要求，或回滚到兼容版本。安装后若插件加载失败，可能是缺少依赖，需安装依赖并重新启动服务。',
    steps: []
  },
  {
    id: 5, cat: '权限问题',
    q: '云文档、多维表格权限全部打开，为何机器人仍提示无权限或返回 400/404 报错？',
    a: '⚠️ 原因：旧版飞书插件对文档操作有 Bug。\n\n✅ 解决方案：更新飞书插件到最新版本即可。',
    steps: []
  },
  {
    id: 6, cat: '飞书配置',
    q: '触发 /feishu auth 后，授权卡片弹不出来，或点击后提示过期，如何解决？',
    a: '',
    steps: [
      '飞书对话里输入 /feishu doctor 检查授权状态',
      '前往「开放平台 → 权限管理 → 用户身份权限」确认权限全部开通',
      '执行 feishu-plugin-onboard update 更新插件，再重启 OpenClaw',
      '云服务器需检查防火墙端口是否开放（如 Web UI 面板端口）',
      '若 openclaw.json 报「Unrecognized key: feishu」，执行 openclaw doctor --fix'
    ]
  },
  {
    id: 7, cat: '飞书配置',
    q: '飞书个人版用户如何将 ArkClaw 拉入外部群聊？为何群成员添加里搜不到机器人？',
    a: '⚠️ 飞书个人版无法将应用拉入外部群，只能进只有自己一个人的内部群。\n\n💡 机器人不是"成员"，需要进入「群聊管理 → 机器人」里添加，而不是搜索成员。',
    steps: []
  },
  {
    id: 8, cat: '报错修复',
    q: '机器人能创建飞书云文档和多维表格，但无法往里面写入内容（报错 Unexpected non-whitespace character after JSON）',
    a: '🔴 原因1：权限缺失 — 登录飞书开放平台 → 应用管理 → 权限管理，添加 docx:document、drive:drive、docx:document.block:convert 并提交审核。\n\n🟡 原因2：模型理解偏差 — 换个指令让它重新尝试，或更换更好的模型。',
    steps: []
  },
  {
    id: 9, cat: '飞书配置',
    q: '事件配置时一直提示「未检测到应用连接信息」，无法保存长连接模式怎么处理？',
    a: '原因：龙虾未启动，或消息渠道配置有问题。\n\n执行命令：\nopenclaw gateway status\nopenclaw logs --follow\n\n💡 返回「飞书消息渠道配置成功」提示才算真正完成。',
    steps: []
  },
  {
    id: 10, cat: '使用技巧',
    q: '在飞书群聊中，如何让机器人的回复在一个消息中流式追加，而不是分成多条发送？',
    a: '在飞书聊天框直接发送以下命令：\n\nopenclaw config set channels.feishu.streaming true\nopenclaw config set channels.feishu.footer.elapsed true\nopenclaw config set channels.feishu.footer.status true\n\n📌 也可修改 channels.feishu.textChunkLimit（默认 2000，最高 3000）增加单条消息长度。',
    steps: []
  },
  {
    id: 11, cat: '报错修复',
    q: '群聊中因拉取历史消息过多，报错 400 Total tokens of image and text exceed max message tokens',
    a: '原因：图片+文本编码后的总 token 数超过了模型上下文限制。\n\n✅ 输入 /new 开启新对话，或重启网关清除上下文。等待 5 小时后配额也会刷新。',
    steps: []
  },
  {
    id: 12, cat: '报错修复',
    q: '切换为 Kimi-k2-thinking 或 Doubao 模型后，OpenClaw 仍显示 ark-code-latest 甚至报 404 UnsupportedModel',
    a: '完成模型修改后，执行以下命令重启服务使配置生效：\n\nopenclaw gateway restart',
    steps: []
  },
  {
    id: 13, cat: '报错修复',
    q: '配置 API Key 后一直报错 401 The API key format is incorrect 或 No API key found for provider anthropic',
    a: '方案1：命令行重新配置\n\nopenclaw config set models.providers.ark.apiKey "你的新API Key"\nopenclaw gateway restart',
    steps: [
      '方案2 Web UI：执行 openclaw dashboard 打开 Web UI',
      'Settings → Config → Authentication → Raw 模式',
      '找到 models.providers.ark.apiKey 字段，替换为正确的 API Key，保存重启'
    ]
  },
  {
    id: 14, cat: 'API与计费',
    q: '购买了火山引擎 Coding Plan，到底是按天、按次数，还是按 Token 消耗计算？',
    a: '💡 计费方式：按订阅周期 + 请求次数计费。不是按天、也不是按 Token，订阅期内有固定的请求次数配额。\n\n具体配额查看「方舟控制台 → 开通管理 → 套餐概览」。',
    steps: []
  },
  {
    id: 15, cat: '报错修复',
    q: '启动时提示网关服务启动失败，RPC 连接被拒绝（unauthorized 或 ECONNREFUSED），如何排查？',
    a: '',
    steps: [
      '执行 systemctl status clawdbot-gateway 查看状态，失败则 sudo systemctl start clawdbot-gateway',
      '验证端口：lsof -i :8080（Mac/Linux）或 netstat -ano | findstr :8080（Windows）',
      '核对防火墙/安全组已允许 111、8080 端口出入流量',
      '快速修复：openclaw gateway restart 或 openclaw doctor'
    ]
  },
  {
    id: 16, cat: '安装部署',
    q: 'Windows npm 安装报 ENOENT syscall spawn git，Mac 报 EACCES: permission denied，如何修复？',
    a: 'Windows：安装 Git for Windows，勾选「添加到系统 PATH」，重启终端后重新安装。\n\nMac 执行：\nmkdir -p ~/.npm-global && npm config set prefix \'~/.npm-global\' && echo \'export PATH=~/.npm-global/bin:$PATH\' >> ~/.zshrc && source ~/.zshrc\n\n💡 建议 Node.js 使用 18 及以上版本。',
    steps: []
  },
  {
    id: 17, cat: '报错修复',
    q: 'openclaw.json 报错 Unrecognized key: "feishu"，如何使用 openclaw doctor --fix 修复？',
    a: '执行：\nopenclaw doctor --fix\n\n如果自动修复不成功：手动打开配置文件，搜索 feishu 关键词，找到对应行直接删除；或用 Claude Code 辅助修复。',
    steps: []
  },
  {
    id: 18, cat: '安装部署',
    q: '在火山引擎 ECS 云服务器部署后，无法打开 Web UI 面板，是否需要配置防火墙端口透传？',
    a: '龙虾网关默认监听本地地址，外部访问需要两步：',
    steps: [
      '在云服务器安全组中开放对应端口（如 8080）',
      '配置本地代理转发，将外部流量转发到本地地址'
    ]
  },
  {
    id: 19, cat: '飞书配置',
    q: '在终端执行配对命令后，飞书端没有弹出确认框，导致配对码失效过期，如何重新触发？',
    a: '方法1 重启网关：\nopenclaw gateway restart\n给机器人发任意消息后执行：\nopenclaw pairing approve feishu [新配对码]\n\n方法2 重启飞书渠道：\nopenclaw channels disable feishu\nopenclaw channels enable feishu\n\n⚠️ 配对码有效期 5-10 分钟。如仍无效，执行 openclaw config clear 清除旧配对缓存。',
    steps: []
  },
  {
    id: 20, cat: '使用技巧',
    q: '如何让龙虾具备浏览器能力去读取小红书、B 站评论、微信公众号等，并绕过反爬验证码？',
    a: '⚠️ 云端龙虾很难实现反爬绕过。\n\n💡 本地龙虾可以使用浏览器 relay 控制，模拟真人操控浏览器来读取这些平台内容。',
    steps: []
  },
  {
    id: 21, cat: '报错修复',
    q: '龙虾调用即梦 (Jimeng) API 生图后，为何只返回 Base64 代码或本地路径，而不是直接发图到飞书？',
    a: '',
    steps: [
      '确认飞书机器人已开通 im:message、file:write 等权限',
      '将 Base64 转为二进制流，通过 /api/v2/files/upload 上传到飞书，获取 file_key',
      '构造飞书媒体消息：{"msg_type":"image","content":{"image_key":"file_key"}}'
    ]
  },
  {
    id: 22, cat: '飞书配置',
    q: '飞书如何配置多个龙虾？或者多 Agent？',
    a: '⚠️ 多 Agent 不稳定，新手没必要配置多个！先玩一个，会了再考虑多个。\n\n参考：「OpenClaw 多 Agent 飞书 Bot 完整配置指南」',
    steps: [
      '通过命令行创建独立智能体，每个拥有独立工作目录',
      '在 gateway 配置中为每个智能体设置独立的网关和名称映射',
      '为每个智能体单独创建飞书企业自建应用，分别获取 appId 和 appSecret'
    ]
  },
  {
    id: 23, cat: '使用技巧',
    q: '机器人如何直接读取群里上传的 Word 附件、.xlsx 表格，以及飞书妙记的语音转录文本？',
    a: 'Word (.docx)：\nfrom docx import Document\ndef read_word(path):\n    doc = Document(path)\n    return \'\\n\'.join([p.text for p in doc.paragraphs])\n\nExcel (.xlsx)：\nimport pandas as pd\nprint(pd.read_excel("file.xlsx").to_string())\n\n⚠️ 飞书妙记需申请 minutes:readonly 权限。推荐：手动导出妙记文本 → 上传为 .txt/.docx → Bot 读取',
    steps: []
  },
  {
    id: 24, cat: '报错修复',
    q: '使用 clawhub 下载安装技能时，一直报 Rate limit exceeded，有什么方式可以绕过？',
    a: '',
    steps: [
      '暂停 5-10 分钟后，openclaw skills install [技能名] 重试，一次只装一个',
      '从 ClawHub 网站直接下载 ZIP，解压到 ~/.openclaw/skills 目录（绕过限流）',
      '切换手机热点或其他网络，用不同 IP 重试'
    ]
  },
  {
    id: 25, cat: '飞书配置',
    q: '在同一个 OpenClaw 实例下配置多个飞书机器人时，为何第二个机器人会把第一个顶替下线？',
    a: '⚠️ 多个机器人使用了同一个飞书应用的凭证 — 飞书限制同一应用仅能保持一个实例在线。\n\n✅ 正确做法：为每个智能体单独创建飞书企业自建应用，分别获取各自的 appId 和 appSecret，确保唯一绑定。',
    steps: []
  },
  {
    id: 26, cat: '使用技巧',
    q: '把多个龙虾机器人拉到同一个飞书群里，如何让它们互相 @ 进行工作委派？',
    a: '⚠️ 飞书群里的机器人互相之间看不到对方。此问题目前没有最终确认的解决方案，社群正在研究中。',
    steps: []
  },
  {
    id: 27, cat: '使用技巧',
    q: '头一天设定好的人设和定时任务，断网或重启网关后完全失忆，如何让机器人正确读取 SOUL.md、MEMORY.md？',
    a: '✅ 正常情况下不会出现此问题，配置文件在会话开始时会自动读取。\n\n⚠️ 若出现失忆，大概率是重置（reset）导致配置文件丢失，而不是重启问题，需要重新配置。',
    steps: []
  },
  {
    id: 28, cat: '使用技巧',
    q: '群聊中，如何避免子 Agent 的中间思考过程（如「让我查一下」）泄漏到群里？',
    a: '💬 直接告诉龙虾：「帮我禁用思考过程的中间输出，只显示最终结果」，它会自动调整配置文件。',
    steps: []
  },
  {
    id: 29, cat: '飞书配置',
    q: '飞书 OpenClaw 机器人可以加入群组吗？',
    a: '✅ 内部群：直接在「群聊管理 → 机器人」中添加，无限制。\n\n⚠️ 外部群：需要企业认证，企业版需管理员开启应用权限。',
    steps: []
  },
  {
    id: 30, cat: '飞书配置',
    q: '如何修改飞书机器人在群内的回复方式（只 @ 回复 / 全部回复 / 指定群回复）？',
    a: '模式1 只有 @ 才回复：\nopenclaw config set channels.feishu.requireMention true --json\n\n模式2 所有消息都回复（大群慎用！需先开通「获取群组中所有消息」权限）：\nopenclaw config set channels.feishu.requireMention false --json\n\n模式3 指定群 @ 才回复：\nopenclaw config set channels.feishu.requireMention false --json\nopenclaw config set channels.feishu.groups.oc_xxxxxxxx.requireMention true --json',
    steps: []
  },
  {
    id: 31, cat: '权限问题',
    q: '为什么开通了读取权限，龙虾机器人还是没有消息输入框？',
    a: '',
    steps: [
      '确认已添加机器人权限',
      '确认回调里的事件已开启',
      '确认回调里的长链接已点击配置保存',
      '开发者后台 → 权限管理，确认已开通 im:message.p2p_msg:readonly',
      '确认应用已发布，使以上配置生效'
    ]
  },
  {
    id: 32, cat: 'API与计费',
    q: '为什么我只跟龙虾说了十几句话，就限额不让用了？',
    a: '⚠️ 一句话 ≠ 一条请求。一条用户指令背后可能触发几十到几百条请求。\n\n例：9.9 Lite 套餐配额是「5小时内不超过 1200 条请求」，十几句对话很容易达到限额。开启流式输出也会加剧消耗。\n\n查看限额：「方舟控制台 → 开通管理」',
    steps: []
  },
  {
    id: 33, cat: '报错修复',
    q: 'ArkClaw 重启中，正在尝试重连，超过 2 分钟未恢复，建议自动修复实例',
    a: '',
    steps: [
      '打开 ArkClaw 右侧「设置」面板',
      '点击「重新初始化 ArkClaw」选项',
      '等待 1-2 分钟，界面重置后重新配置（也可选择重新安装 OpenClaw）'
    ]
  },
  {
    id: 34, cat: '使用技巧',
    q: '龙虾给我发一句话，ArkClaw 网页也发一句，这个是正常的吗？',
    a: '✅ 正常。Channel（飞书等渠道）和 Web UI 的对话是同步的，飞书里私聊对应 agent:main:main，两端消息互通是预期行为。',
    steps: []
  },
  {
    id: 35, cat: '报错修复',
    q: '龙虾隔一会就给我发配对码，是什么情况，如何解决？',
    a: '',
    steps: [
      '先重启网关：告诉龙虾「重启下网关」，或执行 openclaw gateway restart',
      '如果恢复正常就好了',
      '如果还不正常，重新配置飞书渠道'
    ]
  },
  {
    id: 36, cat: '飞书配置',
    q: '创建飞书机器人后，发现机器人界面没有聊天输入框，也看不到配对码',
    a: '⚠️ 若仍无配对码，说明前面链路没打通，优先排查：应用未发布、事件订阅没配好、Gateway 未启动。',
    steps: [
      '确认应用已发布（不是「草稿」或「审核中」）',
      '确认消息渠道配置完整：App ID、App Secret、事件订阅、消息渠道 四项都要配',
      '确认 Gateway 在运行：systemctl status --user openclaw-gateway.service',
      '在飞书给机器人发 /feishu auth，正常会回复含 pairing approve 的配对信息'
    ]
  },
  {
    id: 37, cat: '权限问题',
    q: '遇到反复授权请求怎么处理？ArkClaw 总是反复弹出授权请求',
    a: '⚡ 一次性完成所有授权：直接给 ArkClaw 发「我想获取所有权限」',
    steps: [
      '飞书开放平台 → 你的应用 → 权限管理 → 搜索所需权限 → 「开通/添加」',
      '权限添加后必须点击「申请发布」或「全员可见」，否则权限不生效',
      '确认「可用权限」和「已开通权限」两栏都有对应权限'
    ]
  },
  {
    id: 38, cat: '报错修复',
    q: '为什么总报错：Agent failed before reply: No API key found for provider "anthropic"？',
    a: '⚠️ 本地安装时认证配置错误，小白建议跟着教程「立省 500！30 分钟把 OpenClaw 在飞书上配到可用」重新安装走一遍。\n\n也可参考 GitHub Issues #19961 或 #5181',
    steps: []
  },
  {
    id: 39, cat: '报错修复',
    q: '配置 OpenClaw 时报错 404 The model or endpoint xxx does not exist or you do not have access to it',
    a: '',
    steps: [
      '检查两个配置文件的 baseurl 是否一致：~/.openclaw/openclaw.json（全局）和 ~/.openclaw/agents/main/agent/models.json（优先级更高）',
      '两者不一致时，先删除 ~/.openclaw/agents/main/agent/models.json',
      '重新配置 openclaw.json，保存后执行 openclaw gateway restart'
    ]
  },
  {
    id: 40, cat: '权限问题',
    q: '创建龙虾提示「暂无创建 ArkClaw 的权限，请确认账号是否拥有绑定了 ECSClawRolePolicy 策略的 ECSClawRole 角色」',
    a: '原因：子账号没有充分授权。',
    steps: [
      '创建独立的主账号',
      '前往访问控制，添加 ECSClawRole 角色',
      '绑定 ECSClawRolePolicy 策略'
    ]
  },
  {
    id: 41, cat: '报错修复',
    q: 'ArkClaw 重启中，正在尝试重连；若超过 2 分钟未恢复，建议自动修复实例（同 #33）',
    a: '💡 参考第 33 题的解决方案：使用「重新初始化 ArkClaw」按钮，或重新安装 OpenClaw。',
    steps: []
  },
  {
    id: 42, cat: '安装部署',
    q: '报错 Command Line Tools (CLT) are missing，必须先安装 CLT 才能安装 Homebrew',
    a: '在终端执行：\nxcode-select --install\n\n按提示完成安装后，执行 xcode-select -p 验证，再重新运行安装包。',
    steps: []
  },
  {
    id: 43, cat: '报错修复',
    q: '报错「无法获取用户身份，请在飞书对话中使用此命令」',
    a: '',
    steps: [
      '在终端执行：openclaw channels list，检查是否显示 Auth providers: none',
      '如果是该问题，执行：feishu-plugin-onboard install',
      '运行完成后重启：openclaw gateway restart',
      '返回飞书机器人聊天页面，输入 /feishu auth 授权即可'
    ]
  },
  {
    id: 44, cat: '报错修复',
    q: '报错「抱歉，你的消息因安全策略被拦截了，请修改内容后重新提交」',
    a: '✅ 方法1：修改消息内容，去除可能被判定为敏感的信息\n\n✅ 方法2：更换大模型，在 CodePlan 页面手动切换，「方舟控制台 → 开通管理」可查看可用模型',
    steps: []
  },
  {
    id: 45, cat: '权限问题',
    q: '龙虾机器人各种权限不足问题，怎么快速解决？',
    a: '⚡ 最快方式：直接告诉 AI：「我想授予所有用户权限」\n\nArkClaw 会一次性完成所有飞书工具权限的授予，无需逐项手动开通。',
    steps: []
  }
]

const CATS = ['全部', '报错修复', '飞书配置', '权限问题', 'API与计费', '安装部署', '使用技巧']

const RESOURCES = [
  {
    title: '🚀 各平台部署入口',
    items: [
      { badge: '推荐', name: '🌋 火山引擎 ArkClaw', desc: '9.9 Lite 套餐 · 性价比最高', url: 'https://www.volcengine.com/product/arkclaw' },
      { badge: '稳定', name: '🐧 腾讯云', desc: 'cloud.tencent.com/act/pro/openclaw', url: 'https://cloud.tencent.com/act/pro/openclaw' },
      { badge: '稳定', name: '☁️ 阿里云', desc: 'aliyun.com/activity/ecs/clawdbot', url: 'https://www.aliyun.com/activity/ecs/clawdbot' },
      { badge: '国产', name: '🤖 智谱 AutoClaw', desc: 'autoglm.zhipuai.cn/autoclaw', url: 'https://autoglm.zhipuai.cn/autoclaw/' },
      { badge: '国产', name: '🌙 Kimi Claw', desc: 'kimi.com/bot', url: 'https://www.kimi.com/bot' },
      { badge: '国产', name: '🔵 百度云', desc: 'cloud.baidu.com', url: 'https://cloud.baidu.com/product/BCC/moltbot.html' },
      { badge: '国产', name: '🟠 华为云', desc: 'huaweicloud.com', url: 'https://www.huaweicloud.com/solution/implementations/deploying-openclaw-agents.html' },
      { badge: '海外', name: '🤖 Copaw（阿里通义）', desc: 'copaw.agentscope.io', url: 'https://copaw.agentscope.io/' }
    ]
  },
  {
    title: '📚 学习教程',
    items: [
      { badge: '官方', name: 'OpenClaw 官方文档', desc: 'docs.openclaw.ai', url: 'https://docs.openclaw.ai' },
      { badge: '社区', name: 'WaytoAGI 教程', desc: 'waytoagi.feishu.cn', url: 'https://waytoagi.feishu.cn/wiki/CCR4wl3upi6dF9kVE5YcAcGcnlU' },
      { badge: '社区', name: '万象 AI 教程', desc: 'yunyinghui.feishu.cn', url: 'https://yunyinghui.feishu.cn/wiki/WhelwZnxQi55mpkOzatc3Xran5b' },
      { badge: '中文', name: 'OpenClaw 中文社区', desc: 'clawd.org.cn', url: 'https://clawd.org.cn/' },
      { badge: '中文', name: 'OpenClaw 101', desc: 'openclaw101.dev/zh', url: 'https://openclaw101.dev/zh' },
      { badge: '社区', name: 'InStreet AI Agent 社区', desc: '由 Agent 发帖互动的中文社区', url: 'https://instreet.coze.site/' }
    ]
  },
  {
    title: '🐦 飞书相关资源',
    items: [
      { badge: '必看', name: '飞书官方配置文档', desc: 'larkcommunity.feishu.cn', url: 'https://larkcommunity.feishu.cn/wiki/LDmXwEVhJitBa5kU0mjc16VKneb' },
      { badge: '插件', name: '飞书插件下载', desc: 'bytedance.larkoffice.com', url: 'https://bytedance.larkoffice.com/docx/MFK7dDFLFoVlOGxWCv5cTXKmnMh' },
      { badge: '视频', name: '30 分钟配置飞书视频教程', desc: 'bytedance.feishu.cn/minutes', url: 'https://bytedance.feishu.cn/minutes/obcnaqyk4yr91i4u9l2986dk' }
    ]
  },
  {
    title: '💬 扣子接入',
    items: [
      { badge: '入口', name: '扣子 Coze 接入入口', desc: 'coze.cn/studio', url: 'https://www.coze.cn/studio' },
      { badge: '教程', name: '扣子接入教程', desc: 'bytedance.larkoffice.com', url: 'https://bytedance.larkoffice.com/docx/DYfIdfqfSo4rwpxGPCEcH3hznwg' }
    ]
  }
]

module.exports = { QA, CATS, RESOURCES }
