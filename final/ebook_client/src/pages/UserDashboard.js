import UserProfile from "../components/UserProfile"
//import Wishlist from "../components/Wishlist"
//import ReminderList from "../components/ReminderList"
//import RentalHistory from "../components/RentalHistory"
//import CurrentRentals from "../components/CurrentRentals"

export default function UserDashboard() {
  return (
    <div>
      <h1 style={styles.dashboardTitle}>圖書租借系統</h1>
      <UserProfile />
      {/*<CurrentRentals />*/}
      {/*<Wishlist />*/}
      {/*<ReminderList />*/}
      {/*<RentalHistory />*/}
    </div>
  )
}

const styles = {
  dashboardTitle: {
    textAlign: "center",
    margin: "20px 0",
    color: "#333",
    fontFamily: "Arial, sans-serif",
  },
}
