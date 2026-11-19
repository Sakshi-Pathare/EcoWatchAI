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
  Sparkles,
  Sliders,
  ShieldCheck,
  UploadCloud,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { EmptyState } from '../components/common/EmptyState';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { cleanupService } from '../services/cleanupService';
import { formatDate } from '../utils/dateUtils';
import { compressImageFile } from '../utils/imageStorage';

export function CleanupManagementPage() {
  const [cleanups, setCleanups] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'pending' | 'in_progress' | 'completed'
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  const [selectedTask, setSelectedTask] = useState(null);
  const [sliderPosition, setSliderPosition] = useState(50); // 0 to 100 for before/after comparison
  const [assignModalTask, setAssignModalTask] = useState(null);
  const [assignedTeamInput, setAssignedTeamInput] = useState('');
  const [scheduledDateInput, setScheduledDateInput] = useState('');
  const [statusNotification, setStatusNotification] = useState(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);

  useEffect(() => {
    loadCleanups();
  }, [activeTab]);

  const loadCleanups = async () => {
    setLoading(true);
    setLoadError('');
    try {
      const data = await cleanupService.getCleanups(activeTab);
      setCleanups(data);
    } catch (e) {
      setLoadError(e.message || 'Unable to load cleanup tasks.');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId, newStatus, afterImageUrl = null) => {
    try {
      const updatedTask = await cleanupService.updateTaskStatus(taskId, newStatus, afterImageUrl);
      setStatusNotification(`Task ${taskId} status updated to: ${newStatus.replace('_', ' ').toUpperCase()}`);
      loadCleanups();
      setTimeout(() => setStatusNotification(null), 3000);
      return updatedTask;
    } catch (e) {
      setStatusNotification(e.message || 'Unable to update cleanup status.');
      return null;
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
      setStatusNotification(e.message || 'Unable to assign this cleanup task.');
    }
  };

  const totalTasks = cleanups.length;
  const completedTasks = cleanups.filter(c => c.status === 'completed').length;
  const inProgressTasks = cleanups.filter(c => c.status === 'in_progress').length;
  const pendingTasks = cleanups.filter(c => c.status === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      {loadError && (
        <div role="alert" className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-sm flex items-center justify-between gap-3">
          <span>{loadError}</span>
          <Button variant="outline" size="sm" onClick={loadCleanups}>Retry</Button>
        </div>
      )}
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 border-b border-[#1B4332]/10">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-[#DEF5F1] text-[#092421] mb-2 border border-[#98E0D5] shadow-xs">
            <Truck className="w-3.5 h-3.5 text-[#1B4A45]" />
            <span>Municipal Dispatch Command</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#10241B] tracking-tight">
            Cleanup Operations & Verification
          </h1>
          <p className="text-xs sm:text-sm text-[#556E55] mt-1 max-w-2xl leading-relaxed font-medium">
            Coordinate municipal contractor squads, inspect work orders, and certify public space clearance using interactive before-and-after audit comparisons.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={loadCleanups}
            className="shadow-xs rounded-full px-4 py-2 font-bold"
          >
            Refresh Queue
          </Button>
        </div>
      </div>

      {statusNotification && (
        <div className="p-4 rounded-2xl bg-[#DEF5F1] border border-[#74D7CB] text-[#092421] text-xs font-bold flex items-center gap-2.5 shadow-soft animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-[#2D6A4F] shrink-0" />
          <span>{statusNotification}</span>
        </div>
      )}

      {/* Top Operations KPI Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-[1.75rem] card-paper shadow-soft">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#556E55] block">Total Work Orders</span>
          <span className="text-2xl font-black text-[#10241B] font-serif mt-0.5 block">{totalTasks}</span>
          <span className="text-[11px] text-[#556E55] font-medium">In municipal registry</span>
        </div>
        <div className="p-5 rounded-[1.75rem] card-paper shadow-soft">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700 block">Awaiting Dispatch</span>
          <span className="text-2xl font-black text-amber-700 font-serif mt-0.5 block">{pendingTasks}</span>
          <span className="text-[11px] text-amber-700 font-medium">Crew unassigned</span>
        </div>
        <div className="p-5 rounded-[1.75rem] card-paper shadow-soft">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">Squads Deployed</span>
          <span className="text-2xl font-black text-blue-700 font-serif mt-0.5 block">{inProgressTasks}</span>
          <span className="text-[11px] text-blue-700 font-medium">Active remediation</span>
        </div>
        <div className="p-5 rounded-[1.75rem] card-paper shadow-soft">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#2D6A4F] block">Restored & Audited</span>
          <span className="text-2xl font-black text-[#2D6A4F] font-serif mt-0.5 block">{completedTasks}</span>
          <span className="text-[11px] text-[#2D6A4F] font-medium">Photographically certified</span>
        </div>
      </div>

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
              className={`py-3.5 px-3.5 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'border-[#74D7CB] text-[#092421] font-black'
                  : 'border-transparent text-charcoal-500 hover:text-charcoal-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-charcoal-400 font-mono font-bold hidden sm:inline">
          {cleanups.length} Operations in view
        </span>
      </div>

      {/* Tasks List */}
      {loading ? (
        <LoadingSkeleton count={3} height="h-44" />
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
              <Card key={task.id} className="p-5 sm:p-6 space-y-4 shadow-soft hover:shadow-soft-md transition-all duration-300 border-sage-200/90">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-sage-100 text-charcoal-700">
                        {task.id}
                      </span>
                      <span className="text-xs text-charcoal-300">•</span>
                      <span className="font-mono text-xs text-forest-700 font-bold">
                        Incident Ref: {task.reportId}
                      </span>
                      <span className="text-xs text-charcoal-300">•</span>
                      <span
                        className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                          isCompleted
                            ? 'bg-forest-50 text-forest-800 border-forest-200 shadow-xs'
                            : isInProgress
                            ? 'bg-blue-50 text-blue-800 border-blue-200 shadow-xs'
                            : 'bg-amber-50 text-amber-800 border-amber-200 shadow-xs'
                        }`}
                      >
                        {isCompleted
                          ? 'Certified Cleaned'
                          : isInProgress
                          ? 'Squad Dispatched'
                          : 'Awaiting Crew'}
                      </span>
                    </div>

                    <h3 className="font-extrabold text-base text-charcoal-900">{task.taskName}</h3>

                    <div className="flex items-center gap-1.5 text-xs text-charcoal-500">
                      <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0" />
                      <span className="font-medium">{task.location}</span>
                    </div>
                  </div>

                  {/* Actions / Status changer */}
                  <div className="flex flex-wrap items-center gap-2.5 shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTask(task);
                        setSliderPosition(50);
                      }}
                      className="shadow-xs font-bold"
                    >
                      {task.afterImageUrl ? 'Compare Before & After' : 'Inspect Work Order'}
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

                    {!isCompleted && !isInProgress && (
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => handleStatusChange(task.id, 'in_progress')}
                      >
                        Start Cleanup
                      </Button>
                    )}
                    {!isCompleted && (
                      <Button
                        variant="primary"
                        size="sm"
                        icon={Check}
                        glow
                        onClick={() => setSelectedTask(task)}
                      >
                        Upload After Photo
                      </Button>
                    )}
                  </div>
                </div>

                {/* Details Bar */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-beige-100/80 border border-beige-300/80 text-xs">
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">Assigned Crew</span>
                    <span className="font-bold text-charcoal-900 truncate block mt-0.5">
                      {task.assignedTeam || 'Unassigned'}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">Lead Supervisor</span>
                    <span className="font-bold text-charcoal-800 truncate block mt-0.5">{task.contactLead}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">Target Execution</span>
                    <span className="font-bold text-charcoal-800 font-mono block mt-0.5">
                      {formatDate(task.scheduledDate)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-charcoal-400 font-bold uppercase tracking-wider block">Volume Estimate</span>
                    <span className="font-extrabold text-forest-800 font-mono block mt-0.5">
                      {task.wasteVolumeEstimate}
                    </span>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Before & After Interactive Comparison Modal */}
      <Modal
        isOpen={!!selectedTask}
        onClose={() => setSelectedTask(null)}
        title={selectedTask ? `Verification Audit: ${selectedTask.taskName}` : 'Task Details'}
        maxWidth="max-w-4xl"
      >
        {selectedTask && (
          <div className="space-y-6 font-sans">
            {/* Interactive Split / Side-by-Side Comparison */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-charcoal-800 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-forest-700" />
                  Site Verification Comparison
                </span>
                {selectedTask.afterImageUrl && (
                  <span className="text-[11px] font-mono text-forest-800 bg-forest-50 px-2.5 py-0.5 rounded-full border border-forest-200 font-bold">
                    ✓ Both Photographs Certified
                  </span>
                )}
              </div>

              {/* Side-by-Side Images Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Before Photo */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black text-rose-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-600" />
                      BEFORE: Public Litter Incident
                    </span>
                    <span className="text-[11px] text-charcoal-400 font-mono">Original Capture</span>
                  </div>
                  <div className="h-64 rounded-2xl overflow-hidden bg-sage-100 border-2 border-rose-200 shadow-soft relative group">
                    {selectedTask.beforeImageUrl ? (
                      <img
                        src={selectedTask.beforeImageUrl}
                        alt="Before Cleanup"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                    <span className="text-xs font-black text-forest-800 flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-forest-600" />
                      AFTER: Municipal Clearance
                    </span>
                    <span className="text-[11px] text-charcoal-400 font-mono">
                      {selectedTask.completedAt ? formatDate(selectedTask.completedAt) : 'Pending clearance'}
                    </span>
                  </div>
                  <div className="h-64 rounded-2xl overflow-hidden bg-sage-100 border-2 border-forest-200 shadow-soft relative group">
                    {selectedTask.afterImageUrl ? (
                      <img
                        src={selectedTask.afterImageUrl}
                        alt="After Cleanup Restored Site"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-xs text-charcoal-400 p-6 text-center space-y-3 bg-offwhite-100">
                        <Camera className="w-8 h-8 text-charcoal-300" />
                        <div>
                          <p className="font-bold text-charcoal-800">Pending Photographic Resolution</p>
                          <p className="text-[11px] text-charcoal-500 mt-0.5">
                            Sanitation crews upload physical site clearance proof to close the loop.
                          </p>
                        </div>
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest text-white text-xs font-bold hover:bg-forest-700 transition-colors shadow-sm">
                          <Camera className="w-3.5 h-3.5" />
                          <span>{uploadingPhoto ? 'Processing Photo...' : 'Upload Restored Photo & Complete'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            disabled={uploadingPhoto}
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setUploadingPhoto(true);
                              try {
                                const { dataUrl } = await compressImageFile(file, 1200, 1200, 0.72);
                                const updatedTask = await handleStatusChange(selectedTask.id, 'completed', dataUrl);
                                if (updatedTask) setSelectedTask(updatedTask);
                              } catch (err) {
                                console.error('Failed to upload after photo', err);
                              } finally {
                                setUploadingPhoto(false);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Task Operational Notes */}
            <div className="p-4 rounded-2xl bg-offwhite-100 border border-sage-200 space-y-1 text-xs">
              <span className="font-bold text-charcoal-900 block">Sanitation Crew Field Notes:</span>
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
        <form onSubmit={handleAssignSave} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block font-bold text-charcoal-800 mb-1">
              Sanitation Crew / Squad
            </label>
            <select
              value={assignedTeamInput}
              onChange={(e) => setAssignedTeamInput(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white font-semibold"
            >
              <option value="Metro Rapid Response - Squad A">Metro Rapid Response - Squad A</option>
              <option value="Urban Estuary Cleanup Crew">Urban Estuary Cleanup Crew</option>
              <option value="Parks & Recreation Team 3">Parks & Recreation Team 3</option>
              <option value="District 5 Municipal Sanitation">District 5 Municipal Sanitation</option>
              <option value="HazMat Certified Disposal Services">HazMat Certified Disposal Services</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-charcoal-800 mb-1">
              Target Execution Date
            </label>
            <input
              type="date"
              value={scheduledDateInput}
              onChange={(e) => setScheduledDateInput(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white font-mono font-semibold"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-sage-200">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setAssignModalTask(null)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm" glow>
              Save & Dispatch Crew
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
