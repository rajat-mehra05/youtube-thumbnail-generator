'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { logger } from '@/lib/utils/logger';
import { getGuestSessionId, clearGuestSession } from '@/lib/guest-session';
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

      // Get current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      setTransferring(true);

      try {
        // Transfer guest data to user
        const result = await transferGuestDataToUser(guestSessionId, user.id);

        if (result.success) {
          // Clear the guest session
          clearGuestSession();
          setTransferred(true);

          if (result.projectId) {
            setProjectId(result.projectId);
            // Optionally redirect to the editor with the new project
            router.push(ROUTES.EDITOR(result.projectId));
          }
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
