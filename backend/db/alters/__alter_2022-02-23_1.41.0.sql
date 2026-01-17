
--
-- ALTER: 1.41.0
-- DATE: 2022-02-23
-- FEATURES:
-- add kanban limits extension
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.40.0';
  newVersion text = '1.41.0';
  kanban_limits_id uuid = uuid_generate_v4();
  kanban_limits_list_relation_id uuid = uuid_generate_v4();
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

  INSERT INTO extensions.extension(id, namespace, name, description, thumbnail_url, type, is_in_marketplace)
   VALUES (kanban_limits_id, 'kanban-limits', 'Kanban limits', 'TODO', '', 'internal', false);

  INSERT INTO extensions.custom_field(extension_id, name, target_type)
  VALUES
         (kanban_limits_id, 'kanbanLimitsEnabled', 'project'),
         (kanban_limits_id, 'enabledStatus', 'organization')
  ;

  INSERT INTO extensions.custom_relation(id, extension_id, name)
  VALUES 
         (kanban_limits_list_relation_id, kanban_limits_id, 'cardsLimit')
  ;

  INSERT INTO extensions.custom_relation_field(relation_id, name, reference_table, is_pk)
  VALUES 
         (kanban_limits_list_relation_id, 'task_list_id', 'project-management.task_list', true),
         (kanban_limits_list_relation_id, 'cards_limit', null, false)
  ;

  select id from payments.subscription_plan where plan_code = 'heyspace-free' into heyspace_free_plan_id;
  select id from payments.subscription_plan where plan_code = 'heyspace-premium-monthly' into heyspace_premium_monthly_plan_id;
  select id from payments.subscription_plan where plan_code = 'heyspace-premium-yearly' into heyspace_premium_yearly_plan_id;

  INSERT INTO payments.extension_config_for_subscription_plan 
    (id, subscription_plan_id, extension_id, is_enabled)
    VALUES 
    (uuid_generate_v4(), heyspace_free_plan_id, kanban_limits_id, false),
    (uuid_generate_v4(), heyspace_premium_monthly_plan_id, kanban_limits_id, true),
    (uuid_generate_v4(), heyspace_premium_yearly_plan_id, kanban_limits_id, true);

      -- table name in format <namespace>_<some-relation-name>
  CREATE TABLE "extension-data"."kanban-limits_cards_limit" (
    id UUID NOT NULL
      DEFAULT uuid_generate_v4()
      CONSTRAINT "kanban-limits_cards_pk" PRIMARY KEY,
    task_list_id UUID NOT NULL
      CONSTRAINT "kanban-limits_cards_task_list_id_fk" REFERENCES "project-management".task_list(id),
     "cards_limit" int,
     created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT "extension-data_task-kanban-limits_cards_task_list_id_uniq" UNIQUE (task_list_id)
  );

  ALTER TABLE "extension-data"."kanban-limits_cards_limit" OWNER TO heyspace;
  
 --- FEED kanban-limits_cards_limit
  DROP TRIGGER IF EXISTS watched_kanban_limits_cards_limit_table_trigger
  ON "extension-data"."kanban-limits_cards_limit";
  CREATE TRIGGER watched_kanban_limits_cards_limit_table_trigger
    AFTER INSERT OR UPDATE OR DELETE
    ON "extension-data"."kanban-limits_cards_limit"
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('task_list_id', 'cards_limit');


  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
