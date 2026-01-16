import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Tom Jenkins",
    role: "Roofing Contractor, Atlanta, GA",
    content: "Professional estimates help me close more residential and commercial roofing jobs. This tool paid for itself after the first estimate.",
    rating: 5,
  },
  {
    name: "Sarah Martinez",
    role: "Owner, Martinez Roofing",
    content: "The best part? No more scribbled notes. Everything is itemized by square, tear-off included, and ready to email. My close rate went up immediately.",
    rating: 5,
  },
  {
    name: "James Thompson",
    role: "Thompson Roofing Services",
    content: "We tried other tools, but they were too complicated or too expensive. Roofing Estimate Pro is simple, fast, and gets the job done. Our crew uses it on every site inspection.",
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
            Trusted by roofing professionals
          </h2>
          <p className="mt-4 text-lg text-[#1A1A1A]/70">
            See what roofers are saying about Roofing Estimate Pro
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid gap-8 md:grid-cols-3" role="list">
          {testimonials.map((testimonial, index) => (
            <article
              key={testimonial.name}
              className="relative rounded-xl border border-[#1A1A1A]/10 bg-white/80 p-8 shadow-sm transition-all duration-300 hover:shadow-md hover:border-[#DC2626]/20"
              role="listitem"
            >
              {/* Quote Icon */}
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#DC2626]/10 text-[#DC2626]" aria-hidden="true">
                <Quote className="h-5 w-5" />
              </div>

              {/* Rating */}
              <div className="mb-4 flex gap-1" aria-label={`${testimonial.rating} out of 5 stars`}>
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-[#DC2626] text-[#DC2626]" />
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
