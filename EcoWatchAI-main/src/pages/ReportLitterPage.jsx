import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Camera,
  MapPin,
  Send,
  AlertTriangle,
  Sparkles,
  Info,
  CheckCircle,
  HelpCircle,
  ShieldAlert,
  Clock,
  Layers,
  Flame,
  ArrowRight,
  Compass,
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardBody } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { ImageUploader } from '../components/forms/ImageUploader';
import { LocationPickerMap } from '../components/map/LocationPickerMap';
import { reportService } from '../services/reportService';

export function ReportLitterPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'plastic',
    severity: 'medium',
    estimatedKg: 5,
    address: '',
    latitude: null,
    longitude: null,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [submittedReport, setSubmittedReport] = useState(null);
  const [formError, setFormError] = useState(null);

  const handleImageChange = (dataUrl) => {
    setImagePreview(dataUrl);
    setFormError(null);
  };

  const handleImageClear = () => {
    setImagePreview(null);
  };

  const handleLocationChange = async (lat, lng) => {
    const fallbackAddr = `GPS Pin: ${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: prev.address && !prev.address.startsWith('GPS Pin:') && !prev.address.startsWith('Selected GPS')
        ? prev.address
        : fallbackAddr,
    }));

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        { headers: { Accept: 'application/json' } }
      );
      if (res.ok) {
        const data = await res.json();
        if (data && data.display_name) {
          const parts = [];
          if (data.address?.road) parts.push(data.address.road);
          if (data.address?.suburb || data.address?.neighbourhood) parts.push(data.address.suburb || data.address.neighbourhood);
          if (data.address?.city || data.address?.town) parts.push(data.address.city || data.address.town);
          const resolved = parts.length > 0 ? parts.join(', ') : data.display_name.split(',').slice(0, 3).join(',');
          setFormData((prev) => ({
            ...prev,
            address: resolved.trim(),
          }));
        }
      }
    } catch (err) {
      // Gracefully fall back to coordinates
    }
  };

  // Environmental impact details based on material category
  const materialImpacts = {
    plastic: {
      degradation: '~450 Years',
      danger: 'High Marine & Microplastic Hazard',
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
      recommendation: 'Targeted for municipal plastic baling and circular polymer recycling.',
    },
    glass: {
      degradation: '1,000,000+ Years',
      danger: 'Severe Physical Injury & Fire Risk',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      recommendation: 'Requires motorized vacuum collector to eliminate micro-shards.',
    },
    metal: {
      degradation: '~80-100 Years',
      danger: 'Sharp Debris & Soil Oxidation',
      badge: 'bg-blue-50 text-blue-800 border-blue-200',
      recommendation: 'High scrap value; routed to scrap metal processing facility.',
    },
    hazardous: {
      degradation: 'Permanent Chemical Residue',
      danger: 'Groundwater Contamination & Toxicity',
      badge: 'bg-rose-100 text-rose-900 border-rose-300',
      recommendation: 'Priority HazMat dispatch with sealed containment drums.',
    },
    paper: {
      degradation: '~2-6 Weeks',
      danger: 'Storm Drain Clogging & Clutter',
      badge: 'bg-slate-100 text-slate-800 border-slate-200',
      recommendation: 'Street sweeper sweep before rainstorms.',
    },
    organic: {
      degradation: '~1-6 Months',
      danger: 'Pest Vector & Odor Hazard',
      badge: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      recommendation: 'Municipal green-bin compost collection.',
    },
    mixed: {
      degradation: 'Decades to Centuries',
      danger: 'Public Sanitation Degradation',
      badge: 'bg-sage-100 text-sage-900 border-sage-200',
      recommendation: 'General municipal crew sorting and disposal.',
    },
  };

  const currentImpact = materialImpacts[formData.category] || materialImpacts.mixed;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError('Please enter a descriptive title for this litter report.');
      return;
    }

    if (!imagePreview) {
      setFormError('Please attach photographic evidence for verification.');
      return;
    }

    if (!Number.isFinite(formData.latitude) || !Number.isFinite(formData.longitude)) {
      setFormError('Select the litter location on the map or enter valid coordinates.');
      return;
    }

    setIsSubmitting(true);
    try {
      const report = await reportService.createReport({
        ...formData,
        imageUrl: imagePreview,
      });

      setSubmittedReport(report);
      setSuccess(true);
      setTimeout(() => {
        navigate('/my-reports');
      }, 1500);
    } catch (err) {
      setFormError(err.message || 'Failed to record report. Please try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8 font-sans">
      {/* Header */}
      <div className="text-center sm:text-left space-y-2 pb-6 border-b border-[#1B4332]/10">
        <Badge variant="pista" dot pulse dotColor="bg-[#092421]">
          Civic Sanitation Pipeline
        </Badge>
        <h1 className="text-3xl sm:text-4xl font-serif font-bold text-[#10241B] tracking-tight">
          Report Public Litter Incident
        </h1>
        <p className="text-xs sm:text-sm text-[#556E55] max-w-2xl leading-relaxed font-medium">
          Submit photographic evidence and geocoded coordinates to alert municipal sanitation squads and feed the algorithmic hotspot recurrence engine.
        </p>
      </div>

      {/* Progress Steps Indicator */}
      <div className="grid grid-cols-3 gap-3 p-2 bg-[#102D27] rounded-full border border-[#23584E] shadow-inner text-xs font-semibold">
        <div className={`p-2.5 rounded-full flex items-center justify-center gap-2 transition-all ${
          imagePreview ? 'bg-[#74D7CB] text-[#092421] shadow-xs font-black' : 'bg-white/10 text-white font-bold'
        }`}>
          <Camera className="w-4 h-4 shrink-0" />
          <span className="truncate">1. Photo Evidence</span>
        </div>
        <div className="p-2.5 rounded-full flex items-center justify-center gap-2 bg-white/10 text-white font-bold shadow-xs">
          <MapPin className="w-4 h-4 shrink-0 text-[#74D7CB]" />
          <span className="truncate">2. Location Pin</span>
        </div>
        <div className="p-2.5 rounded-full flex items-center justify-center gap-2 bg-white/10 text-white font-bold shadow-xs">
          <Layers className="w-4 h-4 shrink-0 text-[#74D7CB]" />
          <span className="truncate">3. Classification</span>
        </div>
      </div>

      {success && (
        <div className="p-5 rounded-2xl bg-forest-50 border-2 border-forest-300 text-forest-950 flex items-center gap-4 animate-fadeIn shadow-soft">
          <div className="w-10 h-10 rounded-full bg-forest-700 text-white flex items-center justify-center shrink-0">
            <CheckCircle className="w-6 h-6 text-limeaccent-300" />
          </div>
          <div>
            <h4 className="font-extrabold text-base">Report Submitted for Review</h4>
            <p className="text-xs text-forest-800 mt-0.5">
              {submittedReport?.detectionNote || 'Your report has been saved.'}
              {' '}Redirecting to your reports ledger...
            </p>
          </div>
        </div>
      )}

      {formError && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-900 flex items-center gap-3 shadow-soft">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-xs font-bold">{formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Photographic Evidence with AI Vision preview */}
        <Card className="border-sage-300/90 shadow-soft">
          <CardHeader
            title="1. Photographic Evidence"
            subtitle="Clear photographs enable accurate waste material detection and volume estimation."
            icon={Camera}
          />
          <CardBody className="space-y-4">
            <ImageUploader
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onImageClear={handleImageClear}
            />

            {/* Model availability is reported by the backend with each submission. */}
            <div className="p-4 rounded-xl bg-forest-50 border border-forest-100 flex items-start gap-3.5">
              <div className="w-8 h-8 rounded-lg bg-forest-100 text-forest-800 flex items-center justify-center shrink-0 mt-0.5 border border-forest-200">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-darkgreen-950">
                    Server-side image analysis
                  </span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-pista-100 text-[#092421] font-bold border border-pista-300">
                    Model status returned on submit
                  </span>
                </div>
                <p className="text-charcoal-700 leading-relaxed text-[11px] font-medium">
                  The API stores your photo and runs a configured YOLO model when available. Without trained model weights, the report is saved with your manual classification; no detections are fabricated.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Step 2: Location Selection */}
        <Card className="border-sage-300/90 shadow-soft">
          <CardHeader
            title="2. Geospatial Pin & Address"
            subtitle="Click or drag pin to the exact litter location. Browser GPS can locate you automatically."
            icon={MapPin}
          />
          <CardBody className="space-y-4">
            <LocationPickerMap
              latitude={formData.latitude}
              longitude={formData.longitude}
              onChange={handleLocationChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Location / Landmark Name
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-forest-700 absolute left-3.5 top-3" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white font-medium"
                    placeholder="e.g. Near Civic Center Plaza fountain bench"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block font-bold text-charcoal-800 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude ?? ''}
                    onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-sage-300 font-mono focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-charcoal-800 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude ?? ''}
                    onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl border border-sage-300 font-mono focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white font-semibold"
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Step 3: Incident Classification & Ecological Impact */}
        <Card className="border-sage-300/90 shadow-soft">
          <CardHeader
            title="3. Material Classification & Urgency"
            subtitle="Categorize the dominant waste type to compute priority scores and crew equipment."
            icon={Layers}
          />
          <CardBody className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-1">
                Incident Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white font-semibold"
                placeholder="e.g. Broken glass and plastic beverage bottles strewn on public lawn"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Dominant Waste Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white font-semibold"
                >
                  <option value="plastic">Plastics & Packaging</option>
                  <option value="glass">Glass Bottles & Shards</option>
                  <option value="metal">Metal & Aluminum Cans</option>
                  <option value="paper">Paper & Cardboard</option>
                  <option value="hazardous">Hazardous / E-Waste</option>
                  <option value="organic">Organic Food Waste</option>
                  <option value="mixed">Mixed Public Litter</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Urgency / Severity
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white font-semibold"
                >
                  <option value="low">Low (Light scattered debris)</option>
                  <option value="medium">Medium (Moderate dump accumulation)</option>
                  <option value="high">Critical (Severe dump / hazard risk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-charcoal-800 mb-1">
                  Est. Waste Mass (kg)
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={formData.estimatedKg}
                  onChange={(e) => setFormData({ ...formData, estimatedKg: Number(e.target.value) })}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white font-mono font-semibold"
                />
              </div>
            </div>

            {/* Material Environmental Impact Capsule */}
            <div className="p-4 rounded-2xl bg-beige-100/90 border border-beige-300/80 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-darkgreen-950 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4 text-botanical-700" />
                  Ecological Impact Assessment
                </span>
                <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${currentImpact.badge}`}>
                  Decomposition: {currentImpact.degradation}
                </span>
              </div>
              <p className="text-charcoal-700 text-[11px] leading-relaxed font-medium">
                <b className="text-darkgreen-950">Threat Profile:</b> {currentImpact.danger}. {currentImpact.recommendation}
              </p>
            </div>

            <div>
              <label className="block text-xs font-bold text-charcoal-800 mb-1">
                Field Observations & Context Notes
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white leading-relaxed"
                placeholder="Include proximity to storm drains, wildlife habitat, school crossings, or truck accessibility..."
              />
            </div>
          </CardBody>
        </Card>

        {/* Submit Actions */}
        <div className="flex items-center justify-end gap-4 pt-4 border-t border-sage-200">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>

          <Button
            type="submit"
            variant="primary"
            size="md"
            icon={Send}
            loading={isSubmitting}
            glow
            className="shadow-soft-md"
          >
            Submit Verified Report
          </Button>
        </div>
      </form>
    </div>
  );
}
