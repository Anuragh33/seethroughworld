import { createContext, useContext, useReducer } from "react"

const AuthContext = createContext()

const INITIALSTATE = {
  user: null,
  isAuthenticated: false,
}

const FAKE_USER = {
  name: "Jack",
  email: "jack@example.com",
  password: "qwerty",
  avatar: "https://i.pravatar.cc/100?u=zz",
}

function reducer(state, action) {
  switch (action.type) {
    case "login":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      }
    case "logout":
      return INITIALSTATE

    default:
      throw new Error("Unknown action selected!!")
  }
}

function AuthProvider({ children }) {
  const [{ user, isAuthenticated }, dispatch] = useReducer(
    reducer,
    INITIALSTATE
  )
  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password)
      return dispatch({ type: "login", payload: FAKE_USER })
  }

  function logout() {
    dispatch({ type: "logout" })
  }

  return (
    <AuthProvider
      value={{
        user,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </AuthProvider>
  )
}

function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined)
    throw new Error("AuthContext used outside of AuthProvider")
}

export { AuthProvider, useAuth }
