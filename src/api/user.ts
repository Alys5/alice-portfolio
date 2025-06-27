// Modulo API utente di esempio
import axios from './index'

export async function fetchUserProfile(userId: string) {
  const { data } = await axios.get(`/users/${userId}`)
  return data
}
