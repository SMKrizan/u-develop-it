-- will reset tables every time schema is run, but still possible to run seeds file multiple times, resulting in duplicate sets of values, if not reset in between
DROP TABLE IF EXISTS parties;
DROP TABLE IF EXISTS candidates;
DROP TABLE IF EXISTS voters;
DROP TABLE IF EXISTS votes;

CREATE TABLE parties (
  id INTEGER PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  description TEXT
);

CREATE TABLE candidates (
  id INTEGER PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  industry_connected BOOLEAN NOT NULL,
  party_id INTEGER UNSIGNED,
  -- establishes party_id as foreign key to candidates table
  CONSTRAINT fk_party FOREIGN KEY (party_id) REFERENCES parties(id) ON DELETE SET NULL
);

CREATE TABLE voters (
  id INTEGER PRIMARY KEY,
  first_name VARCHAR(30) NOT NULL,
  last_name VARCHAR(30) NOT NULL,
  email VARCHAR(50) NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE votes (
  id INTEGER PRIMARY KEY,
  voter_id INTEGER UNSIGNED NOT NULL,
  candidate_id INTEGER UNSIGNED NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  -- allows one vote per voter
  CONSTRAINT uc_voter UNIQUE (voter_id),
  -- vote is removed if voter is removed from database
  CONSTRAINT fk_voter FOREIGN KEY (voter_id) REFERENCES voters(id) ON DELETE CASCADE,
  -- vote is removed if candidate is removed from database
  CONSTRAINT fk_candidate FOREIGN KEY (candidate_id) REFERENCES candidates(id) ON DELETE CASCADE
);
