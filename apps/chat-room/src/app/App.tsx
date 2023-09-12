import { createBrowserRouter, createRoutesFromElements, Route, RouterProvider } from 'react-router-dom';
import Root from './pages/index';
import Providers from './Providers';

const router = createBrowserRouter(
    createRoutesFromElements(
        <Route path="/" element={<Root />} />
    )
)

const App = () => {
    return <Providers>
        <RouterProvider router={router} />
    </Providers>;
}

export default App;