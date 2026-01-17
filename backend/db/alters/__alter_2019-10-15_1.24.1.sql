
--
-- ALTER: 1.24.1
-- DATE: 2019-10-15
-- FEATURES:
-- Change char to varchar in agent code
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.24.0';
  newVersion text = '1.24.1';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  ALTER TABLE payments.agent ALTER COLUMN code TYPE varchar(20);

  ALTER TABLE payments.subscription_in_organization ADD COLUMN next_billing_amount decimal;

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
