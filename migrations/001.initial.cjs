// migrations/001_initial.cjs
exports.shorthands = undefined;

exports.up = (pgm) => {
  // Teams table
  pgm.createTable("teams", {
    id: { type: "serial", primaryKey: true },
    name: { type: "text", notNull: true },
    year: { type: "integer", notNull: true },
  });

  // Players table
  pgm.createTable("players", {
    id: { type: "serial", primaryKey: true },
    full_name: { type: "text", notNull: true },
  });

  // Memberships (composite PK)
  pgm.createTable(
    "player_memberships",
    {
      player_id: {
        type: "integer",
        notNull: true,
        references: "players",
        onDelete: "cascade",
      },
      team_id: {
        type: "integer",
        notNull: true,
        references: "teams",
        onDelete: "cascade",
      },
      joined_date: { type: "date" },
      left_date:   { type: "date" },
    }
  );
  // Add composite primary key constraint separately
  pgm.addConstraint("player_memberships", "player_memberships_pkey", {
    primaryKey: ["player_id", "team_id"],
  });

  // Riot accounts
  pgm.createTable("riot_accounts", {
    id: { type: "serial", primaryKey: true },
    player_id: {
      type: "integer",
      notNull: true,
      references: "players",
      onDelete: "cascade",
    },
    game_name: { type: "text", notNull: true },
    tag_line:  { type: "text", notNull: true },
  });

  // Username history
  pgm.createTable("riot_username_history", {
    id: { type: "serial", primaryKey: true },
    account_id: {
      type: "integer",
      notNull: true,
      references: "riot_accounts",
      onDelete: "cascade",
    },
    old_game_name: { type: "text", notNull: true },
    old_tag_line:  { type: "text", notNull: true },
    changed_at:    { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
  });

  // Solo-queue stats
  pgm.createTable("soloqueue_stats", {
    id: { type: "serial", primaryKey: true },
    account_id: {
      type: "integer",
      notNull: true,
      references: "riot_accounts",
      onDelete: "cascade",
    },
    fetched_at: { type: "timestamp", notNull: true, default: pgm.func("current_timestamp") },
    lp:       { type: "integer", notNull: true },
    wins:     { type: "integer", notNull: true },
    losses:   { type: "integer", notNull: true },
  });

  // Tournament matches
  pgm.createTable("tournament_matches", {
    id: { type: "serial", primaryKey: true },
    team_id: {
      type: "integer",
      notNull: true,
      references: "teams",
      onDelete: "cascade",
    },
    opponent:   { type: "text", notNull: true },
    match_date: { type: "date", notNull: true },
    result:     { type: "text", notNull: true },
    details:    { type: "jsonb", notNull: true, default: '{}' },
  });
};

exports.down = (pgm) => {
  pgm.dropTable("tournament_matches");
  pgm.dropTable("soloqueue_stats");
  pgm.dropTable("riot_username_history");
  pgm.dropTable("riot_accounts");
  pgm.dropTable("player_memberships");
  pgm.dropTable("players");
  pgm.dropTable("teams");
};
