const Notification =  ({message,type}) => {
    if (!message) {
        return null
    }

      let className = 'notification'; // Default class

  switch (type) {
    case 'error':
      className += ' error';
      break;
    case 'warning':
      className += ' warning';
      break;
    case 'success':
      className += ' success';
      break;
    default:
      break;
  }

    return (
        <div className={className}>
            {message}
        </div>
    )

}

export default Notification