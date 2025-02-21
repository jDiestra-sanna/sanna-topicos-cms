import Profile from '../../health-team-profile/Profile';
import history from '@history';
import React from 'react';

export default function SannaTeamHealthTeamProfile(props) {
  const { userId, campusId } = props.match.params;

  return (
    <Profile
      goBack={() => history.push('/topic-sanna-teams')}
      rootEndpoint={`/topic-sanna-teams/health-team-profiles`}
      rootPathEndpointFileViewer='/topic-sanna-teams/file-viewer'
      userId={userId}
      campusId={campusId}
    />
  );
}
