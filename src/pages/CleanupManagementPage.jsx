import React, { useState, useEffect } from 'react';
import {
  CheckSquare,
  Clock,
  CheckCircle,
  Truck,
  Users,
  Calendar,
  MapPin,
  Camera,
  Layers,
  ArrowRight,
  Filter,
  Check,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { cleanupService } from '../services/cleanupService';
import { formatDate } from '../utils/dateUtils';

export function CleanupManagementPage() {
  const [cleanups, setCleanups] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'in_progress' | 'completed'
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState(null);
  const [assignModalTask, setAssignModalTask] = useState(null);
  const [assignedTeamInput, setAssignedTeamInput] = useState('');
  const [scheduledDateInput, setScheduledDateInput] = useState('');
  const [statusNotification, setStatusNotification] = useState(null);

  useEffect(() => {
    loadCleanups();
  }, [activeTab]);

  const loadCleanups = async () => {
    setLoading(true);
    try {
      const data = await cleanupService.getCleanups(activeTab);
      setCleanups(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      await cleanupService.updateTaskStatus(taskId, newStatus);
      setStatusNotification(`Task ${taskId} status updated to: ${newStatus.replace('_', ' ').toUpperCase()}`);
      loadCleanups();
      setTimeout(() => setStatusNotification(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleAssignSave = async (e) => {
    e.preventDefault();
    if (!assignModalTask) return;

    try {
      await cleanupService.assignTask(
        assignModalTask.id,
        assignedTeamInput || 'District Sanitation Squad',
        scheduledDateInput || new Date().toISOString()
      );
      setStatusNotification(`Task ${assignModalTask.id} dispatched to ${assignedTeamInput}.`);
      setAssignModalTask(null);
      loadCleanups();
      setTimeout(() => setStatusNotification(null), 3000);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-sage-200">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-forest-100 text-forest-800 mb-1.5">
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Operational Dispatch Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
            Cleanup Operations & Verification
          </h1>
          <p className="text-xs sm:text-sm text-charcoal-500 mt-1 max-w-2xl">
            Coordinate sanitation crew dispatch, certify site restorations with before-and-after photographic comparisons, and audit completed tasks.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCleanups}
          >
            Refresh Queue
          </Button>
        </div>
      </div>

      {statusNotification && (
        <div className="p-3.5 rounded-xl bg-forest-50 border border-forest-200 text-forest-800 text-xs font-medium flex items-center gap-2 shadow-soft">
          <CheckCircle className="w-4 h-4 text-forest-600 shrink-0" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between border-b border-sage-200">
        <div className="flex space-x-1 sm:space-x-4">
          {[
            { id: 'all', label: 'All Operations' },
            { id: 'pending', label: 'Pending Dispatch' },
            { id: 'in_progress', label: 'In Progress' },
            { id: 'completed', label: 'Completed & Certified' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-3 text-xs sm:text-sm font-semibold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-forest text-forest-900 font-bold'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-charcoal-400 font-medium hidden sm:inline">
          {cleanups.length} Tasks in current view
        </span>
      </div>

      {/* Tasks Grid */}
      {loading ? (
        <LoadingSkeleton count={3} height="h-40" />
      ) : cleanups.length === 0 ? (
        <EmptyState
          icon={CheckSquare}
          title="No cleanup tasks found"
          description="There are currently no sanitation tasks matching this status filter."
          actionLabel="Show All Tasks"
          onAction={() => setActiveTab('all')}
        />
      ) : (
        <div className="space-y-4">
          {cleanups.map((task) => {
            const isCompleted = task.status === 'completed';
            const isInProgress = task.status === 'in_progress';

            return (
              <Card key={task.id} className="p-5 space-y-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold text-charcoal-400">
                        {task.id}
                      </span>
                      <span className="text-xs text-charcoal-300">•</span>
                      <span className="font-mono text-xs text-forest-700 font-medium">
                        Ref: {task.reportId}
                      </span>
                      <span className="text-xs text-charcoal-300">•</span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-forest-50 text-forest-800 border-forest-200'
                            : isInProgress
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-amber-50 text-amber-800 border-amber-200'
                        }`}
                      >
                        {isCompleted
                          ? 'Certified Cleaned'
                          : isInProgress
                          ? 'Squad Dispatched'
                          : 'Awaiting Crew'}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-charcoal-900">{task.taskName}</h3>

                    <div className="flex items-center gap-1.5 text-xs text-charcoal-500">
                      <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                      <span>{task.location}</span>
                    </div>
                  </div>

                  {/* Actions / Status changer */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedTask(task)}
                    >
                      {task.afterImageUrl ? 'Compare Before & After' : 'Inspect Task'}
                    </Button>

                    {!isCompleted && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setAssignModalTask(task);
                          setAssignedTeamInput(task.assignedTeam || '');
                          setScheduledDateInput(task.scheduledDate?.slice(0, 10) || '');
                        }}
                      >
                        Reassign Crew
                      </Button>
                    )}

                    {!isCompleted && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Check}
                        onClick={() => handleStatusChange(task.id, isCompleted ? 'in_progress' : 'completed')}
                      >
                        Mark Completed
                      </Button>
                    )}
                  </div>
                </div>

                {/* Details Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded-xl bg-offwhite-100 border border-sage-200 text-xs">
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-medium block">Assigned Crew</span>
                    <span className="font-semibold text-charcoal-900 truncate block">
                      {task.assignedTeam || 'Unassigned'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-medium block">Lead Contact</span>
                    <span className="font-semibold text-charcoal-800 truncate block">{task.contactLead}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-medium block">Scheduled Date</span>
                    <span className="font-semibold text-charcoal-800 block">
                      {formatDate(task.scheduledDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-medium block">Volume Estimate</span>
                    <span className="font-semibold text-forest-800 block">
                      {task.wasteVolumeEstimate}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Before & After Photo Viewer Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask ? `Verification Audit: ${selectedTask.taskName}` : 'Task Details'}
        maxWidth="max-w-4xl"
      >
        {selectedTask && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Before Photo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                    Before: Public Report Incident
                  </span>
                  <span className="text-[11px] text-charcoal-400 font-mono">Original Capture</span>
                </div>
                <div className="h-64 rounded-xl overflow-hidden bg-sage-100 border border-sage-200">
                  {selectedTask.beforeImageUrl ? (
                    <img
                      src={selectedTask.beforeImageUrl}
                      alt="Before Cleanup"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex items-center justify-center text-xs text-charcoal-400">
                      No before photo recorded
                    </div>
                  )}
                </div>
              </div>

              {/* After Photo */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-forest-800 flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-forest-600" />
                    After: Municipal Crew Certification
                  </span>
                  <span className="text-[11px] text-charcoal-400 font-mono">
                    {selectedTask.completedAt ? formatDate(selectedTask.completedAt) : 'Pending clearance'}
                  </span>
                </div>
                <div className="h-64 rounded-xl overflow-hidden bg-sage-100 border border-sage-200">
                  {selectedTask.afterImageUrl ? (
                    <img
                      src={selectedTask.afterImageUrl}
                      alt="After Cleanup Restored Site"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-xs text-charcoal-400 p-6 text-center space-y-2">
                      <Camera className="w-8 h-8 text-charcoal-300" />
                      <p className="font-semibold text-charcoal-600">Pending Photographic Resolution</p>
                      <p className="text-[11px] text-charcoal-400">
                        Crew will upload proof upon physical clearance.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Task Operational Notes */}
            <div className="p-4 rounded-xl bg-offwhite-100 border border-sage-200 space-y-1 text-xs">
              <span className="font-bold text-charcoal-900">Sanitation Field Notes:</span>
              <p className="text-charcoal-600 leading-relaxed">{selectedTask.notes}</p>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-sage-200">
              <span className="text-xs text-charcoal-500 font-mono">
                Assigned Team: {selectedTask.assignedTeam}
              </span>
              <Button variant="primary" size="sm" onClick={() => setSelectedTask(null)}>
                Close Audit View
              </Button>
            </div>
          </div>
        )}
      </Modal>

      {/* Task Assignment Modal */}
      <Modal
        isOpen={!!assignModalTask}
        onClose={() => setAssignModalTask(null)}
        title="Assign Cleanup Crew & Schedule"
        maxWidth="max-w-md"
      >
        <form onSubmit={handleAssignSave} className="space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-charcoal-700 mb-1">
              Sanitation Crew / Team
            </label>
            <select
              value={assignedTeamInput}
              onChange={(e) => setAssignedTeamInput(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            >
              <option value="Metro Rapid Response - Squad A">Metro Rapid Response - Squad A</option>
              <option value="Urban Estuary Cleanup Crew">Urban Estuary Cleanup Crew</option>
              <option value="Parks & Recreation Team 3">Parks & Recreation Team 3</option>
              <option value="District 5 Municipal Sanitation">District 5 Municipal Sanitation</option>
              <option value="HazMat Certified Disposal Services">HazMat Certified Disposal Services</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-charcoal-700 mb-1">
              Target Execution Date
            </label>
            <input
              type="date"
              value={scheduledDateInput}
              onChange={(e) => setScheduledDateInput(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-sage-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAssignModalTask(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Save & Dispatch
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

