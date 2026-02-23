import { useState, useEffect, useCallback } from 'react';
import type { JobApplication } from '@/types/job';

export function useNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>('default');
  const [reminders, setReminders] = useState<{ jobId: string; timeoutId: number }[]>([]);

  // Check and request notification permission
  const requestPermission = useCallback(async (): Promise<boolean> => {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications');
      return false;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, []);

  // Initialize permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Schedule a notification
  const scheduleNotification = useCallback((job: JobApplication): boolean => {
    if (!job.followUpDate || permission !== 'granted') {
      return false;
    }

    const followUpTime = new Date(job.followUpDate).getTime();
    const now = Date.now();
    const delay = followUpTime - now;

    // Only schedule if the follow-up date is in the future
    if (delay > 0) {
      // Clear existing reminder for this job if any
      const existingReminder = reminders.find(r => r.jobId === job.id);
      if (existingReminder) {
        window.clearTimeout(existingReminder.timeoutId);
      }

      const timeoutId = window.setTimeout(() => {
        new Notification('JobHunt Reminder', {
          body: `Follow up on your application for ${job.jobTitle} at ${job.company}`,
          icon: '/favicon.ico',
          badge: '/favicon.ico',
          tag: job.id,
          requireInteraction: true
        });

        // Remove from reminders after notification
        setReminders(prev => prev.filter(r => r.jobId !== job.id));
      }, delay);

      setReminders(prev => [
        ...prev.filter(r => r.jobId !== job.id),
        { jobId: job.id, timeoutId }
      ]);

      return true;
    }

    return false;
  }, [permission, reminders]);

  // Cancel a scheduled notification
  const cancelNotification = useCallback((jobId: string) => {
    const reminder = reminders.find(r => r.jobId === jobId);
    if (reminder) {
      window.clearTimeout(reminder.timeoutId);
      setReminders(prev => prev.filter(r => r.jobId !== jobId));
    }
  }, [reminders]);

  // Schedule notifications for all jobs with follow-up dates
  const scheduleAllNotifications = useCallback((jobs: JobApplication[]) => {
    if (permission !== 'granted') return;

    jobs.forEach(job => {
      if (job.followUpDate) {
        scheduleNotification(job);
      }
    });
  }, [permission, scheduleNotification]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      reminders.forEach(reminder => {
        window.clearTimeout(reminder.timeoutId);
      });
    };
  }, [reminders]);

  return {
    permission,
    requestPermission,
    scheduleNotification,
    cancelNotification,
    scheduleAllNotifications
  };
}
