import TopBar from './TopBar'
import BottomNav from './BottomNav'
import CurrentPrayerCard from './CurrentPrayerCard'

const Home = () => {
  return (
    <div>
      <TopBar/>
      <CurrentPrayerCard/>
      <BottomNav/>
    </div>
  )
}

export default Home