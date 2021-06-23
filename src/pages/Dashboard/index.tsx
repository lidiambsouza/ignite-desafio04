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
  modalOpen: boolean;
  editModalOpen: boolean;
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

      setStatus({...status, foods: [...status.foods, response.data]});
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(food:Foods) {       
    try {
      const foodUpdated = await api.put(
        `/foods/${status.editingFood.id}`,
        { ...editingFood, ...food },
      );

      const foodsUpdated = status.foods.map(f =>
        f.id !== foodUpdated.data.id ? f : foodUpdated.data,
      );

      setStatus({...status, foods: foodsUpdated});
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id:number) {    

    await api.delete(`/foods/${id}`);

    const foodsFiltered = status.foods.filter(food => food.id !== id);

    setStatus({...status, foods: foodsFiltered});
  }

  function toggleModal(){
    // setStatus({...status, modalOpen: !status.modalOpen});
    status.modalOpen = !status.modalOpen
    setStatus(status);     
    
  }

  function toggleEditModal(){  
    status.editModalOpen = !status.editModalOpen
    setStatus(status);         
  }

  function handleEditFood(food:Foods){
    setStatus({ ...status, editingFood: food, editModalOpen: true });
  }  

  return (
      <>
        <Header openModal={toggleModal} />
        <ModalAddFood
          isOpen={status.modalOpen}
          setIsOpen={toggleModal}
          handleAddFood={(food:Foods)=>handleAddFood(food)}
        />
        <ModalEditFood
          isOpen={status.editModalOpen}
          setIsOpen={toggleEditModal}
          editingFood={status.editingFood}
          handleUpdateFood={(food:Foods)=>handleUpdateFood(food)}
        />

        <FoodsContainer data-testid="foods-list">
          {status.foods &&
            status.foods.map(food => (
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
