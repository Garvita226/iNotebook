import React, { useContext } from 'react';
import NoteContext from '../context/notes/NoteContext';

const NoteItem = (props) => {
  const context = useContext(NoteContext);
  const { deleteNote } = context;

  const { note, updateNote, showAlert } = props;

  return (
    <div className='col-md-3 my-3'>
      <div className="card">
        <div className="card-body">

          <div className="d-flex justify-content-center">
            <h5 className="card-title">{note.title}</h5>
            <i className="fa-solid fa-trash mx-2 fa-sm mt-2" onClick={() => {
              deleteNote(note._id);
              showAlert('success', 'Note Deleted Successfully')
            }}></i>
            <i className="fa-solid fa-pen-to-square mx-2 fa-sm mt-2" onClick={() => { updateNote(note) }}></i>
          </div>

          <p className="card-text">{note.description}</p>

        </div>
      </div>
    </div>
  )
}

export default NoteItem
