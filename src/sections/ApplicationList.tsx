import { motion, AnimatePresence } from 'framer-motion';
import { Search, Edit2, Trash2, Calendar, Building2, Clock, X, Briefcase } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { JobApplication, JobStatus } from '@/types/job';
import { statusColors, statusIcons } from '@/types/job';
import { useState, useMemo } from 'react';

interface ApplicationListProps {
  jobs: JobApplication[];
  onEdit: (job: JobApplication) => void;
  onDelete: (id: string) => void;
}

type SortOption = 'date-desc' | 'date-asc' | 'status';
type FilterOption = 'all' | JobStatus;

export function ApplicationList({ jobs, onEdit, onDelete }: ApplicationListProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('date-desc');
  const [filterBy, setFilterBy] = useState<FilterOption>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredJobs = useMemo(() => {
    let result = [...jobs];

    // Search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        job =>
          job.jobTitle.toLowerCase().includes(query) ||
          job.company.toLowerCase().includes(query)
      );
    }

    // Status filter
    if (filterBy !== 'all') {
      result = result.filter(job => job.status === filterBy);
    }

    // Sort
    result.sort((a, b) => {
      switch (sortBy) {
        case 'date-desc':
          return new Date(b.applicationDate).getTime() - new Date(a.applicationDate).getTime();
        case 'date-asc':
          return new Date(a.applicationDate).getTime() - new Date(b.applicationDate).getTime();
        case 'status':
          return a.status.localeCompare(b.status);
        default:
          return 0;
      }
    });

    return result;
  }, [jobs, searchQuery, sortBy, filterBy]);

  const handleDelete = (id: string) => {
    setDeletingId(id);
    setTimeout(() => {
      onDelete(id);
      setDeletingId(null);
    }, 300);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring' as const,
        stiffness: 300,
        damping: 24
      }
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: { duration: 0.3 }
    }
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
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Your Applications</h2>
          <p className="text-blue-200/70 text-lg">Manage and track all your job applications</p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 p-4 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300/50" />
              <Input
                type="text"
                placeholder="Search by job title or company..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-blue-200/40 focus:border-blue-400/50 focus:ring-blue-400/20"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300/50 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Filter */}
            <div className="flex gap-2">
              <select
                value={filterBy}
                onChange={(e) => setFilterBy(e.target.value as FilterOption)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20"
              >
                <option value="all" className="bg-slate-900">All Status</option>
                <option value="Applied" className="bg-slate-900">Applied</option>
                <option value="Interviewed" className="bg-slate-900">Interviewed</option>
                <option value="Offered" className="bg-slate-900">Offered</option>
                <option value="Rejected" className="bg-slate-900">Rejected</option>
              </select>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-blue-400/50 focus:ring-1 focus:ring-blue-400/20"
              >
                <option value="date-desc" className="bg-slate-900">Newest First</option>
                <option value="date-asc" className="bg-slate-900">Oldest First</option>
                <option value="status" className="bg-slate-900">By Status</option>
              </select>
            </div>
          </div>

          {/* Active Filters */}
          {(filterBy !== 'all' || searchQuery) && (
            <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-white/10">
              <span className="text-sm text-blue-200/50">Active filters:</span>
              {filterBy !== 'all' && (
                <Badge
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-300 border border-blue-400/30 cursor-pointer hover:bg-blue-500/30"
                  onClick={() => setFilterBy('all')}
                >
                  Status: {filterBy} ×
                </Badge>
              )}
              {searchQuery && (
                <Badge
                  variant="secondary"
                  className="bg-blue-500/20 text-blue-300 border border-blue-400/30 cursor-pointer hover:bg-blue-500/30"
                  onClick={() => setSearchQuery('')}
                >
                  Search: {searchQuery} ×
                </Badge>
              )}
            </div>
          )}
        </motion.div>

        {/* Applications Grid */}
        {filteredJobs.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredJobs.map((job) => (
                <motion.div
                  key={job.id}
                  variants={itemVariants}
                  layout
                  exit="exit"
                  whileHover={{ scale: 1.02, y: -5 }}
                  className={`relative p-5 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all duration-300 group ${
                    deletingId === job.id ? 'opacity-0 scale-90' : ''
                  }`}
                >
                  {/* Status Badge */}
                  <div className="flex items-start justify-between mb-4">
                    <Badge
                      className={`${statusColors[job.status].bg} ${statusColors[job.status].text} ${statusColors[job.status].border} border backdrop-blur-sm`}
                    >
                      <span className="mr-1">{statusIcons[job.status]}</span>
                      {job.status}
                    </Badge>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEdit(job)}
                        className="w-8 h-8 text-blue-300 hover:text-white hover:bg-blue-500/20"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(job.id)}
                        className="w-8 h-8 text-red-300 hover:text-red-200 hover:bg-red-500/20"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Job Info */}
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{job.jobTitle}</h3>
                    <div className="flex items-center gap-2 text-blue-200/70">
                      <Building2 className="w-4 h-4" />
                      <span className="text-sm line-clamp-1">{job.company}</span>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="flex items-center gap-4 text-sm text-blue-200/50 mb-4">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>Applied: {new Date(job.applicationDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* Follow-up Date */}
                  {job.followUpDate && (
                    <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-400/20 mb-3">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span className="text-xs text-amber-300">
                        Follow-up: {new Date(job.followUpDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {/* Notes */}
                  {job.notes && (
                    <div className="text-sm text-blue-200/60 line-clamp-2 border-t border-white/10 pt-3">
                      {job.notes}
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 px-4"
          >
            <div className="max-w-md mx-auto p-8 rounded-3xl bg-white/5 backdrop-blur-md border border-white/10">
              <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-emerald-500/20 flex items-center justify-center">
                <Briefcase className="w-10 h-10 text-blue-300" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                {searchQuery || filterBy !== 'all' ? 'No matches found' : 'No applications yet'}
              </h3>
              <p className="text-blue-200/60 mb-6">
                {searchQuery || filterBy !== 'all'
                  ? 'Try adjusting your search or filters'
                  : 'Add your first job application to start tracking your job hunt!'}
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </section>
  );
}
