# 贡献指南 / Contributing Guide

我们欢迎社区贡献！请遵循以下步骤来参与 Arctica 项目的开发。

We welcome community contributions! Please follow these guidelines to contribute to the Arctica project.

## 如何贡献 / How to Contribute

### 1. 前置要求 / Prerequisites

在开始贡献之前，请确保您具备以下条件：
Before contributing, please ensure you have:

- Node.js 22+ 和 pnpm 9.7+ / Node.js 22+ and pnpm 9.7+
- Git 基础知识 / Basic Git knowledge
- 对 React、Next.js 和 Web3 的了解 / Understanding of React, Next.js, and Web3
- Web3 钱包（用于测试）/ Web3 wallet (for testing)

### 2. 设置开发环境 / Setting Up Development Environment

```bash
# 1. Fork 仓库到您的 GitHub 账户
# 1. Fork the repository to your GitHub account

# 2. 克隆您的 fork
# 2. Clone your fork

# 3. 添加上游仓库
# 3. Add upstream repository
git remote add upstream https://github.com/fae-foundation/app.git

# 4. 安装依赖
# 4. Install dependencies
pnpm install

# 5. 复制环境配置
# 5. Copy environment configuration
cp .env.example .env.local

# 6. 启动开发服务器
# 6. Start development server
pnpm dev
```

### 3. 开发流程 / Development Workflow

#### 创建功能分支 / Creating Feature Branch

```bash
# 1. 确保主分支是最新的
# 1. Ensure main branch is up to date
git checkout main
git pull upstream main

# 2. 创建新的功能分支
# 2. Create new feature branch
git checkout -b feature/your-feature-name

# 或者修复 bug / Or for bug fixes
git checkout -b fix/bug-description
```

#### 提交规范 / Commit Convention

请使用以下提交信息格式：
Please use the following commit message format:

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**类型 / Types:**
- `feat`: 新功能 / New feature
- `fix`: 修复 bug / Bug fix
- `docs`: 文档更新 / Documentation update
- `style`: 代码风格调整 / Code style changes
- `refactor`: 重构代码 / Code refactoring
- `test`: 测试相关 / Test related
- `chore`: 构建或辅助工具变动 / Build or auxiliary tool changes

**示例 / Examples:**
```
feat(auth): add lens protocol integration
fix(ui): resolve mobile navigation issues
docs: update README with installation guide
```

### 4. 代码规范 / Code Standards

#### 代码风格 / Code Style

- 使用 TypeScript 进行类型检查 / Use TypeScript for type checking
- 遵循 ESLint 配置 / Follow ESLint configuration
- 使用 Prettier 进行代码格式化 / Use Prettier for code formatting
- 组件使用 PascalCase 命名 / Use PascalCase for component names
- 文件和文件夹使用 kebab-case / Use kebab-case for files and folders

#### 运行检查 / Running Checks

```bash
# 类型检查 / Type checking
pnpm type-check

# 代码检查 / Linting
pnpm lint

# 代码格式化 / Code formatting
pnpm format
```

#### 组件开发规范 / Component Development Guidelines

1. **组件结构 / Component Structure:**
   ```typescript
   // components/ui/example-component.tsx
   import { cn } from "@/lib/utils"
   
   interface ExampleComponentProps {
     className?: string
     children: React.ReactNode
   }
   
   export function ExampleComponent({ 
     className, 
     children, 
     ...props 
   }: ExampleComponentProps) {
     return (
       <div className={cn("default-classes", className)} {...props}>
         {children}
       </div>
     )
   }
   ```

2. **钩子使用 / Hook Usage:**
   - 将自定义钩子放在 `src/hooks/` 目录 / Place custom hooks in `src/hooks/`
   - 使用 TypeScript 类型注解 / Use TypeScript type annotations
   - 遵循 React 钩子规则 / Follow React hooks rules

3. **样式规范 / Styling Guidelines:**
   - 使用 TailwindCSS 类名 / Use TailwindCSS classes
   - 避免内联样式 / Avoid inline styles
   - 使用 `cn()` 函数合并类名 / Use `cn()` function to merge classes

### 5. 测试 / Testing

虽然当前项目处于早期开发阶段，但我们鼓励添加测试：
While the project is in early development, we encourage adding tests:

```bash
# 运行测试（未来实现）
# Run tests (future implementation)
pnpm test

# 运行测试覆盖率
# Run test coverage
pnpm test:coverage
```

### 6. 提交 PR / Submitting Pull Request

#### PR 检查清单 / PR Checklist

在提交 PR 之前，请确保：
Before submitting a PR, please ensure:

- [ ] 代码通过所有检查（类型、lint、格式）/ Code passes all checks (type, lint, format)
- [ ] 功能在本地测试正常 / Feature works correctly locally
- [ ] 添加了必要的文档 / Added necessary documentation
- [ ] 提交信息遵循规范 / Commit messages follow convention
- [ ] PR 描述清楚 / Clear PR description

#### PR 模板 / PR Template

```markdown
## 描述 / Description
简要描述此 PR 的更改内容。
Brief description of changes in this PR.

## 类型 / Type
- [ ] 新功能 / New feature
- [ ] Bug 修复 / Bug fix
- [ ] 文档更新 / Documentation update
- [ ] 重构 / Refactoring
- [ ] 其他 / Other

## 测试 / Testing
描述如何测试这些更改。
Describe how to test these changes.

## 截图 / Screenshots
如果适用，添加截图展示更改。
If applicable, add screenshots to showcase changes.

## 相关 Issue / Related Issues
关闭 #issue_number
Closes #issue_number
```

### 7. 行为准则 / Code of Conduct

#### 我们的承诺 / Our Pledge

我们致力于为每个人创造一个开放和友好的环境，无论其经验水平、性别、性别认同和表达、性取向、残疾、外貌、体型、种族、民族、年龄、宗教或国籍如何。

We are committed to creating an open and welcoming environment for everyone, regardless of experience level, gender, gender identity and expression, sexual orientation, disability, personal appearance, body size, race, ethnicity, age, religion, or nationality.

#### 我们的标准 / Our Standards

**积极行为包括：/ Positive behaviors include:**
- 使用友好和包容的语言 / Using welcoming and inclusive language
- 尊重不同的观点和经验 / Respecting differing viewpoints and experiences
- 优雅地接受建设性批评 / Gracefully accepting constructive criticism
- 专注于对社区最有利的事情 / Focusing on what is best for the community
- 对其他社区成员表现出同理心 / Showing empathy towards other community members

**不可接受的行为包括：/ Unacceptable behaviors include:**
- 使用性化语言或图像 / Use of sexualized language or imagery
- 人身攻击或政治攻击 / Personal or political attacks
- 公开或私人骚扰 / Public or private harassment
- 未经许可发布他人的私人信息 / Publishing private information without permission

### 8. 获得帮助 / Getting Help

如果您需要帮助或有疑问，可以通过以下方式联系我们：
If you need help or have questions, you can reach us through:

- 🐛 GitHub Issues: 报告 bug 或请求功能 / Report bugs or request features
- 💬 GitHub Discussions: 一般讨论和问题 / General discussions and questions
- 📧 Email: 私人或敏感问题 / Private or sensitive issues

### 9. 许可证 / License

通过贡献代码，您同意您的贡献将在 AGPL-3.0 许可证下授权。
By contributing, you agree that your contributions will be licensed under the AGPL-3.0 License.

---

感谢您对 Arctica 项目的贡献！🎉
Thank you for contributing to Arctica! 🎉

**最后更新 / Last Updated**: 2025-08-26