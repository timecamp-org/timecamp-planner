
--
-- ALTER: 1.25.0
-- DATE: 2019-11-20
-- FEATURES:
--  Apps
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.24.1';
  newVersion text = '1.25.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  ALTER TABLE auth.oauth_client ALTER COLUMN id SET DATA TYPE UUID USING (uuid_generate_v4());
  ALTER TABLE auth.oauth_client ALTER COLUMN id SET DEFAULT uuid_generate_v4();
  ALTER TABLE ONLY auth.oauth_client ADD CONSTRAINT oauth_client_id_uniq UNIQUE (id);
  ALTER TABLE auth.oauth_client ALTER COLUMN redirect_uris drop not null;
  --
  -- START ALTER (insert statements below)

  CREATE TABLE extensions.app (
    id UUID NOT NULL
    DEFAULT uuid_generate_v4()
    CONSTRAINT app_id_pk PRIMARY KEY,
    oauth_client_id uuid NOT NULL 
      CONSTRAINT app_oauth_client_id_fk 
      REFERENCES auth.oauth_client (id),
    CONSTRAINT oauth_client_id_uniq UNIQUE (oauth_client_id)
  );

  ALTER TABLE extensions.app OWNER TO heyspace;

  CREATE TYPE extensions.app_role AS ENUM (
    'owner',
    'collaborator'
  );


  ALTER TYPE extensions.app_role OWNER TO heyspace;

  CREATE TABLE extensions.user_in_app (
    app_id uuid NOT NULL 
      CONSTRAINT user_in_app_app_id_fk 
      REFERENCES extensions.app (id)
      ON DELETE CASCADE,
    user_id uuid NOT NULL 
      CONSTRAINT user_in_app_user_id_fk 
      REFERENCES core.user (id)
      ON DELETE CASCADE,
    role extensions.app_role DEFAULT 'collaborator'::extensions.app_role NOT NULL,
    CONSTRAINT user_in_app_pkey PRIMARY KEY (app_id, user_id)
  );

  ALTER TABLE extensions.user_in_app OWNER TO heyspace;

    --- App
  DROP TRIGGER IF EXISTS watched_extension_app_trigger
  ON extensions.app;
  CREATE TRIGGER watched_extension_app_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON extensions.app
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id');

    --- User in app
  DROP TRIGGER IF EXISTS watched_extension_user_in_app_trigger
  ON extensions.user_in_app;
  CREATE TRIGGER watched_extension_user_in_app_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON extensions.user_in_app
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('app_id', 'user_id', 'role');


  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
