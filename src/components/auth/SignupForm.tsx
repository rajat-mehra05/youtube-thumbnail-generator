'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface SignupFormProps {
  fullName: string;
  email: string;
  password: string;
  loading: boolean;
  onFullNameChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPasswordChange: (value: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const SignupForm = ({
  fullName,
  email,
  password,
  loading,
  onFullNameChange,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: SignupFormProps) => (
  <form onSubmit={onSubmit} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="signup-name">Full Name</Label>
      <Input
        id="signup-name"
        type="text"
        placeholder="John Doe"
        value={fullName}
        onChange={(e) => onFullNameChange(e.target.value)}
        disabled={loading}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="signup-email">Email</Label>
      <Input
        id="signup-email"
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        disabled={loading}
        required
      />
    </div>
    <div className="space-y-2">
      <Label htmlFor="signup-password">Password</Label>
      <Input
        id="signup-password"
        type="password"
        placeholder="••••••••"
        value={password}
        onChange={(e) => onPasswordChange(e.target.value)}
        disabled={loading}
        minLength={6}
        required
      />
      <p className="text-xs text-muted-foreground">
        Must be at least 6 characters
      </p>
    </div>
    <Button
      type="submit"
      disabled={loading}
      className="w-full h-12 text-base bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-700 hover:to-fuchsia-700"
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <LoadingSpinner size="sm" />
          Creating account...
        </span>
      ) : (
        'Create Account'
      )}
    </Button>
  </form>
);
