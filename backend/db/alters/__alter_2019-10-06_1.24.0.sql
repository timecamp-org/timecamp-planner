
--
-- ALTER: 1.24.0
-- DATE: 2019-10.06
-- FEATURES:
-- Add extension for subscription plan config
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.23.0';
  newVersion text = '1.24.0';
  heyspace_free_plan_id UUID;
  heyspace_premium_plan_id UUID;
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

  --
  -- START ALTER (insert statements below)
  --

  CREATE TABLE payments.extension_config_for_subscription_plan(
    id UUID NOT NULL 
      DEFAULT uuid_generate_v4()
      CONSTRAINT extension_config_id_pk PRIMARY KEY,
    subscription_plan_id UUID NOT NULL
      CONSTRAINT payment_subscription_plan_id_fk REFERENCES payments.subscription_plan(id),
    extension_id UUID NOT NULL
      CONSTRAINT etensions_extension_id_fk REFERENCES extensions.extension(id),
    is_enabled boolean NOT NULL DEFAULT false,
    CONSTRAINT extension_config_uniq UNIQUE (subscription_plan_id, extension_id)
  );

  ALTER TABLE payments.extension_config_for_subscription_plan owner to heyspace;


  select id from payments.subscription_plan where plan_code = 'heyspace-free' into heyspace_free_plan_id;
  select id from payments.subscription_plan where plan_code = 'heyspace-premium-monthly' into heyspace_premium_plan_id;

  select id from extensions.extension where namespace = 'agile' into ext_agile_id;
  select id from extensions.extension where namespace = 'task-voting' into ext_voting_id;
  select id from extensions.extension where namespace = 'calendar-sync' into ext_calendar_sync_id;
  select id from extensions.extension where namespace = 'trello-data-import' into ext_trello_id;
  select id from extensions.extension where namespace = 'hangouts-link' into ext_hangouts_id;
  select id from extensions.extension where namespace = 'chat-with-me' into ext_chat_with_me_id;
  select id from extensions.extension where namespace = 'task-recurrence' into ext_task_recurrence;

  INSERT INTO payments.extension_config_for_subscription_plan 
    (id, subscription_plan_id, extension_id, is_enabled)
    VALUES 
    (uuid_generate_v4(), heyspace_free_plan_id, ext_agile_id, false),
    (uuid_generate_v4(), heyspace_free_plan_id, ext_voting_id, true),
    (uuid_generate_v4(), heyspace_free_plan_id, ext_calendar_sync_id, false),
    (uuid_generate_v4(), heyspace_free_plan_id, ext_trello_id, true),
    (uuid_generate_v4(), heyspace_free_plan_id, ext_hangouts_id, true),
    (uuid_generate_v4(), heyspace_free_plan_id, ext_chat_with_me_id, true),
    (uuid_generate_v4(), heyspace_free_plan_id, ext_task_recurrence, false),

    (uuid_generate_v4(), heyspace_premium_plan_id, ext_agile_id, true),
    (uuid_generate_v4(), heyspace_premium_plan_id, ext_voting_id, true),
    (uuid_generate_v4(), heyspace_premium_plan_id, ext_calendar_sync_id, true),
    (uuid_generate_v4(), heyspace_premium_plan_id, ext_trello_id, true),
    (uuid_generate_v4(), heyspace_premium_plan_id, ext_hangouts_id, true),
    (uuid_generate_v4(), heyspace_premium_plan_id, ext_chat_with_me_id, true),
    (uuid_generate_v4(), heyspace_premium_plan_id, ext_task_recurrence, true);

  --
  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
