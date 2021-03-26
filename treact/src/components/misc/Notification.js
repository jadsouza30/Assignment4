import './Notification.css'
import NotificationCenter from 'react-notification-center-component';
import React, { useState } from 'react';

function Notification() {

  return (
    <div>
      <div className="noti">
        <NotificationCenter className="noticenter" appId="szJmGZMXtU" subscriberId="foo3"/>
      </div>
    </div>
    

  );
}

export default Notification;
