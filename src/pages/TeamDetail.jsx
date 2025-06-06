// src/pages/TeamDetail.jsx
import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getTeamById } from '../api';

export default function TeamDetail() {
  const { id } = useParams();
  const [teamData, setTeamData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getTeamById(id)
      .then(res => setTeamData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading team...</p>;
  if (!teamData) return <p>Team not found.</p>;

  const { team, roster, matches } = teamData;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-2">{team.name} ({team.year})</h1>
      <section className="mb-6">
        <h2 className="text-xl mb-2">Roster</h2>
        <ul className="list-disc list-inside">
          {roster.map(player => (
            <li key={player.id}>
              <Link to={`/players/${player.id}`} className="text-blue-600 hover:underline">
                {player.full_name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-xl mb-2">Matches</h2>
        {matches.length === 0 ? (
          <p>No matches recorded yet.</p>
        ) : (
          <table className="min-w-full border">
            <thead>
              <tr>
                <th className="border px-2 py-1">Date</th>
                <th className="border px-2 py-1">Opponent</th>
                <th className="border px-2 py-1">Result</th>
                <th className="border px-2 py-1">Details</th>
              </tr>
            </thead>
            <tbody>
              {matches.map(m => (
                <tr key={m.id}>
                  <td className="border px-2 py-1">{new Date(m.match_date).toLocaleDateString()}</td>
                  <td className="border px-2 py-1">{m.opponent}</td>
                  <td className="border px-2 py-1">{m.result}</td>
                  <td className="border px-2 py-1">
                    {JSON.stringify(m.details)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
