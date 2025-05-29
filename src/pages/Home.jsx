import Dashboard from "../components/dashboard";
import Menu from "../components/Menu";
import { ValuesProvider } from '../context/ValuesContext';

export default function Home() {
  return (
    <ValuesProvider>
      <Menu />
      <Dashboard />
    </ValuesProvider>
  )
}
