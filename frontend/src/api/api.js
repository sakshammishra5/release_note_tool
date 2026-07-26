const API_URL = import.meta.env.VITE_API_URL || '/api';

export async function fetchReleases() {
  const res = await fetch(`${API_URL}/releases`);
  if (!res.ok) throw new Error('Failed to fetch releases');
  return res.json();
}

export async function createRelease(data) {
  const res = await fetch(`${API_URL}/releases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Failed to create release');
  return res.json();
}

export async function updateNotes(id, additional_info) {
  const res = await fetch(`${API_URL}/releases/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ additional_info }),
  });
  if (!res.ok) throw new Error('Failed to update notes');
  return res.json();
}

export async function toggleStep(id, stepNumber) {
  const res = await fetch(`${API_URL}/releases/${id}/steps`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ stepNumber }),
  });
  if (!res.ok) throw new Error('Failed to toggle step');
  return res.json();
}

export async function deleteRelease(id) {
  const res = await fetch(`${API_URL}/releases/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to delete release');
}
