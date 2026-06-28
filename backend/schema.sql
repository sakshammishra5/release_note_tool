CREATE TABLE releases (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  date TIMESTAMP NOT NULL,
  additional_info TEXT,
  steps_completed INTEGER[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW()
);