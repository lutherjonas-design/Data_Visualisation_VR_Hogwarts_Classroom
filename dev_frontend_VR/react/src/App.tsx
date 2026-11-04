
import { ThemeProvider } from "./context/ThemeContext";
import { LanguageProvider/*, useLanguage*/ } from "./context/LanguageContext";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import MainLayout from "./layouts/MainLayout";
import ProjectOverview from "./pages/ProjectsOverview";
import ProjectDetailPage from "./pages/ProjectDetail";
import PageNotFound from "./pages/PageNotFound";
import PageFile from "./pages/PageFile";
import PageTesting from "./pages/PageTesting";


function RootRoute() {
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootRoute />, // Lädt das Layout mit der Navigationsleiste
    children: [
      {
        path: "/", //Landing Page
        element: <ProjectOverview />,
      },
      {
        path: "/project/:slug/files", // create Projects
        element: <PageFile />
      },
      {
         path: "/project/:slug", // Project sides
         element: <ProjectDetailPage />,
      },
      {
        path: "/test/",
        element: <PageTesting />
      },
      {
        path: "*",
        element: <PageNotFound />
      }
    ],
  },
]);

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider> 
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>
  );
}


