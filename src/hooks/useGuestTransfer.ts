'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';
import { getGuestSessionId, clearGuestSession, getGuestSession } from '@/lib/guest-session';
import { transferGuestDataToUser } from '@/lib/actions/guest-session';
import { ROUTES } from '@/lib/constants';

/**
 * Hook to handle guest session transfer after authentication
 * Should be called on protected pages after successful login
 */
export const useGuestTransfer = () => {
  const router = useRouter();
  const [transferring, setTransferring] = useState(false);
  const [transferred, setTransferred] = useState(false);
  const [projectId, setProjectId] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    const handleTransfer = async () => {
      // Check if there's a guest session to transfer
      const guestSessionId = getGuestSessionId();
      if (!guestSessionId) return;

      // Get guest session data (including canvas state from localStorage)
      const guestSession = getGuestSession();
      if (!guestSession) return;

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setTransferring(true);

      try {
        // Prepare project metadata from guest session
        const projectName = guestSession.textSuggestions?.headline
          ? `${guestSession.textSuggestions.headline} Thumbnail`
          : 'My First Thumbnail';
        const videoTitle = guestSession.textSuggestions?.headline || '';

        // Transfer guest data to user (creates project atomically with canvas state)
        const result = await transferGuestDataToUser(
          guestSessionId,
          user.id,
          guestSession.canvasState || null,
          projectName,
          videoTitle
        );

        if (result.success && result.projectId) {
          // Clear the guest session
          clearGuestSession();
          setTransferred(true);
          setProjectId(result.projectId);

          // Redirect to the editor with the new project
          router.push(ROUTES.EDITOR(result.projectId));
        } else if (result.success) {
          // No project created, just clear session
          clearGuestSession();
          setTransferred(true);
        }
      } catch (error) {
        logger.error('Guest transfer error:', { error });
      } finally {
        setTransferring(false);
      }
    };

    handleTransfer();
  }, [supabase.auth, router]);

  return { transferring, transferred, projectId };
};
