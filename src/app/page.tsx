import FeaturedVideos from "@/components/FeaturedVideos";
import Header from "@/components/layout/Header";
import SecondaryNav from "@/components/layout/SecondaryNav";
import Sidebar from "@/components/layout/Sidebar";
import VideoGrid from "@/components/layout/VideoGrid";

export default function Home() {
  return (
    <div className="min-h-screen bg-background overflow-x-hidden flex flex-col lg:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col lg:ml-20 xl:ml-44">
        <Header />
        <SecondaryNav />
        <div className="flex-1 pt-28">
          {/* 热门推荐区域 */}
          <div className="px-4 mb-8 mt-6">
            <FeaturedVideos />
          </div>
          
          {/* 视频网格 */}
          <div className="px-4">
            <VideoGrid />
          </div>
        </div>
      </div>
    </div>
  );
}
