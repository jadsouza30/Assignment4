import './Notification.css'
import NotificationCenter from 'react-notification-center-component';
import React, { useState } from 'react';

function Notification(props) {

  return (
    <div>
      <div className="noti">
        <NotificationCenter className="noticenter" appId="szJmGZMXtU" subscriberId={props.id}/>
      </div>
    </div>
    

  );
}

export default Notification;
