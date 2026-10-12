import { useState } from 'react';
import type { MatchSettings } from '../api/contracts';
import { useHistory, useRanking } from '../api/queries';
import { formatSeconds } from './format';
import { END_REASON_LABEL } from './labels';
import { Pagination } from './Pagination';

type Tab = 'ranking' | 'history';

interface LeaderboardTabsProps {
  playerId: string;
  settings: MatchSettings;
}

export function LeaderboardTabs({ playerId, settings }: LeaderboardTabsProps) {
  const [tab, setTab] = useState<Tab>('ranking');

  return (
    <section className="menu__panel">
      <div className="tabs" role="tablist" aria-label="Leaderboards">
        <button
          type="button"
          role="tab"
          id="tab-ranking"
          aria-selected={tab === 'ranking'}
          aria-controls="panel-ranking"
          onClick={() => setTab('ranking')}
        >
          Ranking
        </button>
        <button
          type="button"
          role="tab"
          id="tab-history"
          aria-selected={tab === 'history'}
          aria-controls="panel-history"
          onClick={() => setTab('history')}
        >
          Match History
        </button>
      </div>
      <div role="tabpanel" id={`panel-${tab}`} aria-labelledby={`tab-${tab}`}>
        {tab === 'ranking' ? (
          <RankingPanel playerId={playerId} settings={settings} />
        ) : (
          <HistoryPanel playerId={playerId} />
        )}
      </div>
    </section>
  );
}

function RankingPanel({ playerId, settings }: LeaderboardTabsProps) {
  const [page, setPage] = useState(1);
  const query = useRanking(page, settings);

  if (query.isPending) return <p role="status">Loading ranking…</p>;
  if (query.isError) {
    return (
      <div role="alert">
        <p>Could not load the ranking.</p>
        <button type="button" onClick={() => void query.refetch()}>
          Try again
        </button>
      </div>
    );
  }

  const data = query.data;
  return (
    <>
      <p className="tabs__caption">
        {settings.durationSeconds} s matches, enemies every {settings.spawnIntervalSeconds} s
        {query.isFetching ? ' · Updating…' : ''}
      </p>
      {data.totalItems === 0 ? (
        <p>No matches with these settings yet.</p>
      ) : (
        <>
          <table className="board">
            <thead>
              <tr>
                <th scope="col">#</th>
                <th scope="col">Captain</th>
                <th scope="col">Score</th>
                <th scope="col">Time</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((entry) => (
                <tr
                  key={entry.matchId}
                  className={entry.playerId === playerId ? 'board__mine' : undefined}
                >
                  <td>{entry.rank}</td>
                  <td>{entry.playerName}</td>
                  <td>{entry.score}</td>
                  <td>{formatSeconds(entry.durationSeconds)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
        </>
      )}
    </>
  );
}

function HistoryPanel({ playerId }: { playerId: string }) {
  const [page, setPage] = useState(1);
  const query = useHistory(playerId, page);

  if (query.isPending) return <p role="status">Loading match history…</p>;
  if (query.isError) {
    return (
      <div role="alert">
        <p>Could not load your match history.</p>
        <button type="button" onClick={() => void query.refetch()}>
          Try again
        </button>
      </div>
    );
  }

  const data = query.data;
  if (data.totalItems === 0) return <p>No matches played yet.</p>;

  return (
    <>
      {query.isFetching && <p className="tabs__caption">Updating…</p>}
      <table className="board">
        <thead>
          <tr>
            <th scope="col">Date</th>
            <th scope="col">Score</th>
            <th scope="col">Time</th>
            <th scope="col">Result</th>
          </tr>
        </thead>
        <tbody>
          {data.items.map((match) => (
            <tr key={match.matchId}>
              <td>{new Date(match.playedAt).toLocaleString('en-GB')}</td>
              <td>{match.score}</td>
              <td>{formatSeconds(match.durationSeconds)}</td>
              <td>{END_REASON_LABEL[match.endReason]}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
    </>
  );
}