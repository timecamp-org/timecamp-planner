import { useHistory } from 'react-router';

import CredentialsPage from 'components/auth/CredentialsPage';

import NewWorkspaceForm from '../NewWorkspaceForm';

import styles from './styles.css';

const NewWorkspacePage = () => <CredentialsPage rightSideRenderer={() => <NewWorkspacePageComponent />} />;

function NewWorkspacePageComponent() {
  const history = useHistory();

  const onSuccess = () => {
    history.push('/first-workspace-creation-success');
  };

  return (
    <div className={styles.newWorkspacePage}>
      <div className={styles.content}>
        <NewWorkspaceForm onSuccess={onSuccess} hideCancelButton />
      </div>
    </div>
  );
}

export default NewWorkspacePage;
