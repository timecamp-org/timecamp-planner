  --
  -- ALTER: 1.50.0
  -- DATE: 22.08.2023
  -- FEATURES: 
  -- Implement Webhooks
  

\set ON_ERROR_STOP on

DO $outer$
DECLARE 
  previousVersion text = '1.49.0';
  newVersion text = '1.50.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

CREATE SCHEMA webhooks ;

ALTER SCHEMA webhooks OWNER TO heyspace;

CREATE TABLE webhooks.webhook ( 
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  callback_url varchar(200) not null, 
  user_id uuid not null  CONSTRAINT webhook_user_id_fk REFERENCES core.user(id),  
  secret_key varchar(200) not null,     
  
  status core.entity_status DEFAULT 'exists'::core.entity_status NOT NULL,

  CONSTRAINT webhook_pk PRIMARY KEY (id) 
  );


ALTER TABLE webhooks.webhook owner TO heyspace;


DROP TRIGGER IF EXISTS watched_organization_table_trigger
ON core.organization;
CREATE TRIGGER watched_organization_table_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON core.organization
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id');


CREATE TABLE webhooks.webhook_delivery_failure (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  webhook_id uuid ,
  response jsonb,
  
  failed_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
  

  CONSTRAINT webhook_fail_pk PRIMARY KEY(id),
  CONSTRAINT webhook_id_pk_fk FOREIGN KEY (webhook_id) REFERENCES webhooks.webhook(id) ON DELETE CASCADE
);

ALTER TABLE webhooks.webhook_delivery_failure OWNER TO heyspace;


  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;