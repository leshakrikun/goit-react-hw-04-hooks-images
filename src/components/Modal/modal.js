import React from 'react';
import {createPortal} from 'react-dom'
import s from './modal.module.css';

const modalRoot = document.querySelector('#modal-root')

export default  function Modal ({onChange, state, image})  {
  
  return(
    createPortal(
      <div className={s.overlay}  >
        <div className={s.modal} onChange={onChange}>
          <img src={image} alt={state.tags}  />
        </div>
      </div>, modalRoot)
  )
}




