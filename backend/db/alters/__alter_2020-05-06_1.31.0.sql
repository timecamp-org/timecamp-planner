
--
-- ALTER: 1.31.0
-- DATE: 2020-05-06
-- FEATURES:
-- Add board and chat view types to view_type table
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.30.2';
  newVersion text = '1.31.0';
  boardViewTypeId UUID := uuid_generate_v4();
  chatViewTypeId UUID := uuid_generate_v4();
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  INSERT INTO dictionaries.view_type (id, value, label)
    VALUES (boardViewTypeId, 'board', 'Board');

  INSERT INTO dictionaries.view_type (id, value, label)
    VALUES (chatViewTypeId, 'chat', 'Chat');

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
