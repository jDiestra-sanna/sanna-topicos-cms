import Profile from './Profile';
import React from 'react';
import useAuthUser from 'hooks/auth-user';
import WError from 'widgets/WError';
import WLoading from 'widgets/WLoading';
import useLocalStorage, { Keys } from 'hooks/useLocalStorage';
import history from '@history'

function HealthTeamProfile() {
  const authUser = useAuthUser();
  const [attendance, _] = useLocalStorage(Keys.ATTENDANCE)

  if (!authUser.hasUserData()) {
    return (
      <WError
        error="Usuario no ha iniciado sesión, vuelva a iniciar sesión."
        onRetry={() => history.push('/login')}
      />
    );
  }

  if (!attendance) {
    return <WLoading label='Elija una sede de inicio de sesión'/>
  }

  return (
    <Profile
      userId={authUser.data.id}
      campusId={attendance.campus.id}
      rootPathEndpointFileViewer='/health-team-profiles/file-viewer'
    />
  );
}

export default HealthTeamProfile;
