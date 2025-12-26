'use client';

import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';

interface MethodCardProps {
  href: string;
  icon: string;
  title: string;
  description: string;
  badge?: string;
}

export const MethodCard = ({
  href,
  icon,
  title,
  description,
  badge,
}: MethodCardProps) => {
  return (
    <Link href={href} className="block">
      <Card className="h-full hover:border-violet-500/50 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-200 cursor-pointer group">
        <CardContent className="p-6 md:p-8 text-center">
          {badge && (
            <span className="inline-block px-3 py-1 rounded-full bg-violet-500/10 text-violet-600 dark:text-violet-400 text-xs font-medium mb-4">
              {badge}
            </span>
          )}
          <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-200">
            {icon}
          </div>
          <h3 className="text-xl font-semibold mb-2">{title}</h3>
          <p className="text-muted-foreground text-sm">{description}</p>
        </CardContent>
      </Card>
    </Link>
  );
};
