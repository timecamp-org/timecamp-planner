
import CredentialsPage from 'components/auth/CredentialsPage';

import WorkspaceInvitationsForm from '../WorkspaceInvitationsForm';

import styles from './styles.css';

const WorkspaceInvitationsPage = () => <CredentialsPage rightSideRenderer={renderWorkspaceInvitationPage} />;

function renderWorkspaceInvitationPage() {
  return (
    <div className={styles.workspaceInvitationPage}>
      <div className={styles.content}>
        <WorkspaceInvitationsForm />
      </div>
    </div>
  );
}

export default WorkspaceInvitationsPage;
