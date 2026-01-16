import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Mike Rodriguez",
    role: "Owner, Rodriguez Plumbing",
    content: "I've been using PlumbPro Estimate for 3 months now. What used to take me 15 minutes now takes under a minute. My clients love the professional PDFs, and I've closed more jobs because I look more credible.",
    rating: 5,
  },
  {
    name: "Sarah Chen",
    role: "Independent Contractor",
    content: "The best part? No more scribbled notes on the back of receipts. Everything is clean, professional, and ready to email. Worth every penny.",
    rating: 5,
  },
  {
    name: "James Thompson",
    role: "Thompson & Sons Plumbing",
    content: "We tried other estimate tools, but they were too complicated. PlumbPro Estimate is simple, fast, and gets the job done. Our team uses it on every job site.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 md:py-32 bg-white">
      <div className="container">
        {/* Section Header */}
        <div className="mx-auto max-w-2xl text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]/60 mb-4">
            Testimonials
          </p>
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl text-[#1A1A1A]">
            Trusted by plumbing professionals
          </h2>
          <p className="mt-4 text-lg text-[#1A1A1A]/70">
            See what plumbers are saying about PlumbPro Estimate
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-3" role="list">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className="relative rounded-xl border border-[#1A1A1A]/10 bg-white/80 p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#C41E3A]/20"
              role="listitem"
            >
              {/* Quote Icon */}
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#C41E3A]/10 text-[#C41E3A]" aria-hidden="true">
                <Quote className="h-5 w-5" />
              </div>

              {/* Rating */}
              <div className="mb-4 flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#C41E3A] text-[#C41E3A]" />
                ))}
              </div>

              {/* Content */}
              <p className="text-[#1A1A1A]/80 leading-relaxed mb-6">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="border-t border-[#1A1A1A]/10 pt-4">
                <p className="font-semibold text-[#1A1A1A]">{testimonial.name}</p>
                <p className="text-sm text-[#1A1A1A]/60">{testimonial.role}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
