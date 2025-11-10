const people = [
  {
    rank: 1,
    user: "0x98719B13e883cBA22D25f10AA1B70bbefB5c849e",
    tasks: 46,
    rewards: 1000,
  },
  {
    rank: 2,
    user: "0x7A0151479C6b9B4851427F354452FDf53DDCD916",
    tasks: 46,
    rewards: 1000,
  },
  {
    rank: 3,
    user: "0x492C69DFE04be4c4B224Ff48AAd2DD10a1433e12",
    tasks: 46,
    rewards: 1000,
  },
  {
    rank: 4,
    user: "0x492C69DFE04be4cBB424Ff48AAd2DD10a1433e12",
    tasks: 46,
    rewards: 1000,
  },
  {
    rank: 5,
    user: "0x492C69DFE0424cBB224Ff48AAd2DD10a1433e12",
    tasks: 46,
    rewards: 1000,
  },
  {
    rank: 6,
    user: "0x492C693FE04be4cBB224Ff48AAd2DD10a1433e12",
    tasks: 46,
    rewards: 1000,
  },
];

export default function LeaderBoardList() {
  return (
    <div className="px-4 sm:px-3 lg:px-4">
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm outline-1 outline-black/5 sm:rounded-lg">
              <table className="relative min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Rank
                    </th>
                    <th
                      scope="col"
                      className="py-3.5 pr-3 pl-4 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                    >
                      Tasks
                    </th>
                    <th
                      scope="col"
                      className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900"
                    >
                      Rewards
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {people.map((person) => (
                    <tr key={person.user}>
                      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                        {person.rank}
                      </td>
                      <td className="py-4 pr-3 pl-4 text-sm font-medium whitespace-nowrap text-gray-900 sm:pl-6">
                        {person.user.slice(0, 6)}...{person.user.slice(-6)}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500">
                        {person.tasks}
                      </td>
                      <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-500 text-right">
                        {person.rewards}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
