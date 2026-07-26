import React from 'react';

const RELEASE_STEPS = [
  "All relevant GitHub pull requests have been merged",
  "Version number bumped in configuration files",
  "Changelog updated with latest features/fixes",
  "All unit and integration tests passing",
  "Code review approved by at least one peer",
  "Database migration scripts prepared and reviewed",
  "Staging environment deployment successful",
  "Smoke tests passed on staging environment",
  "Deployment notification sent to stakeholders",
  "Production deployment completed and verified"
];

export default function Sidebar({
  releases,
  selectedId,
  loading,
  error,
  onSelect,
  onOpenModal,
}) {
  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>ReleaseCheck</h1>
        <p>all-in-one release checklist tool</p>
        <button className="new-release-btn" onClick={onOpenModal}>
          + New release
        </button>
      </div>
      <div className="release-table-container">
        <table>
          <thead>
            <tr>
              <th>Release</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan="3" className="loading-msg">Loading releases...</td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan="3" className="error-msg">{error}</td>
              </tr>
            )}
            {!loading && !error && releases.length === 0 && (
              <tr>
                <td colSpan="3" className="no-data">No releases found</td>
              </tr>
            )}
            {!loading && releases.map((rel) => {
              const dateObj = new Date(rel.date);
              const dateStr = dateObj.toLocaleDateString();
              return (
                <tr
                  key={rel.id}
                  className={rel.id === selectedId ? 'active' : ''}
                  onClick={() => onSelect(rel.id)}
                >
                  <td>{rel.name}</td>
                  <td>{dateStr}</td>
                  <td>
                    <span className={`status-badge status-${rel.status}`}>
                      {rel.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export { RELEASE_STEPS };
