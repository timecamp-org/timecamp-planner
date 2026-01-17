
--
-- ALTER: 1.28.0
-- DATE: 2020-02-06
-- FEATURES:
-- Add yearly plan
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.27.0';
  newVersion text = '1.28.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  INSERT INTO payments.subscription_plan (id, plan_code, "name", cost_per_seat, is_enabled, billing_period)
    VALUES(uuid_generate_v4(), 'heyspace-premium-yearly', 'Premium', 45, true, 12);

  --
  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
