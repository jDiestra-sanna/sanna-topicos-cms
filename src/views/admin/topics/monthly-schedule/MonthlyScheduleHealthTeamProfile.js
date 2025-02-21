import Profile from '../../health-team-profile/Profile';
import history from '@history';
import React from 'react';

export default function MonthlyScheduleHealthTeamProfile(props) {
  const { userId, campusId } = props.match.params;

  return (
    <Profile
      goBack={() => history.push('/topic-calendars')}
      rootEndpoint={`/topic-calendars/health-team-profiles`}
      rootPathEndpointFileViewer='/topic-calendars/file-viewer'
      userId={userId}
      campusId={campusId}
    />
  );
}
