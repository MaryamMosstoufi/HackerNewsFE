import React, {useState, useEffect} from 'react';
import { axiosWithAuth } from '../../utils/axiosWithAuth';
import ItemCard from '../ItemCard.js';

export default function Favorites(){
  
  const [favorites, setFavorites] = useState([]);
  
  // useEffect(() => {
  //   axiosWithAuth()
  //     .get()
  //     .then()
  //     .catch()
    
  // })
  console.log(favorites);
  return (
    <div>
      Favorites
      {favorites.map(item =>
        <ItemCard key={item.id} item={item} />
      )} 
    </div>
  )
}
