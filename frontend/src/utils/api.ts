import { CLIPPair, LocalNeighborhood } from '../types/data';

const API_BASE = 'http://localhost:5000/api';

export async function fetchClipPairs(): Promise<CLIPPair[]> {
    try {
        const response = await fetch(`${API_BASE}/clip-pairs`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (err) {
        console.error('Failed to fetch CLIP pairs: ', err);
        throw err;
    }
}

export async function fetchNeighborhood(selectedIdx: number, k: number): Promise<LocalNeighborhood> {
    const response = await fetch(`${API_BASE}/neighborhood`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ selectedIdx, k })
    });
    if (!response.ok) {
        throw new Error('Failed to fetch neighborhood');
    }
    return response.json();
}