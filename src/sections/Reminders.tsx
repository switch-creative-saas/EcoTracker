import { motion } from 'framer-motion';
import { Bell, Calendar, Building2, CheckCircle, AlertCircle, BellOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { JobApplication } from '@/types/job';
import { useMemo } from 'react';

interface RemindersProps {
  jobs: JobApplication[];
  notificationPermission: NotificationPermission;
  onRequestPermission: () => void;
}

export function Reminders({ jobs, notificationPermission, onRequestPermission }: RemindersProps) {
  const upcomingReminders = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return jobs
      .filter(job => job.followUpDate)
      .map(job => ({
        ...job,
        followUpDate: job.followUpDate!
      }))
      .filter(job => {
        const followUp = new Date(job.followUpDate);
        followUp.setHours(0, 0, 0, 0);
        return followUp >= now;
      })
      .sort((a, b) => new Date(a.followUpDate).getTime() - new Date(b.followUpDate).getTime())
      .slice(0, 5);
  }, [jobs]);

  const overdueReminders = useMemo(() => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    return jobs
      .filter(job => job.followUpDate)
      .map(job => ({
        ...job,
        followUpDate: job.followUpDate!
      }))
      .filter(job => {
        const followUp = new Date(job.followUpDate);
        followUp.setHours(0, 0, 0, 0);
        return followUp < now;
      })
      .sort((a, b) => new Date(b.followUpDate).getTime() - new Date(a.followUpDate).getTime())
      .slice(0, 3);
  }, [jobs]);

  const getDaysUntil = (dateString: string): number => {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const date = new Date(dateString);
    date.setHours(0, 0, 0, 0);
    const diffTime = date.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const getDaysText = (days: number): string => {
    if (days === 0) return 'Today';
    if (days === 1) return 'Tomorrow';
    return `In ${days} days`;
  };

  return (
    <section className="py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Reminders</h2>
          <p className="text-blue-200/70 text-lg">Stay on top of your follow-ups</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Notification Permission Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-1"
          >
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 h-full">
              <div className="flex items-center gap-3 mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  notificationPermission === 'granted'
                    ? 'bg-green-500/20'
                    : notificationPermission === 'denied'
                    ? 'bg-red-500/20'
                    : 'bg-amber-500/20'
                }`}>
                  {notificationPermission === 'granted' ? (
                    <Bell className="w-6 h-6 text-green-400" />
                  ) : notificationPermission === 'denied' ? (
                    <BellOff className="w-6 h-6 text-red-400" />
                  ) : (
                    <Bell className="w-6 h-6 text-amber-400" />
                  )}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">Notifications</h3>
                  <p className={`text-sm ${
                    notificationPermission === 'granted'
                      ? 'text-green-400'
                      : notificationPermission === 'denied'
                      ? 'text-red-400'
                      : 'text-amber-400'
                  }`}>
                    {notificationPermission === 'granted'
                      ? 'Enabled'
                      : notificationPermission === 'denied'
                      ? 'Blocked'
                      : 'Not enabled'}
                  </p>
                </div>
              </div>

              <p className="text-blue-200/60 text-sm mb-6">
                {notificationPermission === 'granted'
                  ? 'You will receive browser notifications for your follow-up reminders.'
                  : notificationPermission === 'denied'
                  ? 'Notifications are blocked. Please enable them in your browser settings to receive reminders.'
                  : 'Enable browser notifications to get reminded about your follow-up dates.'}
              </p>

              {notificationPermission !== 'granted' && notificationPermission !== 'denied' && (
                <Button
                  onClick={onRequestPermission}
                  className="w-full bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white"
                >
                  <Bell className="w-4 h-4 mr-2" />
                  Enable Notifications
                </Button>
              )}

              {notificationPermission === 'denied' && (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-400/20">
                  <p className="text-sm text-red-300 flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    Please update your browser settings to allow notifications from this site.
                  </p>
                </div>
              )}
            </div>
          </motion.div>

          {/* Reminders List */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-400" />
                Upcoming Follow-ups
              </h3>

              {upcomingReminders.length > 0 ? (
                <div className="space-y-3">
                  {upcomingReminders.map((job, index) => {
                    const daysUntil = getDaysUntil(job.followUpDate);
                    return (
                      <motion.div
                        key={job.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all duration-200"
                      >
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          daysUntil === 0
                            ? 'bg-red-500/20'
                            : daysUntil === 1
                            ? 'bg-amber-500/20'
                            : 'bg-blue-500/20'
                        }`}>
                          <Bell className={`w-5 h-5 ${
                            daysUntil === 0
                              ? 'text-red-400'
                              : daysUntil === 1
                              ? 'text-amber-400'
                              : 'text-blue-400'
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-white font-medium truncate">{job.jobTitle}</h4>
                          <div className="flex items-center gap-2 text-sm text-blue-200/60">
                            <Building2 className="w-3 h-3" />
                            <span className="truncate">{job.company}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className={`text-sm font-medium ${
                            daysUntil === 0
                              ? 'text-red-400'
                              : daysUntil === 1
                              ? 'text-amber-400'
                              : 'text-blue-400'
                          }`}>
                            {getDaysText(daysUntil)}
                          </div>
                          <div className="text-xs text-blue-200/40">
                            {new Date(job.followUpDate).toLocaleDateString()}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CheckCircle className="w-12 h-12 text-green-400/50 mx-auto mb-3" />
                  <p className="text-blue-200/60">No upcoming reminders</p>
                  <p className="text-sm text-blue-200/40 mt-1">
                    Add follow-up dates to your applications
                  </p>
                </div>
              )}

              {/* Overdue Section */}
              {overdueReminders.length > 0 && (
                <>
                  <h4 className="text-md font-semibold text-white mt-6 mb-3 flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                    Overdue
                  </h4>
                  <div className="space-y-3">
                    {overdueReminders.map((job, index) => {
                      const daysOverdue = Math.abs(getDaysUntil(job.followUpDate));
                      return (
                        <motion.div
                          key={job.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="flex items-center gap-4 p-4 rounded-xl bg-red-500/5 hover:bg-red-500/10 border border-red-400/10 hover:border-red-400/20 transition-all duration-200"
                        >
                          <div className="w-10 h-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                            <AlertCircle className="w-5 h-5 text-red-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium truncate">{job.jobTitle}</h4>
                            <div className="flex items-center gap-2 text-sm text-blue-200/60">
                              <Building2 className="w-3 h-3" />
                              <span className="truncate">{job.company}</span>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-red-400">
                              {daysOverdue === 0 ? 'Today' : `${daysOverdue} day${daysOverdue > 1 ? 's' : ''} overdue`}
                            </div>
                            <div className="text-xs text-blue-200/40">
                              {new Date(job.followUpDate).toLocaleDateString()}
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
