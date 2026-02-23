import { motion, AnimatePresence } from 'framer-motion';
import { X, Briefcase, Building2, Calendar, FileText, Bell, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { JobApplication, JobStatus } from '@/types/job';
import { useState, useEffect } from 'react';

interface JobModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (job: Omit<JobApplication, 'id' | 'createdAt' | 'updatedAt'>) => void;
  editingJob?: JobApplication | null;
}

interface FormErrors {
  jobTitle?: string;
  company?: string;
  applicationDate?: string;
  status?: string;
  followUpDate?: string;
}

const statusOptions: JobStatus[] = ['Applied', 'Interviewed', 'Offered', 'Rejected'];

export function JobModal({ isOpen, onClose, onSave, editingJob }: JobModalProps) {
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    applicationDate: new Date().toISOString().split('T')[0],
    status: 'Applied' as JobStatus,
    followUpDate: '',
    notes: ''
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal opens/closes or editing job changes
  useEffect(() => {
    if (isOpen) {
      if (editingJob) {
        setFormData({
          jobTitle: editingJob.jobTitle,
          company: editingJob.company,
          applicationDate: editingJob.applicationDate,
          status: editingJob.status,
          followUpDate: editingJob.followUpDate || '',
          notes: editingJob.notes || ''
        });
      } else {
        setFormData({
          jobTitle: '',
          company: '',
          applicationDate: new Date().toISOString().split('T')[0],
          status: 'Applied',
          followUpDate: '',
          notes: ''
        });
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, editingJob]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.jobTitle.trim()) {
      newErrors.jobTitle = 'Job title is required';
    }

    if (!formData.company.trim()) {
      newErrors.company = 'Company name is required';
    }

    if (!formData.applicationDate) {
      newErrors.applicationDate = 'Application date is required';
    } else {
      const appDate = new Date(formData.applicationDate);
      const now = new Date();
      now.setHours(23, 59, 59, 999);
      if (appDate > now) {
        newErrors.applicationDate = 'Application date cannot be in the future';
      }
    }

    if (formData.followUpDate) {
      const followUpDate = new Date(formData.followUpDate);
      const appDate = new Date(formData.applicationDate);
      if (followUpDate < appDate) {
        newErrors.followUpDate = 'Follow-up date must be after application date';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    // Simulate a brief delay for the animation
    await new Promise(resolve => setTimeout(resolve, 300));

    onSave({
      jobTitle: formData.jobTitle.trim(),
      company: formData.company.trim(),
      applicationDate: formData.applicationDate,
      status: formData.status,
      followUpDate: formData.followUpDate || undefined,
      notes: formData.notes.trim() || undefined
    });

    setIsSubmitting(false);
    onClose();
  };

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field as keyof FormErrors]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: 'spring',
              stiffness: 300,
              damping: 25
            }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div 
              className="w-full max-w-lg max-h-[90vh] overflow-y-auto pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative p-6 sm:p-8 rounded-3xl bg-slate-900/90 backdrop-blur-xl border border-white/10 shadow-2xl">
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-xl text-blue-200/50 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {editingJob ? 'Edit Application' : 'Add New Application'}
                  </h2>
                  <p className="text-blue-200/60">
                    {editingJob ? 'Update your job application details' : 'Track a new job opportunity'}
                  </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Job Title */}
                  <div className="space-y-2">
                    <Label htmlFor="jobTitle" className="text-white/80 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-400" />
                      Job Title *
                    </Label>
                    <Input
                      id="jobTitle"
                      type="text"
                      placeholder="e.g., Senior Frontend Developer"
                      value={formData.jobTitle}
                      onChange={(e) => handleChange('jobTitle', e.target.value)}
                      className={`bg-white/5 border-white/10 text-white placeholder:text-blue-200/30 focus:border-blue-400/50 focus:ring-blue-400/20 ${
                        errors.jobTitle ? 'border-red-400/50 focus:border-red-400/50' : ''
                      }`}
                    />
                    {errors.jobTitle && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-sm text-red-400"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.jobTitle}
                      </motion.p>
                    )}
                  </div>

                  {/* Company */}
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-white/80 flex items-center gap-2">
                      <Building2 className="w-4 h-4 text-emerald-400" />
                      Company *
                    </Label>
                    <Input
                      id="company"
                      type="text"
                      placeholder="e.g., Google"
                      value={formData.company}
                      onChange={(e) => handleChange('company', e.target.value)}
                      className={`bg-white/5 border-white/10 text-white placeholder:text-blue-200/30 focus:border-blue-400/50 focus:ring-blue-400/20 ${
                        errors.company ? 'border-red-400/50 focus:border-red-400/50' : ''
                      }`}
                    />
                    {errors.company && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-sm text-red-400"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.company}
                      </motion.p>
                    )}
                  </div>

                  {/* Application Date & Status */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="applicationDate" className="text-white/80 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-amber-400" />
                        Application Date *
                      </Label>
                      <Input
                        id="applicationDate"
                        type="date"
                        value={formData.applicationDate}
                        onChange={(e) => handleChange('applicationDate', e.target.value)}
                        className={`bg-white/5 border-white/10 text-white focus:border-blue-400/50 focus:ring-blue-400/20 ${
                          errors.applicationDate ? 'border-red-400/50 focus:border-red-400/50' : ''
                        }`}
                      />
                      {errors.applicationDate && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="flex items-center gap-1 text-sm text-red-400"
                        >
                          <AlertCircle className="w-4 h-4" />
                          {errors.applicationDate}
                        </motion.p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="status" className="text-white/80">
                        Status *
                      </Label>
                      <select
                        id="status"
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value as JobStatus)}
                        className="w-full px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20"
                      >
                        {statusOptions.map(status => (
                          <option key={status} value={status} className="bg-slate-900">
                            {status}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Follow-up Date */}
                  <div className="space-y-2">
                    <Label htmlFor="followUpDate" className="text-white/80 flex items-center gap-2">
                      <Bell className="w-4 h-4 text-purple-400" />
                      Follow-up Date (Optional)
                    </Label>
                    <Input
                      id="followUpDate"
                      type="date"
                      value={formData.followUpDate}
                      onChange={(e) => handleChange('followUpDate', e.target.value)}
                      className={`bg-white/5 border-white/10 text-white focus:border-blue-400/50 focus:ring-blue-400/20 ${
                        errors.followUpDate ? 'border-red-400/50 focus:border-red-400/50' : ''
                      }`}
                    />
                    {errors.followUpDate && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-1 text-sm text-red-400"
                      >
                        <AlertCircle className="w-4 h-4" />
                        {errors.followUpDate}
                      </motion.p>
                    )}
                    <p className="text-xs text-blue-200/40">
                      Set a reminder to follow up on this application
                    </p>
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-white/80 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      placeholder="Add any additional details..."
                      value={formData.notes}
                      onChange={(e) => handleChange('notes', e.target.value)}
                      rows={3}
                      className="bg-white/5 border-white/10 text-white placeholder:text-blue-200/30 focus:border-blue-400/50 focus:ring-blue-400/20 resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="flex-1 bg-transparent border-white/20 text-white hover:bg-white/10 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 bg-gradient-to-r from-blue-500 to-emerald-500 hover:from-blue-600 hover:to-emerald-600 text-white disabled:opacity-50"
                    >
                      <motion.span
                        animate={isSubmitting ? { scale: [1, 0.95, 1] } : {}}
                        transition={{ repeat: Infinity, duration: 0.5 }}
                      >
                        {isSubmitting ? 'Saving...' : editingJob ? 'Update' : 'Add Application'}
                      </motion.span>
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
