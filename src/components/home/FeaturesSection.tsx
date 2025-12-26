const features = [
  { icon: '✨', title: 'AI-Powered Generation', description: 'Describe your video and let AI create stunning thumbnail concepts in seconds.' },
  { icon: '🎨', title: '50+ Templates', description: 'Choose from professionally designed templates for every niche - gaming, vlogs, tutorials & more.' },
  { icon: '🖌️', title: 'Easy Canvas Editor', description: 'Drag, drop, resize, and customize every element. No design skills needed.' },
  { icon: '📤', title: 'Upload Your Images', description: 'Use your own photos, logos, and screenshots. AI enhances them automatically.' },
  { icon: '⚡', title: 'Instant Export', description: 'Export YouTube-ready thumbnails at 1280x720 with one click.' },
  { icon: '💾', title: 'Save & Iterate', description: 'Save your projects and come back anytime to make changes.' },
];

export const FeaturesSection = () => (
  <section className="py-16 md:py-24">
    <div className="container">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Everything You Need to Create</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Powerful features that make thumbnail creation fast, fun, and frustration-free.
        </p>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
        {features.map((feature, index) => (
          <div
            key={feature.title}
            className="group p-6 md:p-8 rounded-2xl border border-border/50 bg-card hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300"
            style={{ animationDelay: `${index * 50}ms` }}
          >
            <div className="text-4xl mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
            <p className="text-muted-foreground">{feature.description}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);
