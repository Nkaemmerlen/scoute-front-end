import * as tokenService from './tokenService'
const BASE_URL = `${process.env.REACT_APP_BACKEND_SERVER_URL}/restaurants`


function create(restaurant) {
  return fetch(`${BASE_URL}`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${tokenService.getToken()}`
    },
    body: restaurant
  })
  .then(res => res.json())
}

function getAll() {
  return fetch(`${BASE_URL}`, {
    headers: {
      'Authorization': `Bearer ${tokenService.getToken()}`
    }
  })
  .then(res => res.json())
}

function deleteOne(id) {
  return fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${tokenService.getToken()}`
    },
  })
  .then(res => res.json())
}

function update(restaurant) {
  return fetch(`${BASE_URL}/${restaurant.get('_id')}`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${tokenService.getToken()}`
    },
    body: restaurant
  })
  .then(res => res.json())
}

//^^ MAY NOT NEED THIS UPDATE FUNCTION

export {
  create,
  getAll,
  deleteOne,
  update
}