import React, { useContext } from 'react'
import AppContext from '../../context/AppContext'

const Home = () => {
  const { sample } = useContext(AppContext);

  return (
    <div>Home - {sample}</div>
  )
}

export default Home