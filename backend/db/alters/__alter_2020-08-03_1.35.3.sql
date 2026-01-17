
--
-- ALTER: 1.35.3
-- DATE: 2020-08-03
-- FEATURES:
-- added space groups extensions config
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.35.2';
  newVersion text = '1.35.3';
  heyspace_free_plan_id UUID;
  heyspace_premium_monthly_plan_id UUID;
  heyspace_premium_yearly_plan_id UUID;
  ext_project_groups UUID;
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  select id from payments.subscription_plan where plan_code = 'heyspace-free' into heyspace_free_plan_id;
  select id from payments.subscription_plan where plan_code = 'heyspace-premium-monthly' into heyspace_premium_monthly_plan_id;
  select id from payments.subscription_plan where plan_code = 'heyspace-premium-yearly' into heyspace_premium_yearly_plan_id;

  select id from extensions.extension where namespace = 'project-groups-and-order' into ext_project_groups;

  INSERT INTO payments.extension_config_for_subscription_plan 
    (id, subscription_plan_id, extension_id, is_enabled)
    VALUES 
    (uuid_generate_v4(), heyspace_free_plan_id, ext_project_groups, false),
    (uuid_generate_v4(), heyspace_premium_monthly_plan_id, ext_project_groups, true),
    (uuid_generate_v4(), heyspace_premium_yearly_plan_id, ext_project_groups, true);

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
