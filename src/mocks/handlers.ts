import { delay, http, HttpResponse } from 'msw';
import { getScenario } from './scenarios';
import { allMatches, compareRanking, findMatch, insertMatch, paginate } from './db';
import { PAGE_SIZE, type MatchRecord } from '../api/contracts';
const API = `${import.meta.env.BASE_URL}api`;

function readNumber(url: URL, key: string, fallback: number): number {
  const value = Number(url.searchParams.get(key));
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function serverError() {
  return HttpResponse.json({ message: 'Internal server error' }, { status: 500 });
}

export const handlers = [
  http.get(`${API}/ranking`, async ({ request }) => {
    const scenario = getScenario();
    if (scenario === 'slow') await delay(2000);
    if (scenario === 'server-error') return serverError();

    const url = new URL(request.url);
    const duration = readNumber(url, 'durationSeconds', 0);
    const spawn = readNumber(url, 'spawnIntervalSeconds', 0);
    const matches =
      scenario === 'empty'
        ? []
        : allMatches()
            .filter(
              (match) =>
                match.settings.durationSeconds === duration &&
                match.settings.spawnIntervalSeconds === spawn,
            )
            .sort(compareRanking);

    const ranked = matches.map((match, index) => ({ ...match, rank: index + 1 }));
    return HttpResponse.json(
      paginate(ranked, readNumber(url, 'page', 1), readNumber(url, 'pageSize', PAGE_SIZE)),
    );
  }),

  http.get(`${API}/players/:playerId/matches`, async ({ request, params }) => {
    const scenario = getScenario();
    if (scenario === 'slow') await delay(2000);
    if (scenario === 'server-error') return serverError();

    const url = new URL(request.url);
    const playerId = String(params.playerId);
    const matches =
      scenario === 'empty'
        ? []
        : allMatches()
            .filter((match) => match.playerId === playerId)
            .sort((a, b) => (a.playedAt < b.playedAt ? 1 : -1));

    return HttpResponse.json(
      paginate(matches, readNumber(url, 'page', 1), readNumber(url, 'pageSize', PAGE_SIZE)),
    );
  }),

  http.put(`${API}/matches/:matchId`, async ({ request, params }) => {
    const scenario = getScenario();
    if (scenario === 'slow') await delay(2000);
    if (scenario === 'server-error') return serverError();

    const existing = findMatch(String(params.matchId));
    if (existing) return HttpResponse.json(existing, { status: 200 });

    const record = (await request.json()) as MatchRecord;
    insertMatch(record);
    if (scenario === 'register-timeout') await delay(8000);
    return HttpResponse.json(record, { status: 201 });
  }),
];