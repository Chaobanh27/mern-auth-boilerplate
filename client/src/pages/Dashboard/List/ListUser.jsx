import { useDebounce } from '@uidotdev/usehooks'
import { useEffect, useState } from 'react'
import { fetchAllRolesAPI, fetchAllUsersAPI } from '~/apis'
import TableItem from '~/components/Dashboard/TableItem'
import LoadingSpinner from '~/components/LoadingSpinner'

const ListUsers = () => {
  const [users, setUsers] = useState([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')
  const [filters, setFilters] = useState({ role: '', status: '' })
  const [sort, setSort] = useState({ field: 'createdAt', order: 'desc' })
  const [roles, setRoles] = useState([])

  const debouncedSearch = useDebounce(search, 500)

  const fetchRoles = async () => {
    const data = await fetchAllRolesAPI()
    setRoles(data)
  }

  const fetchData = async () => {
    const data = await fetchAllUsersAPI({
      search: debouncedSearch,
      page,
      limit: 10,
      role: filters.role,
      status: filters.status,
      sortBy: sort.field,
      order: sort.order
    })
    setUsers(data.users)
    setTotalPages(data.totalPages)
  }


  useEffect(() => {
    fetchRoles()
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters, sort, debouncedSearch])

  return (
    <>
      <h1 className="text-gray-900 dark:text-white mt-5">All Users</h1>


      <div className="p-4">
        {/* SEARCH + FILTER */}
        <div className="flex justify-between mb-4 ">
          <input
            type="text"
            placeholder="Search...."
            className="border p-2 rounded w-1/3 dark:border-white dark:text-white"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <div className="flex gap-2">
            <select
              className="border p-2 rounded dark:border-white dark:text-white"
              onChange={(e) => setFilters(f => ({ ...f, role: e.target.value }))}
            >
              <option className='dark:text-black' value="">All roles</option>

              {
                roles.length > 0 && roles.map(role => {
                  return (
                    <option key={role._id} className='dark:text-black' value={role._id} >{role.name}</option>
                  )
                })
              }
            </select>

            <select
              className="border p-2 rounded dark:border-white dark:text-white"
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            >
              <option className='dark:text-black' value="All">All status</option>
              <option className='dark:text-black' value="Active">Active</option>
              <option className='dark:text-black' value="InActive">InActive</option>
            </select>
          </div>
        </div>

        {/* TABLE */}
        {/* <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100">
              <th
                className="border p-2 cursor-pointer"
                onClick={() =>
                  setSort(s => ({
                    field: 'username',
                    order: s.order === 'asc' ? 'desc' : 'asc'
                  }))
                }
              >
              Username {sort.field === 'username' ? (sort.order === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="border p-2">Email</th>
              <th className="border p-2">Role</th>
              <th className="border p-2">Status</th>
              <th
                className="border p-2 cursor-pointer"
                onClick={() =>
                  setSort(s => ({
                    field: 'createdAt',
                    order: s.order === 'asc' ? 'desc' : 'asc'
                  }))
                }
              >
              Created {sort.field === 'createdAt' ? (sort.order === 'asc' ? '↑' : '↓') : ''}
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u._id}>
                <td className="border p-2">{u.username}</td>
                <td className="border p-2">{u.email}</td>
                <td className="border p-2">{u.role}</td>
                <td className="border p-2">{u.isActive ? 'Active' : 'InActive'}</td>
                <td className="border p-2">
                  {new Date(u.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table> */}
        {!users ? <LoadingSpinner/> :<TableItem data={users} sort={sort} setSort={setSort}/>}

        {/* PAGINATION */}
        <div className="flex justify-center items-center mt-4 gap-3">
          <button
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
          >
          Prev
          </button>

          <span>{page} / {totalPages}</span>

          <button
            className="px-3 py-1 border rounded disabled:opacity-50 cursor-pointer"
            disabled={page === totalPages}
            onClick={() => setPage(p => p + 1)}
          >
          Next
          </button>
        </div>
      </div>
    </>
  )
}

export default ListUsers