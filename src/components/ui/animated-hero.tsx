import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, FileText, Clock, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  // Task #7: Animated cycling text should be "accurate", "professional", "fast"
  const titles = useMemo(
    () => ["accurate", "professional", "fast"],
    []
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <section className="relative w-full bg-[#1A1A1A] text-white overflow-hidden">
      {/* Task #7: Subtle cross pattern overlay on dark background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '60px 60px'
        }} />
      </div>
      
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex gap-8 py-20 lg:py-32 items-center justify-center flex-col">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-semibold uppercase tracking-wider">
              <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
              Built for Plumbing Professionals
            </span>
          </motion.div>

          {/* Headline with rotating words */}
          <div className="flex gap-4 flex-col">
            <motion.h1 
              className="text-5xl md:text-7xl max-w-4xl tracking-tight text-center font-bold text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-white">Send quotes that are</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1 h-[1.2em]">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-bold text-[#C41E3A]"
                    initial={{ opacity: 0, y: -100 }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? { y: 0, opacity: 1 }
                        : { y: titleNumber > index ? -100 : 100, opacity: 0 }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </motion.h1>

            <motion.p 
              className="text-lg md:text-xl leading-relaxed text-white/80 max-w-2xl text-center mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Create professional plumbing estimates in under a minute. 
              No more messy paperwork or lost quotes—just sharp, branded PDFs your clients will trust.
            </motion.p>
          </div>

          {/* Task #7: Dual CTAs - Get Started Free and View Pricing */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="relative z-20 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              size="lg" 
              variant="hero" 
              className="gap-3 text-base min-h-[44px] px-8 py-4 cursor-pointer" 
              asChild
            >
              <Link 
                to="/signup"
                className="no-underline"
              >
                Get Started Free <MoveRight className="w-5 h-5" />
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="heroOutline" 
              className="gap-3 text-base min-h-[44px] px-8 py-4 cursor-pointer border-white/30 text-white hover:bg-white/10" 
              asChild
            >
              <a 
                href="#pricing"
                className="no-underline"
              >
                View Pricing
              </a>
            </Button>
          </motion.div>

          {/* Task #7: Feature icons section - PDF Export, Under 60 Seconds, Email to Clients */}
          <motion.div 
            className="flex flex-wrap justify-center gap-6 md:gap-8 pt-8 text-sm text-white/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <div className="flex items-center gap-2 min-h-[44px]">
              <FileText className="w-5 h-5 text-[#C41E3A]" />
              <span>PDF Export</span>
            </div>
            <div className="flex items-center gap-2 min-h-[44px]">
              <Clock className="w-5 h-5 text-[#C41E3A]" />
              <span>Under 60 Seconds</span>
            </div>
            <div className="flex items-center gap-2 min-h-[44px]">
              <Mail className="w-5 h-5 text-[#C41E3A]" />
              <span>Email to Clients</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave divider transitioning from dark hero to white sections */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="#FFFFFF"/>
        </svg>
      </div>
    </section>
  );
}

export { Hero };
