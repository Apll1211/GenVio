import Header from "@/components/layout/Header";
import PrismBackground from "@/components/PrismBackground";
import Shuffle from "@/components/Shuffle";
import GlassCard from "@/components/GlassCard";

// 模拟文章数据
const articles = [
  {
    id: 1,
    title: "敬请期待",
    excerpt: "敬请期待",
    date: "2000-01-01",
    tags: ["敬请期待"],
    readTime: "敬请期待",
  },
  {
    id: 2,
    title: "敬请期待",
    excerpt: "敬请期待",
    date: "2000-01-01",
    tags: ["敬请期待"],
    readTime: "敬请期待",
  },
  {
    id: 3,
    title: "敬请期待",
    excerpt: "敬请期待",
    date: "2000-01-01",
    tags: ["敬请期待"],
    readTime: "敬请期待",
  },
  {
    id: 4,
    title: "敬请期待",
    excerpt: "敬请期待",
    date: "2000-01-01",
    tags: ["敬请期待"],
    readTime: "敬请期待",
  },
  {
    id: 5,
    title: "敬请期待",
    excerpt: "敬请期待",
    date: "2000-01-01",
    tags: ["敬请期待"],
    readTime: "敬请期待",
  },
  {
    id: 6,
    title: "敬请期待",
    excerpt: "敬请期待",
    date: "2000-01-01",
    tags: ["敬请期待"],
    readTime: "敬请期待",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden relative">
      {/* 3D Prism Background */}
      <div className="fixed inset-0 z-0">
        <PrismBackground
          animationType="rotate"
          timeScale={0.5}
          height={3.5}
          baseWidth={5.5}
          scale={3.6}
          hueShift={0.3}
          colorFrequency={1.5}
          noise={0.3}
          glow={1.5}
          whiteGlow={2.0}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen bg-background/60 backdrop-blur-md">
        <Header />
        <div className="flex-1 pt-20">
          {/* 博客内容区域 */}
          <div className="px-4 py-8">
            {/* 标题区域 */}
            <div className="text-center py-12">
              <Shuffle
                text="Welcome To My Homepage"
                tag="h1"
                className="text-[2.625rem] font-bold mb-4 text-gray-500 drop-shadow-lg font-sans"
                shuffleDirection="down"
                duration={0.35}
                animationMode="evenodd"
                shuffleTimes={1}
                ease="power3.out"
                stagger={0.03}
                triggerOnce={true}
                triggerOnHover
              />
            </div>

            {/* 文章网格 */}
            <div className="max-w-6xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {articles.map((article) => (
                  <GlassCard
                    key={article.id}
                    title={article.title}
                    excerpt={article.excerpt}
                    date={article.date}
                    tags={article.tags}
                    readTime={article.readTime}
                    className="hover:-translate-y-2"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
