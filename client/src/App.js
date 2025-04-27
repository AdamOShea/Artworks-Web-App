// App.js (login UI now moved to sidebar)
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaUser, FaCalendarAlt, FaEdit, FaTrash, FaPlus, FaAngleLeft, FaAngleRight, FaStepBackward, FaStepForward, FaPaintBrush, FaInfoCircle } from 'react-icons/fa';
import ArtworkModal from './ArtworkModal';
import Sidebar from './Sidebar';
import SavedArtworks from './SavedArtworks';
import AboutPage from './AboutPage';

const API_BASE = 'http://localhost:3001';

function App() {
  const [artworks, setArtworks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [authView, setAuthView] = useState('login');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('');
  const [selectedArtwork, setSelectedArtwork] = useState(null);
  const [editingArtwork, setEditingArtwork] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [formData, setFormData] = useState({
    Title: '',
    'Artist': [],
    'Constituent ID': '',
    'Artist Bio': '',
    'Nationality': '',
    'Begin Date': '',
    'End Date': '',
    'Gender': '',
    'Date': '',
    'Medium': '',
    'Dimensions': '',
    'Credit Line': '',
    'Accession Number': '',
    'Classification': '',
    'Department': '',
    'Date Acquired': '',
    'Cataloged': '',
    'Object ID': '',
    'URL': '',
    'Image URL': '',
    'On View': '',
    'Height': '',
    'Width': ''
  });
  
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [reloadSavedKey, setReloadSavedKey] = useState(0);
  const [view, setView] = useState('gallery');
  const [toast, setToast] = useState(null); 

  const Toast = ({ message }) => (
    <div style={{
      position: 'fixed',
      bottom: '20px',
      left: '50%',
      transform: 'translateX(-50%)',
      backgroundColor: '#4caf50',
      color: 'white',
      padding: '1rem 2rem',
      borderRadius: '30px',
      boxShadow: '0px 4px 12px rgba(0,0,0,0.2)',
      fontWeight: 'bold',
      zIndex: 9999,
      animation: 'fadeInOut 3s forwards'
    }}>
      {message}
    </div>
  );
  
  const handleLogin = (id) => {
    setUserId(id);
    localStorage.setItem('userId', id);
  };
  
  const handleLogout = () => {
    setUserId(null);
    localStorage.removeItem('userId');
  };
  

  const fetchArtworks = async () => {
    const res = await axios.get(`${API_BASE}/artworks`);
    setArtworks(res.data);
  };

  useEffect(() => {
    let isMounted = true;

    const savedUserId = localStorage.getItem('userId');
    if (savedUserId) {
      setUserId(savedUserId);
    }
    fetchArtworks();
    return () => {
      isMounted = false;
    };
  }, []);
  

  const postArtwork = async () => {
    await axios.post(`${API_BASE}/artworks`, formData);
    setFormData({ Title: '', Artist: [''], Date: '' });
    setShowCreateModal(false);
    fetchArtworks();
  };

  const deleteArtwork = async (id) => {
    await axios.delete(`${API_BASE}/artworks/${id}`);
    fetchArtworks();
  };

  const saveArtwork = async (artworkId) => {
    if (!userId) {
      alert('Please log in to save artworks.');
      return;
    }
    try {
      await axios.post(`${API_BASE}/users/${userId}/save-artwork`, { artworkId });
      setReloadSavedKey(prev => prev + 1);
      setToast('Artwork saved!'); 
      setTimeout(() => setToast(null), 3000); 
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save');
    }
  };

  const filteredArtworks = artworks.filter(art => {
    return art.Title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.Artist?.join(', ') || '').toLowerCase().includes(searchQuery.toLowerCase());
  });

  const sortedArtworks = [...filteredArtworks].sort((a, b) => {
    switch (sortOption) {
      case 'title-asc': return a.Title.localeCompare(b.Title);
      case 'title-desc': return b.Title.localeCompare(a.Title);
      case 'date-asc': return (a.Date || '').localeCompare(b.Date || '');
      case 'date-desc': return (b.Date || '').localeCompare(a.Date || '');
      default: return 0;
    }
  });

  const totalPages = Math.ceil(sortedArtworks.length / itemsPerPage);
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentArtworks = sortedArtworks.slice(indexOfFirst, indexOfLast);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const getVisiblePageNumbers = () => {
    const visiblePages = [];
    const start = Math.max(1, currentPage - 2);
    const end = Math.min(totalPages, start + 3);
    for (let i = start; i <= end; i++) visiblePages.push(i);
    return visiblePages;
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'Arial, sans-serif' }}>
        <Sidebar
          userId={userId}
          setUserId={setUserId}
          authView={authView}
          setAuthView={setAuthView}
          setShowCreateModal={setShowCreateModal}
          setView={setView}
          handleLogin={handleLogin}
          handleLogout={handleLogout}
        />


      <main style={{ flex: 1, backgroundColor: '#f0f2f5', padding: '2rem' }}>
        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{ color: '#4a90e2' }}><FaPaintBrush /> Artworks Gallery</h1>
          <p>Explore and Manage Your Collection</p>
        </header>

        {view === 'saved' && userId ? (
          <SavedArtworks
          userId={userId}
          reloadKey={reloadSavedKey}
          setReloadKey={setReloadSavedKey}
          setToast={setToast}
        />
        
        ) : view === 'about' ? (
          <AboutPage />
        ) : (
          <>
            <section>
              <h2>Artworks List</h2>
              <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Search by title or artist..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
                />
                <select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  style={{ padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
                >
                  <option value="">Sort by</option>
                  <option value="title-asc">Title A–Z</option>
                  <option value="title-desc">Title Z–A</option>
                  <option value="date-asc">Date (Oldest)</option>
                  <option value="date-desc">Date (Newest)</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
                {currentArtworks.map((art) => (
                  <div
                    key={art._id}
                    onClick={() => setSelectedArtwork(art)}
                    style={{ background: 'white', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', cursor: 'pointer' }}
                  >
                    <img src={art.ImageURL} alt={art.Title} style={{ width: '100%', height: '200px', objectFit: 'cover', borderRadius: '5px', marginBottom: '0.5rem' }} />
                    <h3>{art.Title}</h3>
                    <p style={{ color: '#555' }}><FaUser /> {art.Artist?.join(', ')}</p>
                    <p style={{ color: '#777' }}><FaCalendarAlt /> {art.Date}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    {userId && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          saveArtwork(art._id);
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
                        Save
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

              


              {/* Pagination */}
              <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                <label>
                  Items per page:
                  <select value={itemsPerPage} onChange={handleItemsPerPageChange} style={{ marginLeft: '0.5rem', padding: '0.25rem' }}>
                    <option value={10}>10</option>
                    <option value={20}>20</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </label>
                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(1)} style={navButtonStyle}><FaStepBackward /></button>
                  <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} style={navButtonStyle}><FaAngleLeft /></button>
                  {getVisiblePageNumbers().map(num => (
                    <button key={num} onClick={() => setCurrentPage(num)} style={{ padding: '0.5rem 1rem', backgroundColor: currentPage === num ? '#4a90e2' : '#ddd', color: currentPage === num ? '#fff' : '#000', border: 'none', borderRadius: '4px' }}>{num}</button>
                  ))}
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} style={navButtonStyle}><FaAngleRight /></button>
                  <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(totalPages)} style={navButtonStyle}><FaStepForward /></button>
                </div>
              </div>
            </section>
            
          </>
        )}

        {selectedArtwork && <ArtworkModal artwork={selectedArtwork} onClose={() => setSelectedArtwork(null)} />}
          {/* ===== CREATE ARTWORK MODAL ===== */}
          {showCreateModal && (
                <div style={overlayStyle}>
                  <div style={modalStyle}>
                    <h2>Create New Artwork</h2>
                    {Object.entries(formData).map(([key, val]) => (
                      <div key={key} style={{ marginBottom: '1rem' }}>
                        <label><strong>{key}:</strong></label><br />
                        <input
                          type="text"
                          value={Array.isArray(val) ? val[0] : val}
                          onChange={(e) => setFormData({
                            ...formData,
                            [key]: Array.isArray(val) ? [e.target.value] : e.target.value
                          })}
                          style={{ width: '100%', padding: '0.5rem', borderRadius: '5px', border: '1px solid #ccc' }}
                        />
                      </div>
                    ))}
                    <div style={{ textAlign: 'right', marginTop: '1rem' }}>
                      <button
                        onClick={() => setShowCreateModal(false)}
                        style={cancelButtonStyle}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={postArtwork}
                        style={confirmButtonStyle}
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ===== EDIT ARTWORK MODAL ===== */}
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
              {toast && <Toast message={toast} />}

      </main>
    </div>

    
  );
}

const navButtonStyle = {
  padding: '0.5rem',
  backgroundColor: '#eee',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer'
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

export default App;
