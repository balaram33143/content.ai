'use client';

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function MockDataBanner() {
  return (
    <Alert className="bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800 mb-4">
      <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
      <AlertDescription className="text-blue-800 dark:text-blue-200">
        <strong>Testing Mode:</strong> Using mock data. Records are stored in memory only.{' '}
        <a href="/dashboard/settings" className="underline hover:no-underline font-semibold">
          Configure Supabase
        </a>{' '}
        to persist data to a real database.
      </AlertDescription>
    </Alert>
  );
}
