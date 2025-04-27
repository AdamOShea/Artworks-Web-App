import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaCalendarAlt } from 'react-icons/fa';
import ArtworkModal from './ArtworkModal'; 

const API_BASE = 'http://localhost:3001';

const SavedArtworks = ({ userId, reloadKey, setReloadKey, setToast  }) => {
  const [saved, setSaved] = useState([]);
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [artworks, setArtworks] = useState([]);

  const fetchArtworks = async () => {
    const res = await axios.get(`${API_BASE}/artworks`);
    setArtworks(res.data);
  };

  const unsaveArtwork = async (artworkId) => {
    if (!userId) {
      alert('Please log in to unsave artworks.');
      return;
    }
    try {
      await axios.post(`${API_BASE}/users/${userId}/unsave-artwork`, { artworkId });
      setReloadKey(prev => prev + 1);
      setToast('Artwork unsaved!'); 
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to unsave');
    }
  };
  
  const deleteArtwork = async (id) => {
    try {
      await axios.delete(`${API_BASE}/artworks/${id}`);
      const res = await axios.get(`${API_BASE}/users/${userId}/saved-artworks`);
      if (Array.isArray(res.data)) setSaved(res.data);
      setToast('Artwork deleted!'); 
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      console.error('Failed to delete artwork', err);
    }
  };
  
  

  useEffect(() => {
    let isMounted = true;

    const fetchSaved = async () => {
      try {
        const res = await axios.get(`${API_BASE}/users/${userId}/saved-artworks`);
        if (Array.isArray(res.data)) setSaved(res.data);
      } catch (err) {
        if (isMounted) {
          console.error('Failed to fetch saved artworks', err);
        }
      }
    };
    if (userId) fetchSaved();

    return () => {
      isMounted = false;
    };
  }, [userId, reloadKey]);

  return (
    <div>
      <h2>Saved Artworks</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
        {saved.map(art => (
          <div
            key={art._id}
            style={styles.card}
            onClick={() => setSelectedArtwork(art)}
          >
            <img src={art.ImageURL} alt={art.Title} style={styles.image} />
            <h3>{art.Title}</h3>
            <p><FaUser /> {art.Artist?.join(', ')}</p>
            <p><FaCalendarAlt /> {art.Date}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
            {userId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          unsaveArtwork(art._id);
                        }}
                        style={{
                          flex: 1,
                          padding: '0.6rem',
                          backgroundColor: '#4caf50',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          transition: 'background 0.3s',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}
                        onMouseEnter={e => e.target.style.backgroundColor = '#43a047'}
                        onMouseLeave={e => e.target.style.backgroundColor = '#4caf50'}
                      >
                        Unsave
                      </button>
                    )}
                      <button
                        onClick={(e) => { e.stopPropagation(); setEditingArtwork(art); }}
                        style={{
                          flex: 1,
                          padding: '0.6rem',
                          backgroundColor: '#ffa726',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          transition: 'background 0.3s',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}
                        onMouseEnter={e => e.target.style.backgroundColor = '#fb8c00'}
                        onMouseLeave={e => e.target.style.backgroundColor = '#ffa726'}
                      >
                        Edit
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteArtwork(art._id); }}
                        style={{
                          flex: 1,
                          padding: '0.6rem',
                          backgroundColor: '#ef5350',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontWeight: 'bold',
                          fontSize: '0.95rem',
                          cursor: 'pointer',
                          transition: 'background 0.3s',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                        }}
                        onMouseEnter={e => e.target.style.backgroundColor = '#e53935'}
                        onMouseLeave={e => e.target.style.backgroundColor = '#ef5350'}
                      >
                        Delete
                      </button>
                    </div>
          </div>
        ))}
      </div>


      {selectedArtwork && (
        <ArtworkModal
          artwork={selectedArtwork}
          onClose={() => setSelectedArtwork(null)}
        />
      )}
      {editingArtwork && (
                <div style={overlayStyle}>
                  <div style={modalStyle}>
                    <h2>Edit Artwork</h2>
                    {Object.keys(editingArtwork).map((key) => key !== '_id' && (
                      <div key={key} style={{ marginBottom: '1rem' }}>
                        <label><strong>{key}:</strong></label><br />
                        <input
                          type="text"
                          value={Array.isArray(editingArtwork[key]) ? editingArtwork[key].join(', ') : editingArtwork[key]}
                          onChange={(e) => {
                            const value = e.target.value;
                            setEditingArtwork(prev => ({
                              ...prev,
                              [key]: Array.isArray(prev[key]) ? value.split(',').map(s => s.trim()) : value
                            }));
                          }}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                      </div>
                    ))}
                    <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                      <button
                        onClick={() => setEditingArtwork(null)}
                        style={cancelButtonStyle}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={async () => {
                          const { _id, ...updated } = editingArtwork;
                          await axios.put(`${API_BASE}/artworks/${_id}`, updated);
                          setEditingArtwork(null);
                          fetchArtworks();
                        }}
                        style={confirmButtonStyle}
                      >
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              )}
    </div>

    
  );
}


const styles = {
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginTop: '1rem'
  },
  card: {
    background: 'white',
    padding: '1.5rem',
    borderRadius: '10px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    transform: 'scale(1)',
  },
  image: {
    width: '100%',
    height: '200px',
    objectFit: 'cover',
    borderRadius: '8px',
    marginBottom: '1rem'
  }
};

const overlayStyle = {
  position: 'fixed',
  top: 0, left: 0, right: 0, bottom: 0,
  backgroundColor: 'rgba(0,0,0,0.6)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '1rem'
};

const modalStyle = {
  background: 'white',
  padding: '2rem',
  borderRadius: '10px',
  width: '90%',
  maxWidth: '600px',
  maxHeight: '90vh',
  overflowY: 'auto',
  boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
  position: 'relative'
};

const confirmButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#4caf50',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  marginLeft: '0.5rem'
};

const cancelButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#bbb',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
};

export default SavedArtworks;
