import { postRequest } from '../config'

function login (userName, password) {
  return postRequest(
    `6/login`,
    { userName, password }
  )
}


export default {
  login
}
