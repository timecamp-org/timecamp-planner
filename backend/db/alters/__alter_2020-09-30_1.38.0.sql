
--
-- ALTER: 1.38.0
-- DATE: 2020-09-30
-- FEATURES:
-- Add function to add user to all public org projects
--

\set ON_ERROR_STOP on

DO $outer$
DECLARE
  previousVersion text = '1.37.1';
  newVersion text = '1.38.0';
BEGIN
  --
  -- CHECK DB VERSION
  --
  PERFORM core.check_schema_version(previousVersion, newVersion);

  --
  -- START ALTER (insert statements below)
  --

CREATE OR REPLACE FUNCTION "project-management".add_user_to_all_public_projects(u_id uuid, org_id uuid)
 RETURNS integer
 LANGUAGE plpgsql
AS $function$ 
  DECLARE 
    r record;
  begin
    IF u_id IS NULL
    THEN
      RAISE EXCEPTION 'u_id is not defined';
    END IF;
   
   IF org_id IS NULL
    THEN
      RAISE EXCEPTION 'org_id is not defined';
    END IF;


    RAISE NOTICE 'ADDING USER TO ALL PUBLIC PROJECTS...';


    for r in 
      (    
      select * from "project-management".project p 
		where p.organization_id = org_id 
		and p.project_type = 'project'
		and p.is_archived = false
		and p.status = 'exists'
		and p.is_private = false
		and p.id not in (
			select uip.project_id from "project-management".user_in_project uip 
			where uip.user_id = u_id 
		)
      )
    loop   
      raise notice 'ADDING USER TO SPACE: % %', r.id, r.name;
      
      insert into "project-management".user_in_project (id, user_id, project_id, role)
      values (uuid_generate_v4(), u_id, r.id, 'member');
     
    end loop;
    RAISE NOTICE 'DONE ADDING USER TO SPACES.';
    return 1;
  end;
  $function$
;

  -- END ALTER
  --

  --
  -- INSERT NEW VERSION
  --
  INSERT INTO core.schema_version (version_code) VALUES(newVersion);

END $outer$;
