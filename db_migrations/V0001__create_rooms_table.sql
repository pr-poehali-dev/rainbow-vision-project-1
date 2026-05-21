CREATE TABLE rooms (
  room_number INTEGER PRIMARY KEY,
  player_nickname VARCHAR(100),
  player_avatar TEXT,
  player_role VARCHAR(50),
  checked_in_at TIMESTAMP DEFAULT NOW()
);
