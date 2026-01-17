  --
  -- ALTER: 1.45.0
  -- DATE: 09.05.2023
  -- FEATURES: 
  -- implemented TC access_token extension
  

\set ON_ERROR_STOP on

DO $outer$
DECLARE 
  previousVersion text = '1.44.0';
  newVersion text = '1.45.0';
  timecamp_extension_id uuid = uuid_generate_v4();
  heyspace_free_plan_id UUID;
  heyspace_premium_monthly_plan_id UUID;
  heyspace_premium_yearly_plan_id UUID;
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --
  
select id into heyspace_free_plan_id from payments.subscription_plan where plan_code = 'heyspace-free' ;
select id into heyspace_premium_monthly_plan_id from payments.subscription_plan where plan_code = 'heyspace-premium-monthly' ;
select id into heyspace_premium_yearly_plan_id from payments.subscription_plan where plan_code = 'heyspace-premium-yearly';


INSERT INTO extensions.extension (id, namespace, name, type, is_in_marketplace) VALUES (timecamp_extension_id, 'timecamp', 'TimeCamp', 'integration', false);

ALTER TABLE extensions.custom_field ADD COLUMN is_internal BOOLEAN DEFAULT false;

INSERT INTO extensions.custom_field (extension_id, name, target_type, is_internal) VALUES (timecamp_extension_id, 'access_token','user-in-organization', true);

INSERT INTO payments.extension_config_for_subscription_plan (
  subscription_plan_id, extension_id, is_enabled
) VALUES ( heyspace_free_plan_id, timecamp_extension_id, true);

INSERT INTO payments.extension_config_for_subscription_plan (
  subscription_plan_id, extension_id, is_enabled
) VALUES ( heyspace_premium_monthly_plan_id, timecamp_extension_id, true);

INSERT INTO payments.extension_config_for_subscription_plan (
  subscription_plan_id, extension_id, is_enabled
) VALUES ( heyspace_premium_yearly_plan_id, timecamp_extension_id, true);
  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;