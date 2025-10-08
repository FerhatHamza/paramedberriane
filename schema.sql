-- D1 schema for paramedberriane

CREATE TABLE IF NOT EXISTS students (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nin TEXT UNIQUE,
  last_name TEXT,
  first_name TEXT,
  father_name TEXT,
  birth_date TEXT,
  class TEXT,
  wing TEXT
);

CREATE TABLE IF NOT EXISTS attendance (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER,
  date TEXT,
  morning_present INTEGER,
  evening_present INTEGER,
  status TEXT
);

CREATE TABLE IF NOT EXISTS choices (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  student_id INTEGER UNIQUE,
  english INTEGER DEFAULT 0,
  french INTEGER DEFAULT 0,
  spanish INTEGER DEFAULT 0,
  german INTEGER DEFAULT 0,
  math INTEGER DEFAULT 0,
  science INTEGER DEFAULT 0
);
