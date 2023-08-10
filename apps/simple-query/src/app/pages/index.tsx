import Dashboard from "../components/Dashboard";
import AuthWall from "../components/AuthWall";

export const Index = () => {

    return <AuthWall>
        <Dashboard />
    </AuthWall>
}

export default Index;