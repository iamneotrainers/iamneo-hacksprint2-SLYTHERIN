'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Bell, CheckCircle, Briefcase, MessageCircle, Trophy, DollarSign, Circle, Filter, MoreHorizontal } from 'lucide-react';

const notifications = [
  {
    id: 1,
    type: 'bid',
    title: 'New bid received',
    description: 'John Smith placed a bid of $2,500 on your "E-commerce Website Development" project',
    timestamp: '5 minutes ago',
    unread: true,
    avatar: '/api/placeholder/40/40',
    link: '/projects/1/bids'
  },
  {
    id: 2,
    type: 'message',
    title: 'Message reply',
    description: 'Sarah Wilson replied to your message about the mobile app design requirements',
    timestamp: '1 hour ago',
    unread: true,
    avatar: '/api/placeholder/40/40',
    link: '/inbox/2'
  },
  {
    id: 3,
    type: 'award',
    title: 'Project awarded',
    description: 'Congratulations! Your bid was accepted for the "Mobile App UI/UX Design" project',
    timestamp: '2 hours ago',
    unread: false,
    avatar: '/api/placeholder/40/40',
    link: '/projects/3'
  },
  {
    id: 4,
    type: 'milestone',
    title: 'Milestone payment released',
    description: 'Payment of $500 has been released for milestone "Initial Design Concepts"',
    timestamp: '1 day ago',
    unread: false,
    avatar: '/api/placeholder/40/40',
    link: '/wallet'
  },
  {
    id: 5,
    type: 'feedback',
    title: 'New feedback received',
    description: 'Mike Johnson left a 5-star review for your completed logo design project',
    timestamp: '2 days ago',
    unread: false,
    avatar: '/api/placeholder/40/40',
    link: '/feedback'
  },
  {
    id: 6,
    type: 'system',
    title: 'Profile verification complete',
    description: 'Your profile has been successfully verified. You can now bid on premium projects',
    timestamp: '3 days ago',
    unread: false,
    avatar: null,
    link: '/profile/settings'
  }
];

export default function NotificationsPage() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedNotifications, setSelectedNotifications] = useState<number[]>([]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'bid': return <Briefcase className="h-5 w-5 text-blue-500" />;
      case 'message': return <MessageCircle className="h-5 w-5 text-green-500" />;
      case 'award': return <Trophy className="h-5 w-5 text-yellow-500" />;
      case 'milestone': return <DollarSign className="h-5 w-5 text-green-500" />;
      case 'feedback': return <Trophy className="h-5 w-5 text-purple-500" />;
      case 'system': return <Bell className="h-5 w-5 text-gray-500" />;
      default: return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'unread') return notification.unread;
    return notification.type === selectedFilter;
  });

  const unreadCount = notifications.filter(n => n.unread).length;

  const markAsRead = (id: number) => {
    // Implementation would update notification status
    console.log('Mark as read:', id);
  };

  const markAllAsRead = () => {
    // Implementation would mark all as read
    console.log('Mark all as read');
  };

  const toggleSelection = (id: number) => {
    setSelectedNotifications(prev => 
      prev.includes(id) 
        ? prev.filter(nId => nId !== id)
        : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Bell className="h-8 w-8" />
              Notifications
              {unreadCount > 0 && (
                <Badge className="bg-red-500 text-white">
                  {unreadCount} unread
                </Badge>
              )}
            </h1>
            <p className="text-gray-600 mt-2">Stay updated with your latest activities</p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button 
              variant="outline" 
              onClick={markAllAsRead}
              disabled={unreadCount === 0}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Mark all as read
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 mb-6 overflow-x-auto">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filter:</span>
          </div>
          
          {[
            { key: 'all', label: 'All', count: notifications.length },
            { key: 'unread', label: 'Unread', count: unreadCount },
            { key: 'bid', label: 'Bids', count: notifications.filter(n => n.type === 'bid').length },
            { key: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
            { key: 'award', label: 'Awards', count: notifications.filter(n => n.type === 'award').length },
            { key: 'milestone', label: 'Payments', count: notifications.filter(n => n.type === 'milestone').length }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setSelectedFilter(filter.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                selectedFilter === filter.key
                  ? 'bg-blue-100 text-blue-700 border border-blue-200'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>

        {/* Notifications List */}
        <div className="space-y-2">
          {filteredNotifications.map((notification) => (
            <Card 
              key={notification.id} 
              className={`cursor-pointer transition-all hover:shadow-md ${
                notification.unread ? 'border-l-4 border-l-blue-500 bg-blue-50' : 'hover:bg-gray-50'
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  {/* Icon/Avatar */}
                  <div className="flex-shrink-0">
                    {notification.avatar ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={notification.avatar} />
                        <AvatarFallback>
                          {notification.title.split(' ')[0].charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="h-10 w-10 bg-gray-100 rounded-full flex items-center justify-center">
                        {getNotificationIcon(notification.type)}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className={`text-sm ${notification.unread ? 'font-semibold' : 'font-medium'} text-gray-900`}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {notification.description}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <span className="text-xs text-gray-500">
                            {notification.timestamp}
                          </span>
                          {notification.unread && (
                            <div className="flex items-center gap-1">
                              <Circle className="h-2 w-2 fill-blue-500 text-blue-500" />
                              <span className="text-xs text-blue-600 font-medium">New</span>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex items-center gap-2 ml-4">
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
            <p className="text-gray-600">
              {selectedFilter === 'all' 
                ? "You're all caught up! No notifications to show." 
                : `No ${selectedFilter} notifications found.`}
            </p>
          </div>
        )}

        {/* Load More */}
        {filteredNotifications.length > 0 && (
          <div className="text-center mt-8">
            <Button variant="outline">
              Load more notifications
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}