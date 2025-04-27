import React from 'react';

const ArtworkModal = ({ artwork, onClose }) => {
  if (!artwork) return null;

  return (
    <div style={styles.modalBackdrop}>
      <div style={styles.modalContent}>
        <button onClick={onClose} style={styles.closeButton}>✖</button>

        <div style={styles.header}>
          <h2 style={styles.title}>{artwork.Title}</h2>
        </div>

        {artwork.ImageURL && (
          <img src={artwork.ImageURL} alt={artwork.Title} style={styles.image} />
        )}

        <div style={styles.detailsContainer}>
          {Object.entries(artwork).map(([key, value], index) => (
            <div key={key} style={{
              ...styles.detailRow,
              backgroundColor: index % 2 === 0 ? '#f9f9f9' : '#fff'
            }}>
              <div style={styles.label}>{key.replace(/([A-Z])/g, ' $1')}</div>
              <div style={styles.value}>
                {Array.isArray(value) ? value.join(', ') : value?.toString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const styles = {
  modalBackdrop: {
    position: 'fixed',
    top: 0, left: 0, right: 0, bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
    padding: '1rem'
  },
  modalContent: {
    background: 'white',
    padding: '2rem',
    borderRadius: '12px',
    maxWidth: '700px',
    width: '100%',
    maxHeight: '90vh',
    overflowY: 'auto',
    boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
    position: 'relative'
  },
  closeButton: {
    position: 'absolute',
    top: '10px',
    right: '15px',
    fontSize: '1.5rem',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    color: '#888'
  },
  header: {
    textAlign: 'center',
    marginBottom: '1.5rem'
  },
  title: {
    fontSize: '1.75rem',
    fontWeight: 'bold',
    margin: 0,
    color: '#333'
  },
  image: {
    width: '100%',
    height: 'auto',
    borderRadius: '8px',
    marginBottom: '1.5rem',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
  },
  detailsContainer: {
    borderRadius: '8px',
    overflow: 'hidden',
    border: '1px solid #ddd'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 1rem',
    borderBottom: '1px solid #eee'
  },
  label: {
    fontWeight: '600',
    color: '#444',
    textTransform: 'capitalize',
    flex: '0 0 35%'
  },
  value: {
    color: '#222',
    textAlign: 'right',
    flex: '1',
    paddingLeft: '1rem'
  }
};

export default ArtworkModal;
