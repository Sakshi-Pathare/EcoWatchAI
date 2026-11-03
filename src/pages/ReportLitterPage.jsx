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
} from 'lucide-react';
import { Button } from '../components/common/Button';
import { Card, CardHeader, CardBody } from '../components/common/Card';
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
    address: 'Near Civic Center Plaza, San Francisco, CA',
    latitude: 37.7749,
    longitude: -122.4194,
  });

  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleImageChange = (dataUrl) => {
    setImagePreview(dataUrl);
    setFormError(null);
  };

  const handleImageClear = () => {
    setImagePreview(null);
  };

  const handleLocationChange = (lat, lng) => {
    setFormData((prev) => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      address: `Selected GPS Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)}`,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.title.trim()) {
      setFormError('Please enter a brief title for the litter report.');
      return;
    }

    if (!imagePreview) {
      setFormError('Please attach a photograph of the litter for municipal verification.');
      return;
    }

    setIsSubmitting(true);
    try {
      await reportService.createReport({
        ...formData,
        imageUrl: imagePreview,
      });

      setSuccess(true);
      setTimeout(() => {
        navigate('/my-reports');
      }, 1500);
    } catch (err) {
      setFormError('Failed to record report. Please verify connection and try again.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-8 text-center sm:text-left">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-md bg-forest-100 text-forest-800 mb-2">
          <Camera className="w-3.5 h-3.5" />
          <span>Civic Pollution Registry</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-charcoal-900 tracking-tight">
          Report Public Litter
        </h1>
        <p className="text-xs sm:text-sm text-charcoal-600 mt-1 max-w-2xl">
          Submit photographic evidence and geolocated coordinates to notify municipal sanitation crews and update hotspot intelligence.
        </p>
      </div>

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-forest-50 border border-forest-200 text-forest-900 flex items-center gap-3 animate-fade-in shadow-soft">
          <CheckCircle className="w-6 h-6 text-forest-600 shrink-0" />
          <div>
            <h4 className="font-bold text-sm">Report Logged Successfully!</h4>
            <p className="text-xs text-forest-700 mt-0.5">
              Your submission has been queued for municipal verification. Redirecting to your reports...
            </p>
          </div>
        </div>
      )}

      {formError && (
        <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 flex items-center gap-3 shadow-soft">
          <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
          <p className="text-xs font-medium">{formError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Photographic Evidence */}
        <Card>
          <CardHeader
            title="1. Photographic Evidence"
            subtitle="Clear photos help classification algorithms and sanitation teams assess severity."
          />
          <CardBody className="space-y-4">
            <ImageUploader
              imagePreview={imagePreview}
              onImageChange={handleImageChange}
              onImageClear={handleImageClear}
            />

            {/* AI Computer Vision Staging Placeholder */}
            <div className="p-4 rounded-xl bg-forest-50/70 border border-forest-200/90 flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-forest-700 text-limeaccent-300 flex items-center justify-center shrink-0 mt-0.5">
                <Sparkles className="w-4 h-4" />
              </div>
              <div className="text-xs space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-forest-900">
                    Computer Vision Inference Pipeline (Phase 2 Preview)
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-forest-200 text-forest-800 font-semibold">
                    YOLOv8 Staging
                  </span>
                </div>
                <p className="text-charcoal-600 leading-relaxed">
                  Upon submission, the image will be staged for automated object detection to classify litter materials (plastics, glass, metals, bio-waste) and predict volume density without manual labeling.
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Step 2: Location Selection */}
        <Card>
          <CardHeader
            title="2. Geospatial Location"
            subtitle="Click on the interactive map or use browser GPS to pinpoint the exact litter coordinates."
          />
          <CardBody className="space-y-4">
            <LocationPickerMap
              latitude={formData.latitude}
              longitude={formData.longitude}
              onChange={handleLocationChange}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Street / Area Description
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-charcoal-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                    placeholder="e.g. Near Civic Center fountain bench"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.latitude}
                    onChange={(e) => setFormData({ ...formData, latitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-sage-300 font-mono focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-charcoal-700 mb-1">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    value={formData.longitude}
                    onChange={(e) => setFormData({ ...formData, longitude: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-sage-300 font-mono focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                  />
                </div>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Step 3: Litter Details & Severity */}
        <Card>
          <CardHeader
            title="3. Incident Classification"
            subtitle="Specify category and estimated environmental urgency."
          />
          <CardBody className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Report Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                placeholder="e.g. Overflowing beverage containers along walking trail"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Primary Litter Material
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
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
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Perceived Severity
                </label>
                <select
                  value={formData.severity}
                  onChange={(e) => setFormData({ ...formData, severity: e.target.value })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                >
                  <option value="low">Low (Scattered minor litter)</option>
                  <option value="medium">Medium (Substantial accumulation)</option>
                  <option value="high">High (Severe dump / safety risk)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                  Approx. Volume / Weight (kg)
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={formData.estimatedKg}
                  onChange={(e) => setFormData({ ...formData, estimatedKg: Number(e.target.value) })}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-charcoal-700 mb-1">
                Field Observations & Context
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3 py-2 text-xs rounded-lg border border-sage-300 focus:outline-none focus:ring-2 focus:ring-forest-500 bg-white"
                placeholder="Include details regarding proximity to storm drains, wildlife, schools, or accessibility for sanitation trucks..."
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
            className="shadow-sm"
          >
            Submit Verified Report
          </Button>
        </div>
      </form>
    </div>
  );
}

