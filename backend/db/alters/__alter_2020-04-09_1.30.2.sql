
--
-- ALTER: 1.30.2
-- DATE: 2020-04-09
-- FEATURES:
-- Add free plan permission
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.30.1';
  newVersion text = '1.30.2';
  heyspace_free_plan_id UUID;
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  select id from payments.subscription_plan where plan_code = 'heyspace-free' into heyspace_free_plan_id;

  INSERT INTO payments.plan_feature
    (plan_id, code, value)
    VALUES 
    (heyspace_free_plan_id, 'overwatch', '{"isAllowed": false}');

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
