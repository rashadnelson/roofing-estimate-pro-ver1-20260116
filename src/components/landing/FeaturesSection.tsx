import { 
  FileText, 
  Upload, 
  Clock, 
  Send, 
  Building2, 
  Shield 
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Professional PDFs",
    description: "Clean, branded estimates that make you look like a pro team. Your logo, your name, your credibility.",
  },
  {
    icon: Clock,
    title: "Fast Quote Builder",
    description: "Add parts, labor, and equipment in seconds. No spreadsheets, no hassle—just results.",
  },
  {
    icon: Send,
    title: "Email Direct",
    description: "Send estimates straight to your clients. They get a professional PDF, you get the job.",
  },
  {
    icon: Upload,
    title: "Your Branding",
    description: "Upload your logo once, and every estimate carries your brand. Make it official.",
  },
  {
    icon: Building2,
    title: "Client Management",
    description: "Save client details and estimate history. Access everything from your dashboard.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is yours. We don't share, sell, or mess with your business information.",
  },
];

const FeaturesSection = () => {
  return (
    <section id="features" className="py-24 md:py-32 bg-background">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="section-title mb-4">Features</p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Everything you need.
            <span className="block text-accent">Nothing you don't.</span>
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Built by tradespeople, for tradespeople. Every feature serves one purpose: 
            helping you win more jobs.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3" role="list">
          {features.map((feature, index) => (
            <article 
              key={feature.title}
              className="group relative rounded-xl border border-border bg-card p-8 transition-all duration-300 hover:shadow-bold hover:border-accent/30"
              style={{ animationDelay: `${index * 100}ms` }}
              role="listitem"
            >
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground" aria-hidden="true">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="font-display text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
