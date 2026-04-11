const LeaderboardTable = ({ users }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-gray-700">
            <th className="p-3 text-left">#</th>
            <th className="p-3 text-left">Name</th>
            <th className="p-3 text-center">Level</th>
            <th className="p-3 text-right">XP</th>
          </tr>
        </thead>
        <tbody>
          {users && users.length > 0 ? (
            users.map((user, index) => (
              <tr key={user._id} className={index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'}>
                <td className="p-3 font-bold text-yellow-400">{index + 1}</td>
                <td className="p-3">{user.name}</td>
                <td className="p-3 text-center">
                  <span className="bg-blue-600 px-3 py-1 rounded-full">{user.level}</span>
                </td>
                <td className="p-3 text-right font-bold text-green-400">{user.xp}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="p-6 text-center text-gray-400">
                No users yet
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default LeaderboardTable;
