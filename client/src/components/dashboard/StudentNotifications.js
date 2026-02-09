export default function StudentNotifications({ notifications }) {
  if (!notifications || notifications.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>🎉 You're all caught up! No new notifications.</p>
      </div>
    );
  }

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'exam':
        return '📝';
      case 'grade':
        return '📊';
      case 'announcement':
        return '📢';
      case 'deadline':
        return '⏰';
      case 'achievement':
        return '🏆';
      case 'warning':
        return '⚠️';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type) => {
    switch (type) {
      case 'exam':
        return 'bg-blue-50 border-blue-200 text-blue-800';
      case 'grade':
        return 'bg-green-50 border-green-200 text-green-800';
      case 'announcement':
        return 'bg-purple-50 border-purple-200 text-purple-800';
      case 'deadline':
        return 'bg-orange-50 border-orange-200 text-orange-800';
      case 'achievement':
        return 'bg-yellow-50 border-yellow-200 text-yellow-800';
      case 'warning':
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-gray-50 border-gray-200 text-gray-800';
    }
  };

  return (
    <div className="space-y-3">
      {notifications.map((notification, index) => (
        <div
          key={index}
          className={`p-3 border rounded-lg ${getNotificationColor(notification.type)}`}
        >
          <div className="flex items-start space-x-3">
            <span className="text-xl flex-shrink-0">{getNotificationIcon(notification.type)}</span>
            <div className="flex-1 min-w-0">
              <div className="font-medium">{notification.title}</div>
              <div className="text-sm mt-1">{notification.message}</div>
              {notification.time && (
                <div className="text-xs mt-2 opacity-75">{notification.time}</div>
              )}
            </div>
            {notification.action && (
              <button
                onClick={notification.action.onClick}
                className="text-sm font-medium hover:underline whitespace-nowrap flex-shrink-0"
              >
                {notification.action.label} →
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
