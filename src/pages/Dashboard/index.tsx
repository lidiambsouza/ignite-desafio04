import {useEffect, useState} from 'react'

import Header from '../../components/Header';
import api from '../../services/api';
import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';
import { FoodsContainer } from './styles';
import {Foods} from '../../types';

interface DashboardProps{
  foods: Foods[];
  editingFood: Foods;
  modalOpen: Boolean;
  editModalOpen: Boolean;
}

function Dashboard({foods,editingFood,modalOpen,editModalOpen}:DashboardProps) { 
  const [status, setStatus] = useState<DashboardProps>({
    foods:[],
    editingFood:{} as Foods,
    modalOpen:false,
    editModalOpen:false
  });
  
  useEffect(() => {
    api.get('/foods')
      .then(response => 
        setStatus({...status, foods: response.data})
      )
       
  }, []);
  

  async function handleAddFood(food:Foods) {  

    try {
      const response = await api.post('/foods', {
        ...food,
        available: true,
      });

      setStatus({...status, foods: [...foods, response.data]});
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food:Foods) {    
    try {
      const foodUpdated = await api.put(
        `/foods/${editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setStatus({...status, foods: foodsUpdated});
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id:number) {    

    await api.delete(`/foods/${id}`);

    const foodsFiltered = foods.filter(food => food.id !== id);

    setStatus({...status, foods: foodsFiltered});
  }

  function toggleModal(){
    setStatus({...status, modalOpen: !modalOpen});
  }

  function toggleEditModal(){
    setStatus({...status, editModalOpen: !editModalOpen}!);
  }

  function handleEditFood(food:Foods){
    setStatus({ ...status, editingFood: food, editModalOpen: true });
  }  

  return (
      <>
        <Header openModal={()=>toggleModal()} />
        <ModalAddFood
          isOpen={modalOpen}
          setIsOpen={()=>toggleModal()}
          handleAddFood={(food:Foods)=>handleAddFood(food)}
        />
        <ModalEditFood
          isOpen={editModalOpen}
          setIsOpen={()=>toggleEditModal()}
          editingFood={editingFood}
          handleUpdateFood={(food:Foods)=>handleUpdateFood(food)}
        />

        <FoodsContainer data-testid="foods-list">
          {foods &&
            foods.map(food => (
              <Food
                key={food.id}
                foods={food}
                handleDelete={()=>handleDeleteFood(food.id)}
                handleEditFood={()=>handleEditFood(food)}
              />
            ))}
        </FoodsContainer>
      </>
  );
  
};

export default Dashboard;
