import { Sidebar } from "./components/Sidebar"
import { Header } from "./components/Header"
import { Card } from "./components/Card"

const Home = () => {
  return(
    <main>
      <Card
        title="Simple Card"
        description="This is a simple useless card."
        color="purple"
      />
    </main>
  )
}

export default Home