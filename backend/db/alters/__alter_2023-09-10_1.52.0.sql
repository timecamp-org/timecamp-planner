  --
  -- ALTER: 1.52.0
  -- DATE: 10.09.2023
  -- FEATURES: 
  -- replace Estimate with Points
  

\set ON_ERROR_STOP on

DO $outer$
DECLARE 
  previousVersion text = '1.51.0';
  newVersion text = '1.52.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --.
  -- START ALTER (insert statements below)
  --

 

CREATE SCHEMA templates;

ALTER SCHEMA templates OWNER TO heyspace;

CREATE TABLE templates.project_template(
    id uuid DEFAULT uuid_generate_v4() NOT NULL,
    organization_id uuid,
    project_id uuid,
    name character varying(8000),
    description text,
    project_type "project-management".project_type DEFAULT 'project'::"project-management".project_type,
    creator_id uuid,
    color character varying(20),
        
    CONSTRAINT project_template_pkey PRIMARY KEY (id),
    CONSTRAINT project_template_organization_id_fk FOREIGN KEY (organization_id) REFERENCES core.organization(id) ON UPDATE CASCADE ON DELETE CASCADE,
    CONSTRAINT project_template_creator_id_fk FOREIGN KEY (creator_id) REFERENCES core.user(id) ON DELETE SET NULL ON UPDATE SET NULL,
    CONSTRAINT project_id_fk FOREIGN KEY (project_id) REFERENCES "project-management".project(id) ON DELETE SET NULL,
    UNIQUE (name, organization_id)
);

ALTER TABLE templates.project_template OWNER TO heyspace;


DROP TRIGGER IF EXISTS watched_project_template_table_trigger
ON templates.project_template;
CREATE TRIGGER watched_project_template_table_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON templates.project_template
  FOR EACH ROW EXECUTE PROCEDURE watchers.notify_trigger('id');



CREATE TABLE templates.task_list_template (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  name character varying(500),
  "order" double precision NOT NULL CHECK ("order" > 0),
  project_template_id uuid,

  CONSTRAINT task_list_template_pk PRIMARY KEY (id),
  CONSTRAINT project_template_id_fk FOREIGN KEY (project_template_id) REFERENCES templates.project_template(id) ON DELETE CASCADE
);

ALTER TABLE templates.task_list_template OWNER TO heyspace;


CREATE TABLE templates.task_template (
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  project_template_id uuid,
  name character varying(500),
  description character varying(500),
  task_priority_type character varying(7),
  task_list_template_id uuid ,
  "order" double precision NOT NULL CHECK ("order" > 0),
  progress integer,

  CONSTRAINT task_template_pk PRIMARY KEY (id),
  CONSTRAINT task_list_template_id_fk FOREIGN KEY (task_list_template_id) REFERENCES templates.task_list_template(id) on DELETE CASCADE
);

ALTER TABLE templates.task_template OWNER TO heyspace;

CREATE TABLE templates.tag_template (
  id uuid DEFAULT uuid_generate_v4() PRIMARY KEY NOT NULL,
  name character varying(500),
  organization_id uuid, 
  color character varying(20),
  
  CONSTRAINT organization_id_fk FOREIGN KEY (organization_id) REFERENCES core.organization(id) on DELETE CASCADE
);

ALTER TABLE templates.tag_template OWNER TO heyspace;

CREATE TABLE templates.task_template_has_tag (
    task_template_id uuid NOT NULL,
    tag_template_id uuid NOT NULL,    
    CONSTRAINT task_template_id_fk FOREIGN KEY (task_template_id) REFERENCES templates.task_template(id) ON DELETE CASCADE,
    CONSTRAINT tag_template_id_fk FOREIGN KEY (tag_template_id) REFERENCES templates.tag_template(id) ON DELETE CASCADE

);

ALTER TABLE templates.task_template_has_tag OWNER TO heyspace;

CREATE TABLE templates.checklist_item_template(
  id uuid DEFAULT uuid_generate_v4() NOT NULL,
  task_template_id uuid ,
  "order" double precision NOT NULL CHECK ("order" > 0),
  name character varying(500),
  is_checked boolean NOT NULL DEFAULT FALSE,

  CONSTRAINT checklist_item_template_pk PRIMARY KEY(id),
  CONSTRAINT task_template_id_fk FOREIGN KEY (task_template_id) REFERENCES templates.task_template(id) ON DELETE CASCADE

);
ALTER TABLE templates.checklist_item_template OWNER TO heyspace;

 

  --
  -- END ALTER
  --

  --
  -- INSER NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;