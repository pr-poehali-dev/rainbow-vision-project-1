CREATE TABLE game_state (
  id INTEGER PRIMARY KEY DEFAULT 1,
  time_of_day VARCHAR(10) NOT NULL DEFAULT 'night',
  updated_at TIMESTAMP DEFAULT NOW(),
  CONSTRAINT single_row CHECK (id = 1)
);

INSERT INTO game_state (id, time_of_day) VALUES (1, 'night') ON CONFLICT DO NOTHING;
