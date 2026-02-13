import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar,
  Clock,
  DollarSign,
  User,
} from 'lucide-react';
import JobModal from './JobModal';

interface Job {
  id: string;
  customer_id: string;
  title: string;
  services: string[];
  status: string;
  scheduled_date: string;
  scheduled_time: string;
  estimated_duration: number;
  price: number | null;
  notes: string;
  crew_notes: string;
  created_at: string;
  customer?: { first_name: string; last_name: string };
}

interface CustomerOption {
  id: string;
  first_name: string;
  last_name: string;
}

const STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  scheduled: { bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  in_progress: { bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  completed: { bg: 'bg-green-50', text: 'text-green-700', dot: 'bg-green-500' },
  cancelled: { bg: 'bg-slate-50', text: 'text-slate-500', dot: 'bg-slate-400' },
};

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

export default function Schedule() {
  const [searchParams] = useSearchParams();
  const preselectedCustomer = searchParams.get('customer');

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [jobs, setJobs] = useState<Job[]>([]);
  const [customers, setCustomers] = useState<CustomerOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const [showModal, setShowModal] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const startDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-01`;
    const endDate = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${getDaysInMonth(currentYear, currentMonth)}`;

    const [jobsRes, customersRes] = await Promise.all([
      supabase
        .from('jobs')
        .select('*')
        .gte('scheduled_date', startDate)
        .lte('scheduled_date', endDate)
        .order('scheduled_time', { ascending: true }),
      supabase
        .from('customers')
        .select('id, first_name, last_name')
        .order('first_name', { ascending: true }),
    ]);

    if (jobsRes.data) {
      const customerIds = [...new Set(jobsRes.data.map((j) => j.customer_id))];
      let customerMap: Record<string, { first_name: string; last_name: string }> = {};

      if (customerIds.length > 0) {
        const { data: custData } = await supabase
          .from('customers')
          .select('id, first_name, last_name')
          .in('id', customerIds);

        if (custData) {
          customerMap = custData.reduce((acc, c) => {
            acc[c.id] = { first_name: c.first_name, last_name: c.last_name };
            return acc;
          }, {} as Record<string, { first_name: string; last_name: string }>);
        }
      }

      setJobs(
        jobsRes.data.map((j) => ({
          ...j,
          customer: customerMap[j.customer_id],
        }))
      );
    }

    if (customersRes.data) setCustomers(customersRes.data);
    setLoading(false);
  }, [currentMonth, currentYear]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (preselectedCustomer) {
      const todayStr = today.toISOString().split('T')[0];
      setSelectedDate(todayStr);
      setEditingJob(null);
      setShowModal(true);
    }
  }, [preselectedCustomer]);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  const goToToday = () => {
    setCurrentMonth(today.getMonth());
    setCurrentYear(today.getFullYear());
  };

  const handleDayClick = (dateStr: string) => {
    setSelectedDate(dateStr);
    setEditingJob(null);
    setShowModal(true);
  };

  const handleJobClick = (e: React.MouseEvent, job: Job) => {
    e.stopPropagation();
    setEditingJob(job);
    setSelectedDate(job.scheduled_date);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setEditingJob(null);
    setSelectedDate(null);
  };

  const handleJobSaved = () => {
    handleModalClose();
    fetchData();
  };

  const getJobsForDate = (dateStr: string) =>
    jobs.filter((j) => j.scheduled_date === dateStr);

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
  const monthName = new Date(currentYear, currentMonth).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

  const calendarDays: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) calendarDays.push(null);
  for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

  const upcomingJobs = jobs
    .filter((j) => j.status !== 'cancelled' && j.scheduled_date >= todayStr)
    .sort((a, b) => a.scheduled_date.localeCompare(b.scheduled_date) || (a.scheduled_time || '').localeCompare(b.scheduled_time || ''));

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Schedule</h1>
          <p className="text-slate-500 text-sm mt-1">{jobs.length} jobs this month</p>
        </div>
        <button
          onClick={() => {
            setSelectedDate(todayStr);
            setEditingJob(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium hover:bg-slate-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          New Job
        </button>
      </div>

      <div className="bg-white border border-slate-200">
        <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button onClick={prevMonth} className="p-1.5 hover:bg-slate-100 transition-colors">
              <ChevronLeft className="w-5 h-5 text-slate-600" />
            </button>
            <h2 className="text-base font-semibold text-slate-900 min-w-[180px] text-center">{monthName}</h2>
            <button onClick={nextMonth} className="p-1.5 hover:bg-slate-100 transition-colors">
              <ChevronRight className="w-5 h-5 text-slate-600" />
            </button>
          </div>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
          >
            Today
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-7 border-b border-slate-200">
              {DAYS.map((day) => (
                <div key={day} className="px-2 py-2 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  {day}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <div key={`empty-${idx}`} className="min-h-[100px] bg-slate-50/50 border-b border-r border-slate-100" />;
                }

                const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const dayJobs = getJobsForDate(dateStr);
                const isToday = dateStr === todayStr;

                return (
                  <div
                    key={dateStr}
                    onClick={() => handleDayClick(dateStr)}
                    className={`min-h-[100px] border-b border-r border-slate-100 p-1.5 cursor-pointer hover:bg-slate-50 transition-colors ${
                      isToday ? 'bg-sky-50/40' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={`text-xs font-medium w-6 h-6 flex items-center justify-center ${
                          isToday
                            ? 'bg-slate-900 text-white'
                            : 'text-slate-600'
                        }`}
                      >
                        {day}
                      </span>
                      {dayJobs.length > 0 && (
                        <span className="text-[10px] font-medium text-slate-400">{dayJobs.length}</span>
                      )}
                    </div>

                    <div className="space-y-0.5">
                      {dayJobs.slice(0, 3).map((job) => {
                        const colors = STATUS_COLORS[job.status] || STATUS_COLORS.scheduled;
                        return (
                          <button
                            key={job.id}
                            onClick={(e) => handleJobClick(e, job)}
                            className={`w-full text-left px-1.5 py-0.5 text-[11px] truncate ${colors.bg} ${colors.text} hover:opacity-80 transition-opacity`}
                          >
                            <span className={`inline-block w-1.5 h-1.5 mr-1 ${colors.dot}`} />
                            {job.scheduled_time && <span className="font-medium">{job.scheduled_time} </span>}
                            {job.customer?.first_name ? `${job.customer.first_name} ${job.customer.last_name?.charAt(0)}.` : job.title}
                          </button>
                        );
                      })}
                      {dayJobs.length > 3 && (
                        <p className="text-[10px] text-slate-400 px-1.5">+{dayJobs.length - 3} more</p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {upcomingJobs.length > 0 && (
        <div className="mt-6 bg-white border border-slate-200">
          <div className="px-5 py-4 border-b border-slate-200">
            <h2 className="font-semibold text-slate-900">Upcoming Jobs</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {upcomingJobs.slice(0, 8).map((job) => {
              const colors = STATUS_COLORS[job.status] || STATUS_COLORS.scheduled;
              return (
                <button
                  key={job.id}
                  onClick={(e) => handleJobClick(e, job)}
                  className="w-full text-left px-5 py-3 hover:bg-slate-50 transition-colors flex items-center justify-between"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-slate-900">{job.title}</p>
                    <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-500">
                      {job.customer && (
                        <span className="flex items-center gap-1">
                          <User className="w-3.5 h-3.5" />
                          {job.customer.first_name} {job.customer.last_name}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(job.scheduled_date + 'T00:00:00').toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                      </span>
                      {job.scheduled_time && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {job.scheduled_time}
                        </span>
                      )}
                      {job.price !== null && (
                        <span className="flex items-center gap-1">
                          <DollarSign className="w-3.5 h-3.5" />
                          ${job.price}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 flex-shrink-0 ${colors.bg} ${colors.text}`}>
                    {job.status === 'in_progress' ? 'In Progress' : job.status.charAt(0).toUpperCase() + job.status.slice(1)}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {showModal && (
        <JobModal
          date={selectedDate || todayStr}
          job={editingJob}
          customers={customers}
          preselectedCustomerId={preselectedCustomer}
          onClose={handleModalClose}
          onSaved={handleJobSaved}
        />
      )}
    </div>
  );
}
