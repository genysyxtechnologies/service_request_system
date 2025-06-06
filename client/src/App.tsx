import { Route, Routes } from "react-router-dom";
import SignIn from "./components/pages/authentication/SignIn";
import SignUp from "./components/pages/authentication/SignUp";
import Presentation from "./components/pages/presentation/Presentation";
import Home from "./components/pages/presentation/home/Home";
import Services from "./components/pages/presentation/Services/Services";
import RequestTable from "./components/pages/presentation/request/RequestTable";
import ManageRequests from "./components/pages/presentation/request/ManageRequests";
import Dashboard from "./components/pages/presentation/dashboard/Dashboard";
import Department from "./components/pages/presentation/department/department";
import ServiceCategory from "./components/pages/presentation/category/ServiceCategory";
import CategoryPage from "./components/pages/presentation/category/Category";
import { Toaster } from "sonner";
import RouterSecurity from "./RouterSecurity";
import RequestContextProvider from "./context/request.context/RequestContextProvider";
import NotificationsPage from "./components/pages/presentation/notification/NotificationPage";
import Profile from "./components/pages/presentation/profile/Profile";
import Users from "./components/pages/presentation/users/Users";
import Supervisors from "./components/pages/presentation/supervisors/Supervisors";

function App() {
  return (
    <div className="flex mx-auto">
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route
          path="/app"
          element={
            <RouterSecurity>
              <RequestContextProvider>
                <Presentation />
              </RequestContextProvider>
            </RouterSecurity>
          }
        >
          <Route index element={<Home />} />
          <Route path="services" element={<Services />} />
          <Route path="request" element={<RequestTable />} />
          <Route path="manage-requests" element={<ManageRequests />} />
          <Route path="department" element={<Department />} />
          <Route path="service-category" element={<ServiceCategory />} />
          <Route path="categories" element={<CategoryPage />} />
          <Route path="notification" element={<NotificationsPage />} />
          <Route path="dashboard" element={<Dashboard />} />
         {/*  <Route path="requesters" element={<Requesters />} />
          <Route path="managers" element={<Managers />} /> */}
          <Route path="users" element={<Users />} />
          <Route path="profile" element={<Profile />} />
          <Route path="supervisor" element={<Supervisors />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
