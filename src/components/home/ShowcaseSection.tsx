const exampleThumbnails = [
  { id: 1, title: 'Gaming', image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=400&h=225&fit=crop' },
  { id: 2, title: 'Vlog', image: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868?w=400&h=225&fit=crop' },
  { id: 3, title: 'Tutorial', image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=225&fit=crop' },
  { id: 4, title: 'Podcast', image: 'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=225&fit=crop' },
];

export const ShowcaseSection = () => (
  <section className="py-16 md:py-24 bg-muted/30">
    <div className="container">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">See What You Can Create</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          From gaming to vlogs, tutorials to podcasts — create thumbnails for any niche.
        </p>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {exampleThumbnails.map((thumb, index) => (
          <div
            key={thumb.id}
            className="group relative aspect-video rounded-xl overflow-hidden bg-muted shadow-lg"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <img
              src={thumb.image}
              alt={`${thumb.title} thumbnail example`}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-3 left-3 text-white font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              {thumb.title}
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
