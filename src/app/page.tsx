import Header from "@/components/layout/Header";
import SecondaryNav from "@/components/layout/SecondaryNav";

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <Header />
      <SecondaryNav />
      <div className="flex-1 pt-28">
        {/* 博客内容区域 */}
        <div className="px-4">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold mb-4">欢迎来到我的博客</h1>
            <p className="text-muted-foreground">这里将展示我的文章和内容</p>
          </div>
        </div>
      </div>
    </div>
  );
}
