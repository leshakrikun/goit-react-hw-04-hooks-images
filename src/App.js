import { useState, useEffect } from 'react';
import Searchbar from './components/Searchbar/searchbar'
import ImageGallery from './components/ImageGallery/imageGallery'
import ImageGalleryItem from './components/ImageGalleryItem/imageGalleryItem'
import Loader from 'react-loader-spinner'
import API from './Fetch/fetch';
import Button from './components/Button/button'
import Modal from './components/Modal/modal'
import './App.css'

export default function App () {
  const [photos, setPhotos] = useState('');
  const [search, setSearch] = useState('');
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [largeImage, setLargeImage] = useState('');

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('click', handleMouseClick);
  }, [showModal]);


  const handleKeyDown = (e) => {
    if (e.code === 'Escape' && showModal) {
      toggleModal();
    }
  }

  const handleMouseClick = (e) => {
    if (showModal && e.target.tagName==='DIV') {
      toggleModal();
   }
  }

  const toggleModal = () =>{
    setShowModal(!showModal)  
  }
  
  const handleSubmit = e => {
    e.preventDefault();
    API.resetPage()
    setLoading(true)
    const form = e.target 
    API.FetchPhoto(search)
      .then(photos =>  {
        setPhotos(photos.hits)
        setLoading(false)})
      .catch(errors => {
        setErrors('Повторите запрос')
        setLoading(false)
      });
      form.reset(); 
  };
  
  const handleChange = (e) => {
  setSearch(e.target.value )
  } 

  const onMoreClick = () => {
    API.FetchPhoto(search)
      .then(photos => {
        setPhotos(photo =>[...photo, ...photos.hits])
      })
      .finally(() => {
        window.scrollTo({
          top: document.documentElement.scrollHeight,
          behavior: "smooth",
        });
      })
  }; 

  const handleOpenModal = e => {
    if (e.currentTarget.tagName === 'LI') {
      setShowModal(true)
      setLargeImage(e.target.lowsrc)
    };
  }
  
    return (
    <>
    {showModal &&  (
      <Modal onChange={handleKeyDown} state={photos} image={largeImage} />
    )}
    <Searchbar  handleSubmit = {handleSubmit}  handleChange={handleChange} />
    {loading && <Loader 
        type="Puff"
        color="#00BFFF"
        height={100}
        width={100}
        timeout={3000} className='loader'>
        </Loader>}
    <div className='container'>
    {errors && <h2>Ошибка запроса</h2>}
   {photos !== "" ?
    <ImageGallery>
      <ImageGalleryItem photos= {photos} onClick={handleOpenModal}/> 
    </ImageGallery>: <></>}
    {(photos.length!==0 && photos.length %12===0) && <Button onClick={onMoreClick}/>}
    </div>
    </>
)}
