  --
  -- ALTER: 1.2.0
  -- DATE: 03.12.2018
  -- FEATURES:
  -- Add payments and limits tables
  --


\set ON_ERROR_STOP on

DO $$
DECLARE previousVersion text = '1.1.14';
DECLARE newVersion text = '1.2.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

    CREATE SCHEMA payments;

  ALTER SCHEMA payments OWNER TO heyspace;

  CREATE TABLE payments.agent (
    id uuid not null,
    code char(20) not null,
    CONSTRAINT agent_id primary KEY (id),
    CONSTRAINT payment_agent_code UNIQUE (code)
  );

  ALTER TABLE payments.agent OWNER TO heyspace;
  
  CREATE TABLE payments.subscription_plan(
    id uuid not null,
    plan_code char(50) not null,
    name char(200) not null,
    cost_per_seat decimal not null,
    billing_period int not null DEFAULT 1,
    is_enabled boolean NOT NULL DEFAULT true,
    CONSTRAINT plan_id primary KEY (id)
  );

  COMMENT ON COLUMN payments.subscription_plan.cost_per_seat IS 'For now currency is dollar with cents';

  ALTER TABLE payments.subscription_plan OWNER TO heyspace;

  CREATE TYPE payments.subscription_status AS ENUM (
    'active',
    'in_trial',
    'non_renewing',
    'cancelled',
    'future'
  );

  ALTER TYPE payments.subscription_status OWNER TO heyspace;

  CREATE TABLE payments.subscription_in_organization(
    id uuid not null,
    agent_subscription_id text,
    agent_id uuid not null,
    plan_id uuid not null,
    next_plan_id uuid,
    seat_count int not null,
    billing_period int not null DEFAULT 1,
    organization_id uuid not null,
    status payments.subscription_status NOT NULL,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    expires_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT pk_subscription_id primary KEY (id),
    CONSTRAINT unique_subscription_id UNIQUE (agent_id, agent_subscription_id, plan_id, organization_id),
    CONSTRAINT fk_subscription_in_organization_agent_id FOREIGN KEY (agent_id) REFERENCES payments.agent(id) ON UPDATE CASCADE,
    CONSTRAINT fk_subscription_in_organization_plan_id FOREIGN KEY (plan_id) REFERENCES payments.subscription_plan(id) ON UPDATE CASCADE,
    CONSTRAINT fk_subscription_in_organization_organization_id FOREIGN KEY (organization_id) REFERENCES core.organization(id) ON UPDATE CASCADE
  );

  ALTER TABLE payments.subscription_in_organization OWNER TO heyspace;

  CREATE TABLE payments.payment(
    id uuid not null,
    agent_payment_id text,
    agent_id uuid not null,
    user_id uuid not null,
    plan_id uuid not null,
    organization_id uuid not null,
    created_at timestamp with time zone,
    seat_count int not null,
    payment_url text not null,
    expires_at timestamp with time zone,
    CONSTRAINT pament_id primary KEY (id),
    CONSTRAINT unique_payment_id UNIQUE (agent_id, agent_payment_id, plan_id, organization_id, user_id),
    CONSTRAINT fk_payment_agent_id FOREIGN KEY (agent_id) REFERENCES payments.agent(id) ON UPDATE CASCADE,
    CONSTRAINT fk_payment_user_id FOREIGN KEY (user_id) REFERENCES core.user(id) ON UPDATE CASCADE,
    CONSTRAINT fk_payment_plan_id FOREIGN KEY (plan_id) REFERENCES payments.subscription_plan(id) ON UPDATE CASCADE,
    CONSTRAINT fk_payment_organization_id FOREIGN KEY (organization_id) REFERENCES core.organization(id) ON UPDATE CASCADE
  );

  ALTER TABLE payments.payment OWNER TO heyspace;

  INSERT INTO payments.agent (id, code) VALUES('a77666c8-89c6-453f-bf53-ac6c13e3b952', 'chargebee');

  INSERT INTO payments.subscription_plan (id, plan_code, "name", cost_per_seat, is_enabled, billing_period) 
    VALUES('6d79f0b0-3b2d-4a15-8dc4-e5a2686360d9', 'heyspace-free', 'Free', 0, true, 1);
  INSERT INTO payments.subscription_plan (id, plan_code, "name", cost_per_seat, is_enabled, billing_period)
    VALUES('20b177ab-7046-4aa7-bc7d-7c8b9f0c3e29', 'heyspace-premium-monthly', 'Premium', 5, true, 1);


--- Subscription plan
DROP TRIGGER IF EXISTS watched_subscription_plan_trigger
ON payments.subscription_plan;
CREATE TRIGGER watched_subscription_plan_trigger
  AFTER UPDATE OR DELETE OR INSERT
  ON payments.subscription_plan
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id');

--- Subscription in organization
DROP TRIGGER IF EXISTS watched_subscription_in_organization_trigger
ON payments.subscription_in_organization;
CREATE TRIGGER watched_subscription_in_organization_trigger
  AFTER UPDATE OR DELETE OR INSERT
  ON payments.subscription_in_organization
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id', 'organization_id');

--- Payment
DROP TRIGGER IF EXISTS watched_payment_trigger
ON payments.payment;
CREATE TRIGGER watched_payment_trigger
  AFTER UPDATE OR DELETE OR INSERT
  ON payments.payment
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id');

  ALTER TABLE "messages".file ADD COLUMN size int NOT NULL DEFAULT 0;

  CREATE TABLE "payments".plan_feature(
    plan_id uuid NOT NULL,
    code text NOT NULL,
    "value" jsonb NOT NULL,
    CONSTRAINT plan_feature_pk primary KEY (plan_id, code),
    CONSTRAINT plan_feature_plan_id_fk FOREIGN KEY (plan_id) REFERENCES "payments".subscription_plan(id)
  );

  ALTER TABLE "payments".plan_feature OWNER TO heyspace;

  -- Plan features

  -- free plan workspace file storage 10gb
  INSERT INTO "payments".plan_feature (plan_id, code, "value")
    VALUES('6d79f0b0-3b2d-4a15-8dc4-e5a2686360d9', 'total-files-size', '{"isAllowed":true,"value":10737418240}');

  -- free plan max file size 5mb
  INSERT INTO "payments".plan_feature (plan_id, code, "value")
    VALUES('6d79f0b0-3b2d-4a15-8dc4-e5a2686360d9', 'single-file-size', '{"isAllowed":true,"value":5242880}');

  -- paid plan (monthly) max file size 100mb
  INSERT INTO "payments".plan_feature (plan_id, code, "value")
    VALUES('20b177ab-7046-4aa7-bc7d-7c8b9f0c3e29', 'single-file-size', '{"isAllowed":true,"value":104857600}');

  -- paid plan (monthly) workspace file storage UNLIMITED
  INSERT INTO "payments".plan_feature (plan_id, code, "value")
      VALUES('20b177ab-7046-4aa7-bc7d-7c8b9f0c3e29', 'total-files-size', '{"isAllowed":true, "isUnlimited":true}');

  CREATE TABLE "payments".subscription_feature(
    subscription_id uuid NOT NULL,
    code text NOT NULL,
    "value" jsonb NOT NULL,
    CONSTRAINT subscription_feature_pk primary KEY (subscription_id, code),
    CONSTRAINT subscription_feature_subscription_id_fk FOREIGN KEY (subscription_id) REFERENCES "payments".subscription_in_organization(id)
  );

  ALTER TABLE "payments".subscription_feature OWNER TO heyspace;

  CREATE TYPE "payments".subscription_cancellation_status AS ENUM (
    'pending',
    'completed',
    'removed'
  );

  CREATE TABLE "payments".subscription_cancellation_in_organization(
    subscription_id uuid NOT NULL,
    organization_id uuid NOT NULL,
    status "payments".subscription_cancellation_status NOT NULL,
    CONSTRAINT pk_subscription_cancellation_in_organization PRIMARY KEY (subscription_id, organization_id),
    CONSTRAINT fk_subscription_cancellation_in_organization_organization_id FOREIGN KEY (organization_id) REFERENCES core.organization(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT fk_subscription_cancellation_in_organization_subscription_id FOREIGN KEY (subscription_id) REFERENCES "payments".subscription_in_organization(id) ON UPDATE CASCADE ON DELETE CASCADE
  );

  ALTER TABLE "payments".subscription_cancellation_in_organization OWNER TO heyspace;

  --- Subscription in organization cancellation status
  DROP TRIGGER IF EXISTS watched_subscription_cancellation_in_organization_trigger
  ON "payments".subscription_cancellation_in_organization;
  CREATE TRIGGER watched_subscription_cancellation_in_organization_trigger
    AFTER UPDATE OR DELETE OR INSERT
    ON "payments".subscription_cancellation_in_organization
    FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('subscription_id', 'organization_id');


  CREATE OR replace function payments.insert_unlimited_subscriptions(agent_id uuid, unlimited_plan_id uuid)
  RETURNS integer as $subProcedure$ 
  DECLARE 
    r record;
    users_count integer;
    granted_seat_count integer;
  begin
    IF agent_id IS NULL
    THEN
      RAISE EXCEPTION 'agent_id is not defined';
    END IF;


    RAISE NOTICE 'CREATING UNLIMITED PRO SUBSCRIPTIONS...';
    for r in 
      (select * from core.organization as o
      left join payments.subscription_in_organization as sio 
      on o.id = sio.organization_id
      where sio.id is null)
    loop
      select count(*) into users_count from core.user_in_organization as uio
      join core."user" as u
      on uio.user_id = u.id
      where uio.organization_id = r.id
      and u.is_bot = false;

      granted_seat_count := users_count + 5;
    
      raise notice 'ORGANIZATION % has % users without bot', r.name, users_count;
    
      raise notice 'CREATING SUBSCRIPTION FOR WS: % % for % seats...', r.id, r.name, granted_seat_count;
      
      insert into payments.subscription_in_organization (id, agent_id, plan_id, created_at, organization_id, seat_count, status)
      values (uuid_generate_v4(), agent_id, unlimited_plan_id, current_timestamp, r.id, granted_seat_count, 'active');
    end loop;
    RAISE NOTICE 'DONE CREATING UNLIMITED PRO SUBSCRIPTIONS.';
    return 1;
  end;
  $subProcedure$ LANGUAGE plpgsql;

  ALTER FUNCTION payments.insert_unlimited_subscriptions(agent_id uuid, unlimited_plan_id uuid) OWNER TO heyspace;

  COMMENT ON FUNCTION payments.insert_unlimited_subscriptions(agent_id uuid, unlimited_plan_id uuid) IS 'Inserts subscription_in_organization records for workspaces that has no subscriptions. Inserted subscription is Premium and free forever with workspace users count + 5. Increasing number of seatCount will take user to checkout.'; 

  CREATE OR REPLACE VIEW stats.trial_subscriptions
  AS SELECT count(*) AS trial_subscriptions
    FROM payments.subscription_in_organization sio
    WHERE sio.agent_subscription_id IS NOT NULL AND sio.status = 'in_trial'::payments.subscription_status;

  ALTER VIEW stats.trial_subscriptions OWNER TO heyspace;

  CREATE OR REPLACE VIEW stats.active_subscriptions
  AS SELECT count(*) AS active_subscriptions
    FROM payments.subscription_in_organization sio
    WHERE sio.agent_subscription_id IS NOT NULL AND sio.status = 'active'::payments.subscription_status AND sio.expires_at IS NOT NULL;

   ALTER VIEW stats.active_subscriptions OWNER TO heyspace;
  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $$;
