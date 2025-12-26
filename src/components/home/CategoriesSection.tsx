import Link from 'next/link';
import { ROUTES, TEMPLATE_CATEGORIES } from '@/lib/constants';

export const CategoriesSection = () => (
  <section className="py-16 md:py-24 bg-muted/30">
    <div className="container mx-auto px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">Templates for Every Niche</h2>
        <p className="text-muted-foreground max-w-xl mx-auto">
          Professional templates designed by experts for maximum engagement.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3 md:gap-4">
        {TEMPLATE_CATEGORIES.map((category) => (
          <Link
            key={category.value}
            href={`${ROUTES.CREATE_TEMPLATES}?category=${category.value}`}
            className="px-6 py-3 rounded-full border border-border bg-background hover:border-violet-500/50 hover:bg-violet-500/5 transition-colors font-medium"
          >
            {category.label}
          </Link>
        ))}
      </div>
    </div>
  </section>
);
