 "use client";

  import { useState, useEffect, Suspense } from "react";
  import { HorizontalCarousel } from
  "@/components/home/horizontal-carousel";
  import { LandingSection } from
  "@/components/home/landing-section";
  import { DetailSection } from
  "@/components/home/detail-section";
  import { Loading } from "@/components/loading";

  export default function AboutPage() {
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
      const handleScroll = () => setScrollY(window.scrollY)       
      window.addEventListener('scroll', handleScroll)
      return () => window.removeEventListener('scroll',
  handleScroll)
    }, [])

    return (
      <div className="about-container">
        {/* 第一个section: 全屏水平轮播 */}
        <section 
          className="h-screen overflow-hidden"
          style={{
            transform: `scale(${1 + scrollY * 0.0005})`,          
            opacity: Math.max(0, 1 - scrollY * 0.001)             
          }}
        >
          <HorizontalCarousel />
        </section>

        {/* 第二个section: 原有的about内容 */}
        <section className="min-h-screen bg-white">
          <main>
            <LandingSection />
            <Suspense fallback={<Loading />}>
              <DetailSection />
            </Suspense>
          </main>
        </section>
      </div>
    );
  }