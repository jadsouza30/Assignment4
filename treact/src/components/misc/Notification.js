import './Notification.css'
import NotificationCenter from 'react-notification-center-component';
import React, { useState } from 'react';

function Notification() {
  const [id, setid] = useState('foo2');
  const sendNotification = (event) => {
    event.preventDefault();
    const notiObject = {
      msg: "TEST MESSAGE"
    };
    var endpoint = 'https://api.ravenhub.io/company/szJmGZMXtU/subscribers/' + id + '/events/Y0cBxL0ADz';
    fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(notiObject)
    }).then(response => console.log(response));
  }
  
  return (
    <div>
      <button className="btn" onClick={sendNotification}>
        CLICK ME 
      </button> 
      <div className="noti">
        <NotificationCenter className="yoyo" appId="szJmGZMXtU" subscriberId={id}/>
      </div>
    </div>
    

  );
}

export default Notification;
