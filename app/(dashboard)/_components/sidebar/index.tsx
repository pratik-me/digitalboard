import { List } from "./list"
import SidebarButton from "./sidebar-button"

const Sidebar = () => {
  return (
    <aside className='fixed x-[1] left-0 bg-blue-950 h-full w-15 flex p-3 flex-col gap-y-4 text-white'>
      <List />
      <SidebarButton />
    </aside>
  )
}

export default Sidebar