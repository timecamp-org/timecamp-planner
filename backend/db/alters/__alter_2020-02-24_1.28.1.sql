
--
-- ALTER: 1.28.1
-- DATE: 2020-02-24
-- FEATURES:
-- Add annual plan feature
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.28.0';
  newVersion text = '1.28.1';
  heyspace_premium_yearly_plan_id UUID;
  ext_agile_id UUID;
  ext_voting_id UUID;
  ext_calendar_sync_id UUID;
  ext_trello_id UUID;
  ext_hangouts_id UUID;
  ext_chat_with_me_id UUID;
  ext_task_recurrence UUID;
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  select id from payments.subscription_plan where plan_code = 'heyspace-premium-yearly' into heyspace_premium_yearly_plan_id;

  select id from extensions.extension where namespace = 'agile' into ext_agile_id;
  select id from extensions.extension where namespace = 'task-voting' into ext_voting_id;
  select id from extensions.extension where namespace = 'calendar-sync' into ext_calendar_sync_id;
  select id from extensions.extension where namespace = 'trello-data-import' into ext_trello_id;
  select id from extensions.extension where namespace = 'hangouts-link' into ext_hangouts_id;
  select id from extensions.extension where namespace = 'chat-with-me' into ext_chat_with_me_id;
  select id from extensions.extension where namespace = 'task-recurrence' into ext_task_recurrence;

  --
  -- START ALTER (insert statements below)
  --
  INSERT INTO payments.extension_config_for_subscription_plan 
    (id, subscription_plan_id, extension_id, is_enabled)
    VALUES 
    (uuid_generate_v4(), heyspace_premium_yearly_plan_id, ext_agile_id, true),
    (uuid_generate_v4(), heyspace_premium_yearly_plan_id, ext_voting_id, true),
    (uuid_generate_v4(), heyspace_premium_yearly_plan_id, ext_calendar_sync_id, true),
    (uuid_generate_v4(), heyspace_premium_yearly_plan_id, ext_trello_id, true),
    (uuid_generate_v4(), heyspace_premium_yearly_plan_id, ext_hangouts_id, true),
    (uuid_generate_v4(), heyspace_premium_yearly_plan_id, ext_chat_with_me_id, true),
    (uuid_generate_v4(), heyspace_premium_yearly_plan_id, ext_task_recurrence, true);


  INSERT INTO payments.plan_feature
  (plan_id, code, value)
  VALUES(heyspace_premium_yearly_plan_id, 'single-file-size', '{"value": 104857600, "isAllowed": true}');
  INSERT INTO payments.plan_feature
  (plan_id, code, value)
  VALUES(heyspace_premium_yearly_plan_id, 'total-files-size', '{"isAllowed": true, "isUnlimited": true}');
  INSERT INTO payments.plan_feature
  (plan_id, code, value)
  VALUES(heyspace_premium_yearly_plan_id, 'export-board-to-csv', '{"isAllowed": true}');
  INSERT INTO payments.plan_feature
  (plan_id, code, value)
  VALUES(heyspace_premium_yearly_plan_id, 'update-checklist-item-assignees', '{"isAllowed": true}');


  --
  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
