
--
-- ALTER: 1.43.1
-- DATE: 2022-11-07
-- FEATURES:
-- add cascading group delete
\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.43.0';
  newVersion text = '1.43.1';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

ALTER TABLE core.user_in_group DROP CONSTRAINT user_in_group_group_id_fk;
ALTER TABLE core.user_in_group ADD CONSTRAINT user_in_group_group_id_fk FOREIGN KEY (group_id) REFERENCES core.group (id) ON UPDATE CASCADE ON DELETE CASCADE;

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
