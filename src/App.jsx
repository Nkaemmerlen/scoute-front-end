import { useState } from 'react'
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'
import NavBar from './components/NavBarTop/NavBarTop'
import Signup from './pages/Signup/Signup'
import Login from './pages/Login/Login'
import Landing from './pages/Landing/Landing'
import Profiles from './pages/Profiles/Profiles'
import Home from './pages/Home/Home'
import ChangePassword from './pages/ChangePassword/ChangePassword'
import * as authService from './services/authService'
import * as restaurantService from './services/restaurantService'
import * as parkingService from './services/parkingService'
import Restaurants from './pages/RestaurantList/RestaurantList'
import RestaurantDetails from './pages/RestaurantDetails/RestaurantDetails'
import AddRestaurant from './pages/AddRestaurant/AddRestaurant'
import Restrooms from './pages/RestroomList/RestroomList'
import Parkinglots from './pages/ParkingList/ParkingList'
import AddParking from './pages/AddParking/AddParking'
import ParkingDetails from './pages/ParkingDetails/ParkingDetails'

const App = () => {
  const [user, setUser] = useState(authService.getUser())
  const [parkinglots, setParkinglots] = useState([])
  const [restrooms, setRestrooms] = useState([])
  const [ipAddress, setIPAddress] = useState({})
  const [reviews, setReviews] = useState([])
  const [message, setMessage] = useState([''])
  const [restaurants, setRestaurants] = useState([])
  const [searchData, setSearchData] = useState({
    search: ''
  })
  
  const navigate = useNavigate()

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

  const handleSubmitParking = async evt => {
    evt.preventDefault()
    try {
      await parkingService.getAll(searchData.search)
      .then(search => {
        setParkinglots([...parkinglots, search])
      })
    }
    catch (err) {
      console.log(err)
    }
  }
  
  const { search } = searchData
  
  const isFormInvalid = () => {
    return!(search)
  }

  const handleAddRestaurant = async newRestaurantData => {
    const newRestaurant = await restaurantService.create(newRestaurantData)
    setRestaurants([...restaurants, newRestaurant])
    navigate('/restaurants')
  }

  const handleLogout = () => {
    authService.logout()
    setUser(null)
    navigate('/')
  }

  const updateMessage = msg => {
    setMessage(msg)
  }

  const handleSignupOrLogin = () => {
    setUser(authService.getUser())
  }

  const handleAddParking = async newParkingData => {
    const newParking = await parkingService.create(newParkingData)
    setParkinglots([...parkinglots, newParking])
    navigate('/parkinglots')
  }

  const handleDeleteParking = id => {
    console.log('delete')
    console.log(id)
    parkingService.deleteOne(id)
    .then(deletedParkinglot => setParkinglots(parkinglots.filter(parkinglot => parkinglot._id !== deletedParkinglot._id)))
    navigate('/parkinglots')
  }

  // const handleUpdateParking = updatedParkingData => {
  //   parkingService.update(updatedParkingData)
  //   .then(updatedParking => {
  //     const newParkingArray = parkinglots.map(parking => parking._id === updatedParking._id ? updatedParking : parking)
  //     setParkinglots(newParkingArray)
  //     navigate('/parkinglots')
  //   })
  // }
// ^ if we want to be able to edit the parking lots


  return (
    <>
      <Routes>
        <Route 
          path='/home'
          element={user ? 
            <Home 
              user={user} 
              handleLogout={handleLogout} 
            /> 
            : 
            <Navigate to="/" />
          }
        />
        <Route 
          path="/" 
          element={
            <Landing 
              updateMessage={updateMessage} 
              handleSignupOrLogin={handleSignupOrLogin} 
            />
          } 
        />
        <Route
          path="/signup"
          element={
            <Signup 
              handleSignupOrLogin={handleSignupOrLogin} 
            />
          }
        />
        <Route
          path="/login"
          element={
            <Login 
              handleSignupOrLogin={handleSignupOrLogin} 
            />
          }
        />
        <Route
          path="/profiles"
          element={user ? <Profiles /> : <Navigate to="/login" />}
        />
        <Route
          path="/changePassword"
          element={user ? 
            <ChangePassword 
              handleSignupOrLogin={handleSignupOrLogin} 
            /> 
            : 
            <Navigate to="/login" />
          }
        />
        <Route
          path="/restaurants"
          element={user ? 
            <Restaurants 
              handleChangeRestaurant={handleChange}
              handleSubmitRestaurant={handleSubmit}
              isFormInvalid={isFormInvalid}
              search={search}
              restaurants={restaurants}
              handleLogout={handleLogout}
              user={user} 
            /> 
            : 
            <Navigate to="/" />
          }
        />
        <Route
          path="/restaurants/:id"
          element={user ? 
            <RestaurantDetails 
              handleLogout={handleLogout} 
              user={user} 
            /> 
            : 
            <Navigate to="/" />
          }
        />
        <Route 
          path="/restaurants/add"
          element={user ? 
            <AddRestaurant 
              handleAddRestaurant={handleAddRestaurant} 
              isFormInvalid={isFormInvalid}
              handleLogout={handleLogout}
              user={user} 
            /> 
            : 
            <Navigate to="/" />
          }
        />
        <Route
          path="/parkinglots"
          element={user ? 
            <Parkinglots
              search={search}
              handleChangeParking={handleChange}
              handleSubmitParking={handleSubmitParking}
              parkinglots={parkinglots} 
              handleLogout={handleLogout}
              user={user} 
            />
            : 
            <Navigate to="/" />
          }
        />
        <Route
          path="/parkinglots/add"
          element={user ? 
            <AddParking 
              handleAddParking={handleAddParking}
              handleLogout={handleLogout}
              user={user} 
            /> 
            : 
            <Navigate to='/' />
          }
        />
        <Route
        path="/parkinglots/:id"
        element={user ? <ParkingDetails 
          user={user}
          handleDeleteParking={handleDeleteParking}/> : <Navigate to="/parkinglots" />}
        />
        <Route
          path="/restrooms"
          element={user ? 
            <Restrooms 
              handleLogout={handleLogout}
              user={user} 
            /> 
            : 
            <Navigate to="/" />
          }
        />
      </Routes>
    </>
  )
}

export default App
