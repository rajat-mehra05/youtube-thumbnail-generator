export const SuccessMessage = ({ message }: { message: string }) => (
  <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 text-sm flex items-start gap-2">
    <span className="text-base">✓</span>
    <span>{message}</span>
  </div>
);
