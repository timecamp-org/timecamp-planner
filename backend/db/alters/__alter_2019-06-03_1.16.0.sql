
--
-- ALTER: 1.16.0
-- DATE: 2019-06-03
-- FEATURES:
-- add export board feature to premium plan
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.15.0';
  newVersion text = '1.16.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  insert into payments.plan_feature(plan_id, code, value)
    values ('20b177ab-7046-4aa7-bc7d-7c8b9f0c3e29', 'export-board-to-csv', '{ "isAllowed": true}'),
    ('6d79f0b0-3b2d-4a15-8dc4-e5a2686360d9', 'export-board-to-csv', '{ "isAllowed": false}');

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
