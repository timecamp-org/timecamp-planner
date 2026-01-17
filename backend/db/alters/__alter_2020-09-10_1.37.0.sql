
--
-- ALTER: 1.37.0
-- DATE: 2020-09-10
-- FEATURES:
-- Add insert_trials function
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.36.3';
  newVersion text = '1.37.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --


CREATE OR REPLACE FUNCTION payments.insert_trials(agent_id uuid, trial_plan_id uuid, seat_count integer)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$ 
  DECLARE 
    r record;
  begin
    IF agent_id IS NULL
    THEN
      RAISE EXCEPTION 'agent_id is not defined';
    END IF;


    RAISE NOTICE 'CREATING TRIAL SUBSCRIPTIONS...';
    for r in 
      (select * from core.organization as o
      left join payments.subscription_in_organization as sio 
      on o.id = sio.organization_id 
      where sio.id is null
      and o.status = 'exists'
     )
    loop   
      raise notice 'CREATING SUBSCRIPTION FOR WS: % % for % seats...', r.id, r.name, seat_count;
      
      insert into payments.subscription_in_organization (id, agent_id, plan_id, created_at, expires_at, organization_id, seat_count, status)
      values (uuid_generate_v4(), agent_id, trial_plan_id, current_timestamp, current_timestamp + interval '14 days', r.id, seat_count, 'in_trial');
    end loop;
    RAISE NOTICE 'DONE CREATING TRIAL SUBSCRIPTIONS.';
    return 1;
  end;
  $function$
;

-- 1. rename the enum type you want to change
alter type core.mail_type rename to _mail_type;
-- 2. create new type
create type core.mail_type as enum ('firstTrialExpire', 'secondTrialExpire');
-- 3. rename column(s) which uses our enum type
alter table core.user_mail_sent rename column mail_type to _mail_type;
-- 4. add new column of new type
alter table core.user_mail_sent add column mail_type core.mail_type;
-- 5. copy values to the new column
update core.user_mail_sent set mail_type = _mail_type::text::core.mail_type;
-- 6. remove old column and type
alter table core.user_mail_sent drop column _mail_type;
drop type core._mail_type;

-- add not null constraint back to the column
alter table core.user_mail_sent alter column mail_type set not null;

ALTER TABLE core.user_mail_sent
    ADD COLUMN user_in_organization_id uuid NOT NULL;

ALTER TABLE core.user_mail_sent ADD CONSTRAINT fk_user_mail_sent_user_in_organization_id
        FOREIGN KEY (user_in_organization_id) REFERENCES "core".user_in_organization(id);

ALTER TABLE ONLY core.user_mail_sent
    ADD CONSTRAINT user_mail_sent_pk PRIMARY KEY (user_id, user_in_organization_id, mail_type);

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
