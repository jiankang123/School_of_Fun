---
name: codebanana-skill-guide
description: |
  Skill 开发和管理的完整规范。用于 Skill 的增删改查操作。
  触发条件：
  - 创建："创建 skill"、"新建 skill"、"初始化 skill"
  - 读取："列出 skills"、"查看 skills"、"显示 skill"
  - 更新："更新 skill"、"编辑 skill"、"修改 skill"
  - 删除："删除 skill"、"移除 skill"
  - 验证："验证 skill"、"检查 skill"
  - 打包："打包 skill"、"导出 skill"
---

# Skill 规范

## 重要：Skill 存放在工作区内部

**所有 Skill 存储在当前项目工作区的 `.codebanana/.skills/` 目录中。**

`<runtime_config>` 中的 `SKILLS_PATH` 指向 `.codebanana/.skills/`。创建、读取、更新和删除 Skill 时，始终使用此路径（或该变量）。所有文件工具（`read_file`、`write_file`、`list_dir`、`run_terminal_cmd`）都可以直接访问此目录，因为它是工作区的一部分。

**重要：`.codebanana/.skills/` 内的 `global/` 子目录是系统管理的目录，包含预安装的 Skill。切勿在 `global/` 内创建、修改或删除文件。用户 Skill 必须直接创建在 `.codebanana/.skills/` 下（例如 `.codebanana/.skills/my-skill/SKILL.md`）。**

## 文件结构

```
workspace/.codebanana/.skills/<skill-name>/
├── SKILL.md              # [必需] 主指令文件
├── scripts/              # [可选] 可执行脚本
│   └── *.py / *.sh
├── references/           # [可选] 参考文档（按需加载）
│   └── *.md
└── assets/               # [可选] 输出资源（模板、图片）
    └── *
```

## 命名规范

| 规则 | 正确 | 错误 |
|------|------|------|
| 小写字母 | `my-skill` | `My-Skill`、`MySkill` |
| 用连字符分隔 | `pdf-editor` | `pdf_editor`、`pdfeditor` |
| 不含空格 | `code-review` | `code review` |
| 语义化命名 | `git-workflow` | `gw`、`tool1` |

## SKILL.md 规范

### 前置元数据（必需）

```yaml
---
name: <skill-name>        # 必需：必须与目录名一致
description: |            # 必需：触发条件
  Skill 功能的简要描述。
  Triggers: 列出激活此 Skill 的触发短语。
---
```

**要点：**
- `description` 决定 Skill 何时被激活
- 必须包含具体的触发短语
- 控制在 100 个 token 以内

### 正文结构

```markdown
# Skill 标题

## 概述
[1-2 句话说明用途]

## 工作流程
[核心步骤，编号列表]

## 参考文件
[链接到 references/ 中的文件]
```

### 长度限制与内容指南

| 组成部分 | 限制 | 超出时的处理方式 |
|----------|------|------------------|
| **SKILL.md 正文** | < 500 行 | 将内容拆分到 `references/` 文件中 |
| **加载内容** | < 5000 词 | 核心工作流程放在 SKILL.md，细节移至 references |
| **元数据（前置信息）** | ～100 词 | 保持简洁，聚焦触发条件和核心功能 |

**渐进式展示指南：**

| 指南 | 规则 | 示例 |
|------|------|------|
| **引用深度** | 只允许 1 层深度 | 从 SKILL.md 链接到 `references/file.md`（不允许嵌套链接） |
| **长参考文件** | 超过 100 行需添加目录 | 在文件顶部放置目录，便于快速导航 |
| **大参考文件** | 超过 10000 词需提供 grep 模式 | 在 SKILL.md 中包含搜索模式，支持定向加载 |

**示例：大文件的 grep 模式**
```markdown
## 参考文件

- **API 参考** (references/api.md, 15k 词)
  - 认证：grep "auth"
  - 速率限制：grep "rate.*limit"
  - 接口：grep "GET\\|POST\\|PUT\\|DELETE"
```

## Skill 创建工作流程

创建新 Skill 时遵循以下步骤：

| 步骤 | 操作 | 详情 |
|------|------|------|
| 1 | **理解需求** | 收集 Skill 使用场景的具体示例 |
| 2 | **规划方案** | 确定需要的可复用资源（脚本、参考文档、素材） |
| 3 | **创建结构** | 使用创建操作生成 Skill 结构 |
| 4 | **实现功能** | 添加资源文件并编写 SKILL.md 正文 |
| 5 | **测试** | 编写 2-3 个真实测试提示词，按顺序运行 Skill，记录输出 |
| 6 | **评估** | 将输出与预期结果对照检查 + 收集用户反馈 |
| 7 | **迭代** | 根据反馈修复问题，返回步骤 5 直到满意为止 |

**注意：** 关于验证和打包操作的详细说明，请参见下方的增删改查操作部分。

**快速开始示例：**
```bash
# 步骤 1-2：理解需求 + 规划方案（人工分析）
# 示例：用户需要一个具有旋转/提取功能的 PDF 处理 Skill

# 步骤 3：创建 Skill 结构
write_file(
  operation: "write",
  path: ".codebanana/.skills/pdf-processor/SKILL.md",
  content: "---\\nname: pdf-processor\\ndescription: |\\n  PDF 处理...\\n---\\n\\n# PDF 处理器\\n..."
)

# 步骤 4：实现资源
write_file(
  operation: "write",
  path: ".codebanana/.skills/pdf-processor/scripts/rotate.py",
  content: "#!/usr/bin/env python3\\n# 旋转 PDF 页面\\n..."
)

# 步骤 5-7：测试 → 评估 → 迭代
run_terminal_cmd(
  command: "python scripts/validate_skill.py .codebanana/.skills/pdf-processor"
)
```

### 测试与评估

创建 Skill 后（步骤 5-7），在发布前验证其工作是否正常。

**步骤 5 — 编写测试提示词：**

创建 2-3 个真实用户会说的提示词。覆盖主要用例和至少一个边界情况。

```
pdf-processor 的测试提示词：
1. "帮我从 quarterly-report.pdf 中提取所有文本"       （核心功能）
2. "将我文档的第 3-5 页旋转 90 度"                    （特定参数）
3. "把这三个 PDF 文件合并成一个"                      （多文件边界情况）
```

**步骤 6 — 运行并评估：**

使用 Skill 按顺序执行每个测试提示词。每次运行后检查：

| 检查项 | 问题 |
|--------|------|
| **正确性** | 输出是否符合用户预期？ |
| **完整性** | 是否完成了所有请求的操作？ |
| **错误处理** | Skill 能否优雅地处理缺失文件或错误输入？ |
| **效率** | Skill 是否避免了不必要的步骤或冗余的工具调用？ |

将输出展示给用户审查。没有反馈表示输出可以接受。

**步骤 7 — 迭代：**

针对发现问题的测试用例进行重点改进。修改 Skill 时：
- 泛化修复，而不是过度适配特定测试用例
- 移除对改善输出没有帮助的指令
- 如果每次测试运行都生成了相同的辅助代码，将其打包为脚本

## 增删改查操作

**重要：** 使用文件工具（`write_file`、`read_file`、`delete_file`、`list_dir`）进行 Skill 操作。

### 创建

使用 `write_file` 工具创建 SKILL.md（目录会自动创建）：
```
write_file(
  operation: "write",
  path: "${SKILLS_PATH}/<skill-name>/SKILL.md",
  content: "---\\nname: <skill-name>\\ndescription: |\\n  描述内容。\\n  Triggers: ...\\n---\\n\\n# Skill 标题\\n\\n## 工作流程\\n..."
)
```

创建后，调用 `load_skill` 即可立即使用（无需重启）。

### 读取

使用 `list_dir` 列出 Skill 目录：
```
list_dir(relative_workspace_path: "${SKILLS_PATH}")
```

使用 `read_file` 查看 Skill 内容：
```
read_file(target_file: "${SKILLS_PATH}/<skill-name>/SKILL.md", should_read_entire_file: true)
```

### 更新

使用 `write_file` 的 `edit` 操作：
```
write_file(
  operation: "edit",
  path: "${SKILLS_PATH}/<skill-name>/SKILL.md",
  old_text: "原始文本",
  new_text: "更新后的文本"
)
```

或使用 `write` 操作替换整个文件。

### 删除

使用 `delete_file` 工具：
```
delete_file(target_file: "${SKILLS_PATH}/<skill-name>/SKILL.md")
```

要删除整个 Skill 目录，需要先删除所有文件。

⚠️ **警告**：删除操作不可逆。请先与用户确认。

### 验证

使用 `run_terminal_cmd` 运行验证脚本：
```
run_terminal_cmd(command: "python ${CURRENT_SKILL_PATH}/scripts/validate_skill.py ${SKILLS_PATH}/<skill-name>")
```

验证检查项：
- [ ] SKILL.md 存在
- [ ] 前置元数据格式正确（name + description）
- [ ] name 字段与目录名匹配
- [ ] description 包含触发短语
- [ ] 行数 < 500

### 打包

使用 `run_terminal_cmd` 将 Skill 打包为 ZIP：
```
run_terminal_cmd(command: "python ${CURRENT_SKILL_PATH}/scripts/package_skill.py ${SKILLS_PATH}/<skill-name> [output_dir]")
```

生成 `<skill-name>.skill` 文件（ZIP 格式），用于分享。

## 资源文件

### scripts/ 目录

用于需要确定性执行的代码：

```python
#!/usr/bin/env python3
"""脚本描述"""
import sys

def main():
    # 实现逻辑
    pass

if __name__ == "__main__":
    main()
```

**要求：**
- 添加 shebang 行
- 包含文档字符串
- 处理命令行参数
- 创建后进行测试

### references/ 目录

用于按需加载的参考文档：

```markdown
# 参考标题

## 目录
- [章节 1](#章节-1)
- [章节 2](#章节-2)

## 章节 1
...
```

**要求：**
- 超过 100 行的文件需添加目录
- 在 SKILL.md 中说明何时读取
- 避免与 SKILL.md 内容重复

### assets/ 目录

用于输出资源：
- 模板（HTML、React 等）
- 图片、图标
- 字体文件
- 示例文档

**注意：** 素材不会加载到上下文中，仅用于输出。

## 不应包含的文件

❌ README.md
❌ CHANGELOG.md
❌ INSTALLATION.md
❌ 面向人类的文档

Skill 是为 Agent 服务的，不是为人类服务的。

## 渐进式展示

三级加载机制：

| 层级 | 内容 | 加载时机 | 大小限制 |
|------|------|----------|----------|
| 1 | name + description | 始终在上下文中 | ～100 token |
| 2 | SKILL.md 正文 | 触发 Skill 时 | < 5k token |
| 3 | references/* | 按需加载 | 无限制 |

## 最佳实践

### 编写原则

| 原则 | 规则 | 示例 |
|------|------|------|
| **简洁优先** | 只添加 Agent 不知道的内容；审视每段的 token 开销 | ❌ "PDF 是一种常见格式..." → ✅ 直接给出代码示例 |
| **使用祈使句** | 用直接指令，不用被动描述 | ❌ "你可以使用..." → ✅ "使用 pdfplumber 进行提取" |
| **解释原因** | 优先用推理替代僵硬的"必须/禁止"；帮助 Agent 理解意图 | ❌ "必须使用 UTC" → ✅ "使用 UTC 以避免跨区域报告中的时区错误" |
| **自由度匹配脆弱度** | 灵活任务给高自由度，脆弱操作给低自由度 | 代码审查指南 → 文字说明；数据库迁移 → 精确脚本 |
| **一词一义** | 选定一个术语，全程统一使用 | ❌ 混用 "URL"/"路由"/"端点" → ✅ 始终使用"端点" |

### 编写描述

| 规则 | 详情 | 示例 |
|------|------|------|
| **做什么 + 何时用** | 描述必须涵盖能力和触发场景 | "提取/旋转/合并 PDF。处理 .pdf 文件或用户提到 PDF 操作时使用" |
| **第三人称** | 描述会注入到系统提示词上下文中 | ❌ "我可以处理..." → ✅ "处理 PDF 文件并生成报告" |
| **具体明确** | 包含具体触发词，不用模糊类别 | ❌ "处理文档" → ✅ "提取文本、旋转页面、合并/拆分 PDF 文件" |

```yaml
# ❌ 差的描述
description: 处理 PDF 文件

# ✅ 好的描述
description: |
  PDF 文件处理：提取文本、旋转页面、合并/拆分。
  Triggers:
  - "从 PDF 中提取文本"
  - "旋转 PDF"
  - "合并 PDF"
  - "将 PDF 拆分成页"
```

### 编写工作流程

```markdown
## 工作流程

1. **分析请求** - 确定需要的具体操作
2. **读取文件** - 使用 read_file 获取内容
3. **执行操作** - 根据类型调用相应脚本
4. **验证结果** - 检查输出是否正确
5. **返回结果** - 展示给用户
```

### 常用模式

| 模式 | 适用场景 | 示例 |
|------|----------|------|
| **模板模式** | 输出必须遵循固定格式 | 提供带 `[占位符]` 的 Markdown/代码模板 |
| **示例模式** | 输出质量依赖于看到输入→输出对 | 展示 2-3 个具体的输入/输出示例 |
| **条件模式** | 根据上下文有多个路径 | "新建？→ 遵循 A。编辑现有？→ 遵循 B" |
| **反馈循环模式** | 质量要求高，需要验证 | "执行 → 验证 → 失败则修复 → 通过后继续" |

### 反模式

| 反模式 | 问题 | 修复方式 |
|--------|------|----------|
| **选项太多** | Agent 选择时容易困惑 | 提供一个默认方案 + 边界情况的备选方案 |
| **时效性信息** | 会过时 | 使用"当前方法"和"旧方法（已弃用）"分区 |
| **模糊命名** | 难以发现和区分 | ❌ `helper`、`utils` → ✅ `pdf-editor`、`git-workflow` |
