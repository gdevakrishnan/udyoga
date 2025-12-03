import React, { Fragment, useState } from 'react'
import AppRouter from './router/Router'
import AppContext from './context/AppContext'

const App = () => {
  const [sample, setSample] = useState("Udyoga");

  const context = {
    sample
  }

  return (
    <Fragment>
      <AppContext.Provider value={context}>
        <AppRouter />
      </AppContext.Provider>
    </Fragment>
  )
}

export default App