import { PacmanLoader } from 'react-spinners'

const LoadingSpinner = () => {
  return (
    <div className='flex justify-center items-center h-screen'>
      <PacmanLoader color='#1200ff' />
    </div>
  )
}

export default LoadingSpinner