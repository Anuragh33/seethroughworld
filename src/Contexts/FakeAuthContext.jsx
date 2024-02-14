import { createContext, useContext } from "react"

const AuthContext = createContext()

function AuthProvider({ children }) {
  return <AuthProvider>{children}</AuthProvider>
}

function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined)
    throw new Error("AuthContext is used outside of AuthProvider")
}
