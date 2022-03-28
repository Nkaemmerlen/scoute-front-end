import { useState, useEffect } from 'react';
import * as restaurantService from '../../services/restaurantService'
import RestaurantCard from '../../components/RestaurantCard/RestaurantCard'
import NavBarBot from '../../components/NavBarBot/NavBarBot';
import NavBarTopSearch from '../../components/NavBarTopSearch/NavBarTopSearch';
import './RestaurantList.css'

const Restaurants = (props) => {
  
  const [searchData, setSearchData] = useState({
    search: ''
  })

  const [restaurants, setRestaurants] = useState({})

  const handleChange = e => {
    setSearchData({ ...searchData, [e.target.name]: e.target.value })
  }
  
  const handleSubmit = async evt => {
    evt.preventDefault()
    try {
      await restaurantService.getAll(searchData.search)
      .then(search => {
        setRestaurants(search)
      })
    } 
    catch (err) {
      console.log(err);
    }
  }
  
  const { search } = searchData
  
  const isFormInvalid = () => {
    return!(search)
  }

  return ( 
    <>
      <NavBarTopSearch 
        handleChange={handleChange} 
        handleSubmit={handleSubmit} 
        isFormInvalid={isFormInvalid} 
        search={search}
      />
      <h1 id='restaurant-header' >Restaurants</h1>
      <div>
        {!restaurants.length ?
        <div id='no-rest'> 
          <h2>No Restaurants, Please enter your location in the search bar above.</h2>
          <small id='small-text'>Or allow access to your location</small>
        </div>
        :
          <h2 id='all-cards'>
            {restaurants.map((restaurant, idx) => 
              <RestaurantCard key={idx} restaurant={restaurant} />
            )}
          </h2>
        }
      </div>
      <NavBarBot page='restaurants'/>
    </>
  );
}

export default Restaurants;