import { ReactNode, useEffect } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { ChevronLeft } from "lucide-react";

interface BlogLayoutProps {
  children: ReactNode;
}

const BlogLayout = ({ children }: BlogLayoutProps) => {
  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <Link 
            to="/blog" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-accent transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Resources
          </Link>
          
          {/* Content wrapper with optimal reading width */}
          <article className="max-w-3xl mx-auto">
            {children}
          </article>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BlogLayout;
