import React, { useState, useEffect } from 'react';
import { createRelease } from '../api/api';

export default function NewReleaseModal({ isOpen, onClose, onCreated }) {
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const now = new Date();
      now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
      setDate(now.toISOString().slice(0, 16));
      setName('');
    }
  }, [isOpen]);

  const handleCreate = async () => {
    if (!name || !date) {
      alert('Name and Date are required.');
      return;
    }
    setCreating(true);
    try {
      const newRel = await createRelease({ name, date });
      onCreated(newRel);
      onClose();
    } catch (err) {
      console.error(err);
      alert('Error creating release.');
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`}>
      <div className="modal-content">
        <h3>Create New Release</h3>
        <div className="form-group" style={{ marginBottom: 12 }}>
          <label>Release Name / Version</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., Version 1.0.1"
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
          />
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input
            type="datetime-local"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            style={{ width: '100%', padding: 8, border: '1px solid #ccc', borderRadius: 4 }}
          />
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose} disabled={creating}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleCreate} disabled={creating}>
            {creating ? 'Creating...' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}
