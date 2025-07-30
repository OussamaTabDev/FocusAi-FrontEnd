
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, Edit, Save, X, User, Mail, Calendar, Target, Trophy, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'A productivity enthusiast who loves to track progress and achieve goals.',
    joinDate: 'January 2024',
    avatar: 'https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=150&h=150&fit=crop&crop=face'
  });

  const [editedProfile, setEditedProfile] = useState(profile);

  const stats = [
    { label: 'Total Hours Tracked', value: '1,247', icon: Clock },
    { label: 'Goals Achieved', value: '23', icon: Trophy },
    { label: 'Current Streak', value: '12 days', icon: Target },
    { label: 'Productivity Score', value: '87%', icon: User }
  ];

  const achievements = [
    { name: 'Early Bird', description: 'Started work before 8 AM for 7 days', earned: true },
    { name: 'Focus Master', description: 'Completed 10 focus sessions', earned: true },
    { name: 'Goal Crusher', description: 'Achieved 5 weekly goals', earned: true },
    { name: 'Consistency King', description: 'Tracked time for 30 consecutive days', earned: false },
    { name: 'Break Taker', description: 'Took breaks every hour for a week', earned: false }
  ];

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <h1 className="text-3xl font-bold">Profile</h1>
          </div>
          <div className="flex space-x-2">
            {!isEditing ? (
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Profile
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="h-4 w-4 mr-2" />
                  Cancel
                </Button>
                <Button onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Profile Info Card */}
        <Card className="p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={profile.avatar} alt={profile.name} />
              <AvatarFallback className="text-2xl">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 space-y-4">
              {!isEditing ? (
                <>
                  <div>
                    <h2 className="text-2xl font-bold">{profile.name}</h2>
                    <p className="text-muted-foreground flex items-center mt-1">
                      <Mail className="h-4 w-4 mr-2" />
                      {profile.email}
                    </p>
                    <p className="text-muted-foreground flex items-center mt-1">
                      <Calendar className="h-4 w-4 mr-2" />
                      Joined {profile.joinDate}
                    </p>
                  </div>
                  <p className="text-sm">{profile.bio}</p>
                </>
              ) : (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={editedProfile.bio}
                      onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                      rows={3}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <Card key={index} className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Achievements */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">Achievements</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {achievements.map((achievement, index) => (
              <div key={index} className="flex items-start space-x-4 p-4 rounded-lg border">
                <div className={`p-2 rounded-full ${achievement.earned ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                  <Trophy className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h4 className="font-medium">{achievement.name}</h4>
                    {achievement.earned && (
                      <Badge variant="secondary" className="text-xs">Earned</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Productivity Overview */}
        <Card className="p-6">
          <h3 className="text-xl font-semibold mb-4">This Week's Progress</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Daily Goal Progress</span>
                <span>7/8 hours</span>
              </div>
              <Progress value={87.5} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Focus Sessions</span>
                <span>12/15 completed</span>
              </div>
              <Progress value={80} className="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Break Reminders Followed</span>
                <span>18/20 taken</span>
              </div>
              <Progress value={90} className="h-2" />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
