import UserCard from './UserCard';
import { users } from './data/users';

const Sidebar = ({ selectedId, setSelectedUser }) => {
  return (
    <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
      <div className="p-4 flex justify-between items-center">
        <h2 className="font-semibold text-lg">Messages</h2>
        <div className="flex gap-2 items-center">
          <button className="text-gray-500 hover:text-purple-primary">
            &#128269;
          </button>
          <button className="text-gray-500 hover:text-purple-primary">
            &#9881;
          </button>
        </div>
      </div>
      <div className="flex gap-2 px-4 pb-2">
        <button className="bg-purple-primary text-white px-3 py-1 rounded-full">
          All ▼
        </button>
        <button className="bg-gray-200 px-3 py-1 rounded-full">Unread</button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {users.map((user) => (
          <UserCard
            key={user.id}
            user={user}
            active={user.id === selectedId}
            onClick={() => setSelectedUser(user)}
          />
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
