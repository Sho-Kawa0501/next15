import type { Database } from '../../database.types'

type AddressesInsert = Database['public']['Tables']['addresses']['Insert']

const test: AddressesInsert = {
  name: 'x',
  address_text: 'y',
  latitude: 1,
  longitude: 2,
  user_id: 'uid'
}

export default test
