import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Post {
  title: string;
  slug: string;
  excerpt: string;
}

interface RelatedPostsProps {
  posts: Post[];
}

const RelatedPosts = ({ posts }: RelatedPostsProps) => {
  return (
    <div className="mt-12 pt-8 border-t border-border">
      <h2 className="text-2xl font-bold text-foreground mb-6">Related Articles</h2>
      <div className="grid gap-6 md:grid-cols-2">
        {posts.map((post) => (
          <Link
            key={post.slug}
            to={`/blog/${post.slug}`}
            className="group p-6 bg-card border border-border rounded-lg hover:border-accent/50 hover:shadow-bold transition-all"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2 group-hover:text-accent transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground text-sm mb-3 line-clamp-2">
              {post.excerpt}
            </p>
            <span className="inline-flex items-center text-sm text-accent font-medium">
              Read more
              <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default RelatedPosts;
