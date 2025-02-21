import Profile from '../../health-team-profile/Profile';
import history from '@history';
import React from 'react';

export default function ManagementHealthTeamProfile(props) {
  const { campusId, userId } = props.match.params;

  return (
    <Profile
      goBack={() => history.push('/topic-managments')}
      rootEndpoint={`/topic-managments/health-team-profiles`}
      rootPathEndpointFileViewer='/topic-managments/file-viewer'
      userId={userId}
      campusId={campusId}
    />
  );
}
