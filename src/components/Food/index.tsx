import { FiEdit3, FiTrash } from 'react-icons/fi';

import { Container } from './styles';
import api from '../../services/api';
import { useState } from 'react';
import {Foods} from '../../types';
 
interface FoodProps{ 
  foods: Foods;
  handleEditFood: (food:Foods) =>void;
  handleDelete: (id:number)=>void;
}

function Food({ foods, handleDelete, handleEditFood}:FoodProps){
  
  const[isAvailable, setIsAvailable] =useState(false);
    
  async function toggleAvailable() {
    
    await api.put(`/foods/${foods.id}`, {
      ...foods,
      available: !isAvailable,
    });    
    setIsAvailable(!isAvailable);
  }

  function setEditingFood(){    
    handleEditFood(foods);
  }
    
    return (
      <Container available={isAvailable}>
        <header>
          <img src={foods.image} alt={foods.name} />
        </header>
        <section className="body">
          <h2>{foods.name}</h2>
          <p>{foods.description}</p>
          <p className="price">
            R$ <b>{foods.price}</b>
          </p>
        </section>
        <section className="footer">
          <div className="icon-container">
            <button
              type="button"
              className="icon"
              onClick={()=>setEditingFood()}
              data-testid={`edit-food-${foods.id}`}
            >
              <FiEdit3 size={20} />
            </button>

            <button
              type="button"
              className="icon"
              onClick={() => handleDelete(foods.id)}
              data-testid={`remove-food-${foods.id}`}
            >
              <FiTrash size={20} />
            </button>
          </div>

          <div className="availability-container">
            <p>{isAvailable ? 'Disponível' : 'Indisponível'}</p>

            <label htmlFor={`available-switch-${foods.id}`} className="switch">
              <input
                id={`available-switch-${foods.id}`}
                type="checkbox"
                checked={isAvailable}
                onChange={()=>toggleAvailable()}
                data-testid={`change-status-food-${foods.id}`}
              />
              <span className="slider" />
            </label>
          </div>
        </section>
      </Container>
    );
  
};

export default Food;
