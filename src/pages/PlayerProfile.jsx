// src/pages/PlayerProfile.jsx
import { useParams, Link } from 'react-router-dom';
import usePlayer from '../hooks/usePlayer.js';
import { profileIconUrl } from '../lib/riotApi.js';

export default function PlayerProfile() {
  const { slug } = useParams();
  const { data, loading, error } = usePlayer(slug);

  if (loading) return <div className="p-4">Loading…</div>;
  if (error)   return <div className="p-4 text-red-600">{error.message}</div>;
  if (!data)   return <div className="p-4">Player not found.</div>;

  const {
    display_name,
    bio,
    fav_champs,
    twitch_url,
    opgg_url,
    game_name,
    tag_line,
    profile_icon_id,
    tier,
    division,
    lp,
    wins,
    losses
  } = data;

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-6">
      <header className="flex items-center space-x-4">
        <img
          src={profileIconUrl(profile_icon_id || 29)}
          className="w-24 h-24 rounded-full border"
          alt="profile icon"
        />
        <div>
          <h1 className="text-3xl font-bold">{display_name}</h1>
          <p className="text-gray-500">{game_name}#{tag_line}</p>
        </div>
      </header>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">Ranked Solo</h2>
        {tier ? (
          <p className="text-gray-800">
            {tier} {division} – {lp} LP ({wins}W / {losses}L)
          </p>
        ) : (
          <p className="text-gray-500">Unranked</p>
        )}
      </section>

      {bio && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Bio</h2>
          <p>{bio}</p>
        </section>
      )}

      {fav_champs?.length && (
        <section className="space-y-2">
          <h2 className="text-xl font-semibold">Favorite Champions</h2>
          <ul className="list-disc list-inside">
            {fav_champs.map(ch => <li key={ch}>{ch}</li>)}
          </ul>
        </section>
      )}

      <section className="flex space-x-4">
        {twitch_url && <a href={twitch_url} className="text-blue-600">Twitch</a>}
        {opgg_url   && <a href={opgg_url}   className="text-blue-600">OP.GG</a>}
      </section>

      <Link to="/" className="text-blue-600">&larr; Back to home</Link>
    </div>
  );
}
