
import Dashboard from "../components/Dashboard";
import Menu from "../components/Menu";
import MenuMobile from "../components/MenuMobile";
import { ValuesProvider } from '../context/ValuesContext';

export default function Home() {
  return (
    <ValuesProvider>
      <div className="flex">
        <div className="hidden xl:flex">
          <Menu />
        </div>
        <div className="flex xl:hidden">
          <MenuMobile />
        </div>
        <Dashboard />
      </div>
    </ValuesProvider>
  )
}
