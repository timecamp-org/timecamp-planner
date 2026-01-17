
--
-- ALTER: 1.26.0
-- DATE: 2019-12-05
-- FEATURES:
-- Add user in checklist item table
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.25.0';
  newVersion text = '1.26.0';
  heyspace_free_plan_id UUID;
  heyspace_premium_plan_id UUID;
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

  CREATE TABLE "project-management".user_in_checklist_item (
    user_id uuid NOT NULL,
    checklist_item_id uuid NOT NULL,

    CONSTRAINT user_in_checklist_item_pk PRIMARY KEY (user_id, checklist_item_id),
    CONSTRAINT user_in_checklist_item_user_fk FOREIGN KEY (user_id) REFERENCES core.user(id) ON DELETE CASCADE,
    CONSTRAINT user_in_checklist_item_checklist_item_fk FOREIGN KEY (checklist_item_id) REFERENCES "project-management".checklist_item(id) ON DELETE CASCADE
);


  ALTER TABLE "project-management".user_in_checklist_item OWNER TO heyspace;

  CREATE TRIGGER watched_user_in_checklist_item_table_trigger
    AFTER INSERT OR DELETE
    ON "project-management".user_in_checklist_item
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('checklist_item_id');


  -- ADD checklist_item to notifications.container_type enum
  -- 1. rename the enum type you want to change
  alter type notifications.container_type rename to _container_type;
  -- 2. create new type
  create type notifications.container_type as enum (
     'project',
     'task',
     'user',
     'task_list',
     'checklist_item'
  );
  -- 3. rename column(s) which uses our enum type
  alter table notifications.activity rename column container_type to _container_type;
  -- 4. add new column of new type
  alter table notifications.activity add column container_type notifications.container_type;
  -- 5. copy values to the new column
  update notifications.activity set container_type = _container_type::text::notifications.container_type;
  -- 6. remove old column and type
  alter table notifications.activity drop column _container_type;
  drop type notifications._container_type;

  -- Add table for checklist item as activity container

  CREATE TABLE notifications.activity_container_checklist_item (
      activity_id uuid NOT NULL,
      checklist_item_id uuid NOT NULL,

      CONSTRAINT activity_container_checklist_item_pk PRIMARY KEY (activity_id, checklist_item_id),
      CONSTRAINT activity_container_checklist_item_activity_fk FOREIGN KEY (activity_id) REFERENCES notifications.activity(id) ON DELETE CASCADE,
      CONSTRAINT activity_container_checklist_item_checklist_item_fk FOREIGN KEY (checklist_item_id) REFERENCES "project-management".checklist_item(id) ON DELETE CASCADE
  );

  ALTER TABLE notifications.activity_container_checklist_item OWNER TO heyspace;

  select id from payments.subscription_plan where plan_code = 'heyspace-free' into heyspace_free_plan_id;
  select id from payments.subscription_plan where plan_code = 'heyspace-premium-monthly' into heyspace_premium_plan_id;

  INSERT INTO payments.plan_feature
  VALUES (heyspace_free_plan_id, 'update-checklist-item-assignees', '{"isAllowed": false}'),
  (heyspace_premium_plan_id, 'update-checklist-item-assignees', '{"isAllowed": true}');

  --
  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
