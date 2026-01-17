
--
-- ALTER: 1.36.3
-- DATE: 2020-08-24
-- FEATURES:
-- Add unique index to subscriptions
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.36.2';
  newVersion text = '1.36.3';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --


  CREATE UNIQUE INDEX unique_agent_id_plan_id_organization_id
    ON payments.subscription_in_organization USING btree
    (agent_id, plan_id, organization_id);

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
