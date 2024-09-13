import { createContext, ReactNode, useEffect, useState } from "react";

interface props {
  children: ReactNode;
}

const AuthContext = createContext({
  user: false,
  authReady: false,
})

export const AuthContextProvider: React.FC<props> = ({children}) => {
  const [user, setUser] = useState(false)
  const [authReady, setAuthReady] = useState(false)

  useEffect(() => {
    if(document.cookie)
      setUser(true)
    else
      setUser(false)
    setAuthReady(true)
  }, [])

  const context = {user, authReady}

  return (
    <AuthContext.Provider value={context}>{children}</AuthContext.Provider>
  )
}
export default AuthContext