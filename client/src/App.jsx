import { Navigate, Outlet, Route, Routes } from "react-router-dom";

import { Navbar } from "./components/navbar";

import { Home } from "./pages/home";
import { SignIn } from "./pages/sign-in";
import { SignUp } from "./pages/sign-up";
import { Tasks } from "./pages/tasks";
import { Profile } from "./pages/profile";
import { CreateTask } from "./pages/create-task";
import { UpdateTask } from "./pages/update-task";
import { TaskDetails } from "./pages/task-details";

export const App = () => {
  const Authentication = () => {
    const token = localStorage.getItem("__tmutoken");
    const id = localStorage.getItem("__tmuid");

    return token && id ? <Outlet /> : <Navigate to="/sign-in/" />;
  };

  const PreventAuthScreen = () => {
    const token = localStorage.getItem("__tmutoken");
    const id = localStorage.getItem("__tmuid");

    return token && id ? <Navigate to="/tasks/" /> : <Outlet />;
  };

  return (
    <div className="h-[100svh] w-full overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex-1 overflow-hidden">
        <Routes>
          <Route path="/sign-in/" Component={PreventAuthScreen}>
            <Route path="/sign-in/" Component={SignIn} />
          </Route>
          <Route path="/sign-up/" Component={PreventAuthScreen}>
            <Route path="/sign-up/" Component={SignUp} />
          </Route>
          <Route path="/" Component={PreventAuthScreen}>
            <Route path="/" Component={Home} />
          </Route>
          <Route path="/tasks/" Component={Authentication}>
            <Route path="/tasks/" Component={Tasks} />
          </Route>
          <Route path="/tasks/:queries" Component={Authentication}>
            <Route path="/tasks/:queries" Component={Tasks} />
          </Route>
          <Route path="/tasks/create/" Component={Authentication}>
            <Route path="/tasks/create/" Component={CreateTask} />
          </Route>
          <Route path="/tasks/details/:taskid" Component={Authentication}>
            <Route path="/tasks/details/:taskid" Component={TaskDetails} />
          </Route>
          <Route
            path="/tasks/details/:taskid/update"
            Component={Authentication}
          >
            <Route
              path="/tasks/details/:taskid/update"
              Component={UpdateTask}
            />
          </Route>
          <Route path="/profile/" Component={Authentication}>
            <Route path="/profile/" Component={Profile} />
          </Route>
        </Routes>
      </div>
    </div>
  );
};
