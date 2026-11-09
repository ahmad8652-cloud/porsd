import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateRankings, calculateStatistics, createInitialContingents } from './ranking.js';
import { Contingent } from '../types/index.js';

test('Rule 4: Ranking prioritizes Gold medals strictly', () => {
  const sample: Contingent[] = [
    { id: '1', name: 'Kontingen B', gold: 4, silver: 20, bronze: 20 },
    { id: '2', name: 'Kontingen A', gold: 5, silver: 0, bronze: 0 },
  ];

  const ranked = calculateRankings(sample);

  // Kontingen A must be Rank 1 because it has 5 Gold, even though B has 40 total medals
  assert.equal(ranked[0].name, 'Kontingen A');
  assert.equal(ranked[0].officialRank, 1);
  assert.equal(ranked[0].total, 5);

  assert.equal(ranked[1].name, 'Kontingen B');
  assert.equal(ranked[1].officialRank, 2);
  assert.equal(ranked[1].total, 44);
});

test('Rule 4: Teams with same Gold count share the same official rank, visual order broken by Silver then Bronze', () => {
  const sample: Contingent[] = [
    { id: '1', name: 'Team Alpha', gold: 3, silver: 1, bronze: 5 },
    { id: '2', name: 'Team Beta', gold: 3, silver: 4, bronze: 0 },
    { id: '3', name: 'Team Gamma', gold: 1, silver: 0, bronze: 0 },
  ];

  const ranked = calculateRankings(sample);

  // Team Beta has higher Silver (4 vs 1), so visually Beta appears first, then Alpha
  assert.equal(ranked[0].name, 'Team Beta');
  assert.equal(ranked[0].officialRank, 1);

  assert.equal(ranked[1].name, 'Team Alpha');
  // Alpha has the same Gold (3) as Beta, so officialRank must be 1 (shared!)
  assert.equal(ranked[1].officialRank, 1);

  // Team Gamma has 1 Gold, positioned 3rd overall -> competition rank 3
  assert.equal(ranked[2].name, 'Team Gamma');
  assert.equal(ranked[2].officialRank, 3);
});

test('Rule 5 & 8: Initial contingents contain exactly 28 schools with correct total statistics', () => {
  const initial = createInitialContingents();
  assert.equal(initial.length, 28, 'Should have 28 contingents as specified');

  const stats = calculateStatistics(initial);
  assert.equal(stats.totalContingents, 28);
  assert.equal(stats.totalAllMedals, stats.totalGold + stats.totalSilver + stats.totalBronze);
  assert.ok(stats.totalGold > 0);
});
