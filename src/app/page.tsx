import Header from "@/components/layout/Header";
import PrismBackground from "@/components/PrismBackground";
import Shuffle from "@/components/Shuffle";

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
          <div className="px-4">
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
          </div>
        </div>
      </div>
    </div>
  );
}
