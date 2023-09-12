import {
    createBrowserRouter,
    RouterProvider,
    LoaderFunction,
    ActionFunction,
    RouteObject
} from "react-router-dom";
import Providers from "./Providers";
import DefaultErrorElement from "./DefaultErrorElement";

const pages = import.meta.glob<Pick<RouteObject, 'path' | 'loader' | 'action'> & {
    default: any;
    ErrorBoundary: any
}>("./pages/**/*.tsx", { eager: true });

const routes: RouteObject[] = [];
for (const path of Object.keys(pages)) {
    const fileName = path.match(/\.\/pages\/(.*)\.tsx$/)?.[1];
    if (!fileName) {
        continue;
    }

    const normalizedPathName = fileName.includes("$")
        ? fileName.replace("$", ":")
        : fileName.replace(/\/index/, "");

    const Element = pages[path].default;
    const ErrorElement = pages[path]?.ErrorBoundary;

    routes.push({
        path: fileName === "index" ? "/" : `/${normalizedPathName.toLowerCase()}`,
        element: <Element />,
        loader: pages[path]?.loader as unknown as LoaderFunction | undefined,
        action: pages[path]?.action as unknown as ActionFunction | undefined,
        errorElement: ErrorElement ? <ErrorElement /> : <DefaultErrorElement />,
    });
}

const router = createBrowserRouter(routes)

const App = () => {
    return <Providers>
        <RouterProvider router={router} />
    </Providers>;
};

export default App;