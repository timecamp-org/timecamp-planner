
--
-- ALTER: 1.43.2
-- DATE: 2022-11-10
-- FEATURES:
-- fix groups uniques
\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.43.1';
  newVersion text = '1.43.2';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE core.user_in_group DROP COLUMN user_id;
  ALTER TABLE core.user_in_group ADD COLUMN user_in_organization_id uuid NOT NULL;

  ALTER TABLE core.user_in_group ADD CONSTRAINT fk_user_in_group_user_in_organization_id
        FOREIGN KEY (user_in_organization_id) REFERENCES "core".user_in_organization(id);
  
  ALTER TABLE ONLY core.user_in_group
    ADD CONSTRAINT user_in_group_pk PRIMARY KEY (user_in_organization_id);

  --- FEED user_in_group
  DROP TRIGGER IF EXISTS watched_user_in_group_table_trigger
  ON core.user_in_group;
  CREATE TRIGGER watched_user_in_group_table_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON core.user_in_group
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('user_in_organization_id', 'group_id');

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
