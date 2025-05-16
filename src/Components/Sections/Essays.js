import React, { useState, useEffect } from 'react';
import '../../styles/Essays.scss';
import supabase from '../../lib/supabaseClient';

function Essays() {
  const [essaysList, setEssaysList] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedEssay, setSelectedEssay] = useState(null);

  useEffect(() => {
    async function loadEssays() {
      const { data, error } = await supabase
        .from('essays')
        .select('id, title, content, tags, created_at')
        .order('created_at', { ascending: false });
      if (error) console.error(error);
      else setEssaysList(data);
    }
    loadEssays();
  }, []);

  return (
    <div className="essays">
      {/* selector button */}
      <button
        className="select-button"
        onClick={() => setShowModal(true)}
      >
        {selectedEssay ? selectedEssay.title : 'Select Essay'}
      </button>

      {/* main essay display */}
      {selectedEssay && (
        <div className="essay-content-main">
          <h2>{selectedEssay.title}</h2>
          {selectedEssay.created_at && (
            <small className="essay-date">
              {new Date(selectedEssay.created_at).toLocaleDateString()}
            </small>
          )}
          {selectedEssay.tags && selectedEssay.tags.length > 0 && (
            <div className="essay-tags">
              {selectedEssay.tags.join(', ')}
            </div>
          )}
          <p>{selectedEssay.content}</p>
        </div>
      )}

      {/* modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>Select an Essay</h3>
            <ul className="modal-list">
              {essaysList.map(essay => (
                <li key={essay.id}>
                  <button onClick={() => {
                    setSelectedEssay(essay);
                    setShowModal(false);
                  }}>
                    {essay.title}
                  </button>
                </li>
              ))}
            </ul>
            <button
              className="modal-close"
              onClick={() => setShowModal(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Essays;
