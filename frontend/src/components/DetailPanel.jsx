import React, { useState, useEffect } from 'react';
import { RELEASE_STEPS } from './Sidebar';
import { updateNotes, toggleStep, deleteRelease } from '../api/api';

export default function DetailPanel({
  release,
  onUpdateRelease,
  onDeleteRelease,
}) {
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (release) {
      setNotes(release.additional_info || '');
    }
  }, [release?.id]);

  if (!release) {
    return (
      <div className="main-content">
        <div className="empty-state">
          Select a release from the list to view details
        </div>
      </div>
    );
  }

  const dateObj = new Date(release.date);
  dateObj.setMinutes(dateObj.getMinutes() - dateObj.getTimezoneOffset());
  const dateStr = dateObj.toISOString().slice(0, 16);

  const handleToggle = async (stepNumber) => {
    try {
      const updated = await toggleStep(release.id, stepNumber);
      onUpdateRelease(updated);
    } catch (err) {
      console.error(err);
      alert('Failed to toggle step');
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    try {
      const updated = await updateNotes(release.id, notes);
      onUpdateRelease(updated);
      alert('Notes saved successfully!');
    } catch (err) {
      console.error(err);
      alert('Error saving notes.');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this release?')) return;
    try {
      await deleteRelease(release.id);
      onDeleteRelease(release.id);
    } catch (err) {
      console.error(err);
      alert('Error deleting release.');
    }
  };

  return (
    <div className="main-content">
      <div className="breadcrumb">
        All releases &gt; <span>{release.name}</span>
      </div>

      <div className="detail-header">
        <h2>{release.name}</h2>
        <button className="btn-danger" onClick={handleDelete}>
          Delete
        </button>
      </div>

      <div className="form-grid">
        <div className="form-group">
          <label>Version / Name</label>
          <input type="text" value={release.name} disabled />
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input type="datetime-local" value={dateStr} disabled />
        </div>
      </div>

      <div className="checklist-container">
        <div className="section-title">Checklist</div>
        <div id="checklist-items">
          {RELEASE_STEPS.map((stepText, index) => {
            const stepNum = index + 1;
            const isChecked = release.steps_completed?.includes(stepNum);
            return (
              <div className="checklist-item" key={stepNum}>
                <input
                  type="checkbox"
                  id={`step-${stepNum}`}
                  checked={isChecked}
                  onChange={() => handleToggle(stepNum)}
                />
                <label htmlFor={`step-${stepNum}`}>{stepText}</label>
              </div>
            );
          })}
        </div>
      </div>

      <div className="notes-section">
        <div className="section-title">Additional Notes</div>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional release notes here..."
        />
        <button className="btn-save" onClick={handleSaveNotes} disabled={saving}>
          {saving ? 'Saving...' : 'Save Notes'}
        </button>
      </div>
    </div>
  );
}
