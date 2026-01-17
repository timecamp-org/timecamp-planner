  --
  -- ALTER: 1.0.7
  -- DATE: 25.07.2018
  -- FEATURES: 
  -- * added user registration status column
  --

\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '1.0.6';
DECLARE newVersion text = '1.0.7';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  IF NOT EXISTS (
    SELECT 1
    FROM pg_type t
    JOIN pg_namespace n ON n.oid = t.typnamespace
    WHERE n.nspname = 'core' AND t.typname = 'registration_status'
  ) THEN
    CREATE TYPE core.registration_status AS ENUM (
      'pending',
      'registered',
      'verified',
      'not_verified'
    );
  END IF;

  ALTER TYPE core.registration_status OWNER TO heyspace;

  ALTER TABLE core."user"
    ADD COLUMN IF NOT EXISTS registration_status core.registration_status DEFAULT 'pending'::core.registration_status NOT NULL;

  -- UPDATE USERS REGISTER STATUS
  UPDATE core."user" AS u
  SET registration_status = 'registered'::core.registration_status
  FROM auth.oauth_user_binding AS o
  WHERE u.password_hash IS NOT NULL OR o.user_id = u.id;

  -- UPDATE BOTS REGISTER STATUS
  UPDATE core."user" SET registration_status = 'verified'::core.registration_status
  WHERE is_bot;

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;
