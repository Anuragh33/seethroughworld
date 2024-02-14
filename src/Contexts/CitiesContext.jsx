import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
} from "react"

const CitiesContext = createContext()

const URL = "http://localhost:9000"

const InitialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
}

function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return {
        ...state,
        isLoading: true,
      }
    case "cities/loaded":
      return {
        ...state,
        isLoading: false,
        cities: action.payload,
      }
    case "city/loaded":
      return {
        ...state,
        isLoading: false,
        currentCity: action.payload,
      }
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      }
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      }
    case "rejected":
      return {
        ...state,
        isLoading: false,
        error: action.payload,
      }
    default:
      throw new Error("Unknown action type")
  }
}

function CitiesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, InitialState)
  const { cities, isLoading, currentCity, error } = state

  useEffect(() => {
    async function fetchCities() {
      dispatch({ type: "loading" })
      try {
        const res = await fetch(`${URL}/cities`)
        const data = await res.json()
        dispatch({ type: "cities/loaded", payload: data })
      } catch {
        dispatch({
          type: "rejected",
          payload: "There was error loading cities.",
        })
      }
    }
    fetchCities()
  }, [])

  async function getCity(id) {
    if (Number(id) === currentCity.id) return

    dispatch({ type: "loading" })

    try {
      const res = await fetch(`${URL}/cities?id=${id}`)
      const data = await res.json()
      dispatch({ type: "city/loaded", payload: data })
    } catch {
      dispatch({
        type: "rejected",
        payload: "There is an error in getting current city.",
      })
    }
  }

  async function createCity(newCity) {
    dispatch({ type: "loading" })
    try {
      const res = await fetch(`${URL}/cities`, {
        method: "POST",
        body: JSON.stringify(newCity),
        headers: {
          "Content-Type": "application/json",
        },
      })
      const data = await res.json()
      dispatch({ type: "city/created", payload: data })
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error creating a city.",
      })
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" })
    try {
      const res = await fetch(`${URL}/cities/${id}`, {
        method: "DELETE",
      })
      dispatch({
        type: "city/deleted",
        payload: id,
      })
    } catch {
      dispatch({
        type: "rejected",
        payload: "There was an error deleting a city.",
      })
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        getCity,
        createCity,
        deleteCity,
        error,
      }}
    >
      {children}
    </CitiesContext.Provider>
  )
}

function useCities() {
  const context = useContext(CitiesContext)
  if (context === undefined)
    throw new Error(" Cities context was used outside the cities provider")
  return context
}

export { CitiesProvider, useCities }
