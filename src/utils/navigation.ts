import { useNavigate } from "react-router-dom"

let globalNavigate: ReturnType<typeof useNavigate> | null = null

export const setNavigator = (nav: ReturnType<typeof useNavigate>) => {
  globalNavigate = nav
}

export const navigate = (to: string) => {
  if (globalNavigate) {
    globalNavigate(to)
  } else {
    console.warn("Navigator not ready yet")
  }
}
