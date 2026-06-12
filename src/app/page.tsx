import {
  Briefcase,
  Calendar,
  Code2,
  Cpu,
  ExternalLink,
  GraduationCap,
  Layout,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Rocket,
  Server,
  Terminal,
  User,
} from "lucide-react";
import Header from "@/components/layout/Header";
import PrismBackground from "@/components/PrismBackground";
import ResumeSection from "@/components/ResumeSection";
import ShinyText from "@/components/ShinyText";

export default function Home() {
  const resumeData = {
    name: "赵延博",
    age: "26岁",
    gender: "男",
    hometown: "辽宁省葫芦岛市",
    phone: "13352991964",
    email: "490135438@163.com",
    jobIntention: {
      position: "前端开发工程师 / 全栈开发",
      city: "大连",
      salary: "面议",
      availableTime: "一周内到岗",
    },
    skills: [
      { name: "React / Next.js", level: 95 },
      { name: "TypeScript / JS", level: 90 },
      { name: "Vue3 / Vite", level: 85 },
      { name: "Electron / Tauri", level: 80 },
      { name: "Linux / Docker", level: 85 },
      { name: "Python / Node.js", level: 80 },
    ],
    education: [
      {
        period: "2022.09 ~ 2024.07",
        school: "大连交通大学",
        major: "软件工程（本科）",
        description: "科班培养，具备良好的软件工程思维与代码规范意识。",
        courses:
          "数据结构与算法、数据库设计、操作系统、计算机网络、网页设计、Java、Python、C++。",
      },
    ],
    projects: [
      {
        name: "GenVio 个人视觉艺术履历系统",
        role: "开发者 / 架构设计 (Next.js)",
        period: "2024.01 - 至今",
        tags: ["Next.js 16", "React 19", "Tailwind CSS", "响应式架构"],
        stack:
          "Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion, GSAP, WebGL/OGL, Lucide Icons",
        points: [
          "设计并实现一套基于 Next.js App Router 的模块化动态履历展示系统，支持夜间模式的无缝切换。",
          "构建高度解耦的 shadcn 通用卡片组件库，利用 Tailwind CSS 实现深浅色模式自动适配及响应式布局。",
          "集成动态视觉背景系统（CSS Prism & Fluid Simulation），在保证高性能的前提下提升用户的沉浸式浏览体验。",
          "采用现代化全栈开发模式，深度实践服务端渲染 (SSR) 以优化首屏加载与 SEO，同时通过客户端状态管理实现精细的交互控制。",
        ],
      },
    ],
    evaluation:
      "具备软件工程科班基础，技术栈覆盖从前端交互、跨平台桌面应用（Electron/Tauri）到后端服务部署。熟悉 Linux 环境运维、Docker 容器化及 Nginx 配置，具备独立完成从开发到上线全流程的能力。\n持续学习与提效：保持对前沿技术的关注，能够熟练运用 AI 工具辅助开发以提升编码效率。具备良好的逻辑思维与快速学习能力，能根据项目需求迅速掌握并落地新技术。\n极强的技术敏捷性与独立攻坚能力。能精准通过英文 Runtime 日志定位核心异常，并熟练检索海外开源社区（如 GitHub Issues）的最新讨论，具备在没有团队支持的情况下独立解决技术死胡同的实力",
  };

  return (
    <div className="min-h-screen overflow-x-hidden relative">
      <div className="fixed inset-0 z-0">
        <PrismBackground
          animationType="rotate"
          timeScale={0.5}
          hueShift={0.3}
        />
      </div>

      <div className="relative z-10 min-h-screen bg-background/60 backdrop-blur-md">
        <Header />

        <main className="max-w-6xl mx-auto pt-32 pb-20 px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* 左侧栏：1/3 宽度 */}
            <div className="lg:col-span-4 space-y-8">
              {/* 核心名片 */}
              <ResumeSection
                title="个人名片"
                icon={<User className="w-6 h-6" />}
              >
                <div className="flex flex-col items-center mb-8">
                  <div className="w-28 h-28 rounded-2xl bg-gradient-to-tr from-primary/20 to-accent/20 border border-white/40 dark:border-gray-600/40 flex items-center justify-center mb-4 shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500 overflow-hidden group">
                    <User className="w-14 h-14 text-primary/40 group-hover:scale-110 transition-transform" />
                  </div>
                  <ShinyText
                    text={resumeData.name}
                    speed={2}
                    className="text-3xl font-bold mb-2 tracking-widest"
                  />
                  <p className="text-muted-foreground font-medium">
                    {resumeData.age} · {resumeData.gender} · 辽宁大连
                  </p>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/10">
                  <div className="flex items-center gap-3 text-sm hover:text-primary transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <span className="font-mono">{resumeData.phone}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm hover:text-primary transition-colors cursor-pointer">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Mail className="w-4 h-4" />
                    </div>
                    <span className="font-mono">{resumeData.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <span>
                      {resumeData.jobIntention.city} ·{" "}
                      {resumeData.jobIntention.availableTime}
                    </span>
                  </div>
                </div>
              </ResumeSection>

              {/* 求职意向 */}
              <ResumeSection
                title="求职意向"
                icon={<Rocket className="w-6 h-6" />}
              >
                <div className="bg-white/5 dark:bg-black/10 rounded-xl p-4 border border-white/10">
                  <div className="text-sm text-muted-foreground mb-1 uppercase tracking-tighter">
                    Target Position
                  </div>
                  <div className="text-lg font-bold text-primary">
                    {resumeData.jobIntention.position}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">期望薪资:</span>
                    <span className="font-bold text-accent">
                      {resumeData.jobIntention.salary}
                    </span>
                  </div>
                </div>
              </ResumeSection>

              {/* 核心技能栈 */}
              <ResumeSection
                title="核心技能"
                icon={<Cpu className="w-6 h-6" />}
              >
                <div className="space-y-5">
                  {resumeData.skills.map((skill) => (
                    <div key={skill.name} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-bold">{skill.name}</span>
                        <span className="text-primary font-mono opacity-80">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-white/10 dark:bg-gray-700/30 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-primary/60 to-primary rounded-full"
                          style={{ width: `${skill.level}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </ResumeSection>
            </div>

            {/* 主内容区：2/3 宽度 */}
            <div className="lg:col-span-8 space-y-8">
              {/* 核心优势 / 个人简介 */}
              <ResumeSection
                title="技术能力"
                icon={<Terminal className="w-6 h-6" />}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-primary/5 border border-primary/10">
                    <div className="flex items-center gap-2 mb-2 font-bold text-primary">
                      <Layout className="w-4 h-4" /> 前端 & 构建
                    </div>
                    <p className="text-sm leading-relaxed opacity-80 text-justify">
                      扎实的 HTML5/CSS3/JS(ES6+) 功底，深耕 React/Vue3
                      生态；熟练使用 TypeScript 进行类型安全开发，精通
                      Vite/Webpack 工程化构建优化。
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-accent/5 border border-accent/10">
                    <div className="flex items-center gap-2 mb-2 font-bold text-accent">
                      <Server className="w-4 h-4" /> 全栈 & 部署
                    </div>
                    <p className="text-sm leading-relaxed opacity-80 text-justify">
                      精通 Linux 日常维护与 Shell 脚本，熟练使用 Docker
                      容器化、Nginx 反代与高性能缓存配置；具备 Express/Node.js
                      服务端开发能力。
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 md:col-span-2">
                    <div className="flex items-center gap-2 mb-2 font-bold text-blue-500">
                      <Rocket className="w-4 h-4" /> 跨平台 & AI 赋能
                    </div>
                    <p className="text-sm leading-relaxed opacity-80">
                      掌握 Electron/Tauri 跨平台桌面端开发思路,融合 GitHub
                      Copilot/Gemini 等 AI
                      工具辅助编码，具备极强的复杂问题解决能力与技术落地速度。
                    </p>
                  </div>
                </div>
              </ResumeSection>

              {/* 项目经验 */}
              <ResumeSection
                title="项目实战"
                icon={<Briefcase className="w-6 h-6" />}
              >
                {resumeData.projects.map((project, idx) => (
                  <div key={idx} className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/10 pb-2">
                      <div>
                        <h3 className="text-xl font-bold flex items-center gap-2">
                          {project.name}{" "}
                          <ExternalLink className="w-4 h-4 opacity-30" />
                        </h3>
                        <p className="text-primary font-medium text-sm mt-1">
                          {project.role}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground whitespace-nowrap bg-white/5 px-3 py-1 rounded-full border border-white/5">
                        <Calendar className="w-4 h-4" />
                        <span>{project.period}</span>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {project.tags.map((tag) => (
                        <span
                          key={tag}
                          className="text-[10px] px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    {project.stack && (
                      <div className="p-3 rounded-lg bg-white/5 border border-white/10 text-xs leading-relaxed">
                        <span className="font-bold text-primary mr-2">
                          技术栈:
                        </span>
                        <span className="opacity-70">{project.stack}</span>
                      </div>
                    )}
                    <ul className="space-y-2">
                      {project.points.map((point, pIdx) => (
                        <li
                          key={pIdx}
                          className="text-sm leading-relaxed flex gap-2"
                        >
                          <span className="text-primary mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-primary" />
                          <span className="opacity-80">{point}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </ResumeSection>

              {/* 教育背景 */}
              <ResumeSection
                title="教育背景"
                icon={<GraduationCap className="w-6 h-6" />}
              >
                {resumeData.education.map((edu, index) => (
                  <div key={index} className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className="text-xl font-bold text-primary">
                        {edu.school}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{edu.period}</span>
                      </div>
                    </div>
                    <p className="font-bold text-lg">{edu.major}</p>
                    <p className="text-sm italic opacity-70">
                      {edu.description}
                    </p>
                    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10">
                      <p className="text-xs font-bold text-muted-foreground uppercase mb-2">
                        主要课程
                      </p>
                      <p className="text-sm leading-relaxed opacity-80">
                        {edu.courses}
                      </p>
                    </div>
                  </div>
                ))}
              </ResumeSection>

              {/* 自我评价 */}
              <ResumeSection
                title="自我评价"
                icon={<MessageSquare className="w-6 h-6" />}
              >
                <div className="relative p-6 rounded-xl bg-primary/5 border-l-4 border-primary">
                  <div className="space-y-4">
                    {resumeData.evaluation.split("\n").map((line, i) => (
                      <p
                        key={i}
                        className="text-sm leading-relaxed opacity-90 text-justify"
                      >
                        {line}
                      </p>
                    ))}
                  </div>
                </div>
              </ResumeSection>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
