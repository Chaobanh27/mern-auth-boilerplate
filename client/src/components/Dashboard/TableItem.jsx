import { useLocation } from 'react-router-dom'
import { Table, Thead, Tbody, Tr, Th, Td } from 'react-super-responsive-table'
import 'react-super-responsive-table/dist/SuperResponsiveTableStyle.css'


const TableItem = ({ data, sort, setSort }) => {
  const location = useLocation()
  const url = (location.pathname).substring('/dashboard/'.length)
  if (url === 'list-users') {
    return (

      <div className="overflow-x-auto ">
        <Table className="w-full text-sm text-gray-900 dark:text-white border border-gray-200">
          <Thead className="bg-gray-100 uppercase text-gray-900">
            <Tr>
              <Th className="p-3 text-center">#</Th>
              <Th className="p-3 ">Avatar</Th>
              <Th className="p-3 text-start cursor-pointer"
                onClick={() =>
                  setSort(s => ({
                    field: 'username',
                    order: s.order === 'asc' ? 'desc' : 'asc'
                  }))
                }
              >Username {sort.field === 'username' ? (sort.order === 'asc' ? '↑' : '↓') : ''}
              </Th>
              <Th className="p-3 text-start">Email</Th>
              <Th className="p-3 text-start">Role</Th>
              <Th className="p-3 text-start cursor-pointer"
                onClick={() =>
                  setSort(s => ({
                    field: 'createdAt',
                    order: s.order === 'asc' ? 'desc' : 'asc'
                  }))
                }
              >Created At {sort.field === 'createdAt' ? (sort.order === 'asc' ? '↑' : '↓') : ''}
              </Th>
              <Th className="p-3 text-start">Status</Th>
              <Th className="p-3">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data && data.map((user, i) => {
              return (
                <Tr key={user._id} className="border-t border-gray-200">
                  <Td className="text-center p-3">{i + 1}</Td>
                  <Td className="p-3">
                    <img src={user.avatar} alt="user avatar" className="w-10 h-10 rounded-full object-cover m-auto" />
                  </Td>
                  <Td className="p-3">{user.username}</Td>
                  <Td className="p-3">{user.email}</Td>
                  <Td className="p-3">{user.role.name}</Td>
                  <Td className="p-3">{new Date(user.createdAt).toLocaleDateString()}</Td>
                  <Td className="p-3">
                    <span
                      className={`${
                        user.isActive ? 'text-green-600' : 'text-orange-600'
                      } font-semibold`}
                    >
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </Td>
                  <Td>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300
                       rounded-full peer peer-checked:bg-blue-600
                       after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                       after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all
                       peer-checked:after:translate-x-full peer-checked:after:border-white">
                      </div>
                    </label>
                  </Td>
                </Tr>
              )}
            )
            }
          </Tbody>
        </Table>
      </div>
    )
  }

  return (

    <div className='relative h-4/5 mt-4 max-w-4xl overflow-x-auto shadow rounded-lg scrollbar-hide bg-white dark:bg-gray-800'>
      <table className='w-full text-sm text-gray-500'>
        <thead className='text-xs text-gray-600 text-left uppercase'>
          <tr>
            <th scope='col' className='px-2 py-4 xl:px-6'> # </th>
            <th scope='col' className='px-2 py-4'> Email </th>
            <th scope='col' className='px-2 py-4 max-sm:hidden'> Date </th>
            <th scope='col' className='px-2 py-4 max-sm:hidden'> Status </th>
            <th scope='col' className='px-2 py-4'> Actions </th>
          </tr>
        </thead>
        <tbody>
          {/* đây là nơi hiển thị dữ liệu danh sách */}
        </tbody>
      </table>

    </div>
  )
}

export default TableItem