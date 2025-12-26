import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ROUTES } from '@/lib/constants';

export const TrialUsedCard = () => (
  <Card className="border-amber-500/30 bg-amber-500/5">
    <CardHeader className="text-center">
      <CardTitle className="text-xl">Free Trial Used</CardTitle>
      <CardDescription>You&apos;ve used your free AI generation. Sign up to continue creating!</CardDescription>
    </CardHeader>
    <CardContent className="flex flex-col items-center gap-4">
      <Link href={ROUTES.LOGIN}>
        <Button size="lg" className="bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700">
          Sign Up — It&apos;s Free
        </Button>
      </Link>
      <Link href={ROUTES.LOGIN} className="text-sm text-muted-foreground hover:text-foreground">
        Already have an account? Login
      </Link>
    </CardContent>
  </Card>
);
