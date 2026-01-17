
--
-- ALTER: 1.32.0
-- DATE: 2020-06-02
-- FEATURES:
-- Add app_platform dict
-- Add frontend app version table (manually updated after each deploy)
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.31.0';
  newVersion text = '1.32.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  PERFORM dictionaries.create_dict('app_platform', 'text');

  insert into dictionaries.app_platform (value, label) VALUES ('web', 'Web');

  CREATE TABLE core.app_version
  (
      version_code character varying(100) NOT NULL,
      deployed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
      app_platform_id UUID NOT NULL,
      CONSTRAINT app_version_code_platform_pkey PRIMARY KEY (version_code, app_platform_id),
      CONSTRAINT app_version_app_platform_fk  FOREIGN KEY (app_platform_id) REFERENCES dictionaries.app_platform(id)
  );

  ALTER TABLE core.app_version
      OWNER to heyspace;

  DROP TRIGGER IF EXISTS watched_app_version_table_trigger
  ON core.app_version;
  CREATE TRIGGER watched_app_version_table_trigger
    AFTER INSERT
    ON core.app_version
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('version_code', 'app_platform_id');

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
