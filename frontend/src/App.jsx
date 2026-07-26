import React, { useState, useEffect, useCallback } from 'react';
import Sidebar from './components/Sidebar';
import DetailPanel from './components/DetailPanel';
import NewReleaseModal from './components/NewReleaseModal';
import { fetchReleases } from './api/api';

function App() {
  const [releases, setReleases] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadReleases = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchReleases();
      setReleases(data);
    } catch (err) {
      setError('Error loading data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadReleases();
  }, [loadReleases]);

  const selectedRelease = releases.find((r) => r.id === selectedId) || null;

  const handleUpdateRelease = (updated) => {
    setReleases((prev) =>
      prev.map((r) => (r.id === updated.id ? updated : r))
    );
  };

  const handleDeleteRelease = (id) => {
    setReleases((prev) => prev.filter((r) => r.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const handleCreated = (newRel) => {
    setReleases((prev) => [newRel, ...prev]);
    setSelectedId(newRel.id);
  };

  return (
    <>
      <div className="app-container">
        <Sidebar
          releases={releases}
          selectedId={selectedId}
          loading={loading}
          error={error}
          onSelect={setSelectedId}
          onOpenModal={() => setModalOpen(true)}
        />
        <DetailPanel
          release={selectedRelease}
          onUpdateRelease={handleUpdateRelease}
          onDeleteRelease={handleDeleteRelease}
        />
      </div>
      <NewReleaseModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}

export default App;
