
--
-- ALTER: 1.8.0
-- DATE: 2019-04-09
-- FEATURES:
-- *  add user_status table
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.7.0';
  newVersion text = '1.8.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --
  create table core.user_status (
    id uuid NOT NULL
      DEFAULT uuid_generate_v4()
      CONSTRAINT user_status_id_pk PRIMARY KEY,
    user_id uuid NOT NULL 
      CONSTRAINT core_user_id_fk REFERENCES core.user(id),
    organization_id uuid NOT NULL
      CONSTRAINT core_organization_id_fk REFERENCES core.organization(id),
    title text,
    emoji_code VARCHAR(50),
    reset_at timestamp with time zone,

    CONSTRAINT user_status_uniq UNIQUE (user_id, organization_id)
  );

  alter table core.user_status OWNER TO heyspace;

  DROP TRIGGER IF EXISTS watch_core_user_status_table_trigger
  ON core.user_status;
  CREATE TRIGGER watch_core_user_status_table_trigger
    AFTER INSERT or UPDATE or DELETE
    ON core.user_status
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id','organization_id');
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
